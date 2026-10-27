import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  Type,
} from "npm:@google/genai@1.35.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { CONFERENCES, FREE_DINNER_WINS } from "../_shared/conferences.ts";

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

const LEAGUE_ID = Deno.env.get("LEAGUE_ID")!;
const SLEEPER = "https://api.sleeper.app/v1";

// Tried in order until one succeeds.
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];
const ATTEMPTS_PER_MODEL = 2;
const RETRYABLE = new Set([429, 500, 503]);
const REQUEST_TIMEOUT_MS = 35_000; // max wait for a single Gemini call
const TOTAL_BUDGET_MS = 120_000; // stay safely under Supabase's 150s limit

const MAX_STORYLINES = 8;
const CONFERENCE_NAMES = CONFERENCES.map((c) => c.name);
const MAX_TRANSACTIONS = 25;

// Which player positions can fill each Sleeper lineup slot.
const SLOT_ELIGIBILITY: Record<string, string[]> = {
  QB: ["QB"],
  RB: ["RB"],
  WR: ["WR"],
  TE: ["TE"],
  K: ["K"],
  DEF: ["DEF"],
  FLEX: ["RB", "WR", "TE"],
  WRRB_FLEX: ["WR", "RB"],
  REC_FLEX: ["WR", "TE"],
  SUPER_FLEX: ["QB", "RB", "WR", "TE"],
};
const NON_STARTING_SLOTS = new Set(["BN", "IR", "TAXI"]);

// One angle per week, rotating, so recaps don't all lean on the same thing.
const LENSES = [
  "lineup decisions: who left points on the bench and who started a dud",
  "the waiver wire and trades: who helped themselves and who got fleeced",
  "luck: who won ugly, who lost despite scoring well, and real records versus all-play records",
  "momentum: streaks, collapses, and who is trending which way",
  "rivalries and family: earlier meetings this season and the people involved",
  "standings pressure: who is running out of time and who is coasting",
];

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY")! });

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SleeperUser = {
  user_id: string;
  display_name: string;
  metadata?: { team_name?: string };
};
type SleeperRoster = { owner_id: string | null; roster_id: number };
type SleeperMatchup = {
  matchup_id: number | null;
  roster_id: number;
  points: number | null;
  starters?: string[];
  starters_points?: number[];
  players?: string[];
  players_points?: Record<string, number>;
};
type SleeperState = {
  season: string;
  week: number;
  season_type: "pre" | "regular" | "post";
};
type SleeperLeague = {
  season: string;
  name: string;
  roster_positions?: string[];
};
type SleeperTransaction = {
  type: "trade" | "free_agent" | "waiver" | "commissioner";
  status: string;
  roster_ids: number[];
  adds: Record<string, number> | null;
  drops: Record<string, number> | null;
  settings?: { waiver_bid?: number } | null;
  draft_picks?: {
    season: string;
    round: number;
    owner_id: number;
    previous_owner_id: number;
  }[];
};
type OwnerName = { name: string | null; sleeperId: string };
type PlayerInfo = {
  id: string;
  name: string;
  position: string | null;
  team: string | null;
};
type Game = {
  week: number;
  rosterId: number;
  opponentId: number;
  points: number;
  opponentPoints: number;
  result: "W" | "L" | "T";
};
type SeasonLine = {
  owner: string;
  team: string;
  leaguePosition: number;
  record: string;
  allPlayRecord: string;
  pointsFor: number;
  pointsForRank: number;
  pointsAgainst: number;
  streak?: string;
  lastFive: string;
  seasonHigh?: number;
  seasonLow?: number;
  gamesPlayed: number;
};
type PreviousRecap = {
  week: number;
  body: string;
  conference_summary: string | null;
  storylines: string[] | null;
};

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const sleeper = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${SLEEPER}${path}`);
  if (!res.ok) throw new Error(`Sleeper ${path} returned ${res.status}`);
  return (await res.json()) as T;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const round2 = (n: number) => Math.round(n * 100) / 100;
const fmtRecord = (w: number, l: number, t: number) =>
  t ? `${w}-${l}-${t}` : `${w}-${l}`;

function pairUp(entries: SleeperMatchup[]) {
  const byId = new Map<number, SleeperMatchup[]>();
  for (const e of entries) {
    if (e.matchup_id == null) continue;
    const group = byId.get(e.matchup_id) ?? [];
    group.push(e);
    byId.set(e.matchup_id, group);
  }
  return [...byId.values()].filter((g) => g.length === 2) as [
    SleeperMatchup,
    SleeperMatchup,
  ][];
}

const isScoreless = ([a, b]: [SleeperMatchup, SleeperMatchup]) =>
  (a.points ?? 0) === 0 && (b.points ?? 0) === 0;

function streakOf(results: string[]) {
  if (!results.length) return undefined;
  const last = results[results.length - 1];
  let n = 0;
  for (let i = results.length - 1; i >= 0 && results[i] === last; i--) n++;
  return `${last}${n}`;
}

function parseJson<T>(text: string | undefined): T {
  if (!text) throw new Error("Model returned no text");
  const clean = text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  return JSON.parse(clean) as T;
}

// ---------------------------------------------------------------------------
// Gemini with retries, per-call timeouts and an overall time budget
// ---------------------------------------------------------------------------

type GenerateParams = Omit<
  Parameters<typeof ai.models.generateContent>[0],
  "model"
>;

async function generateWithRetries(params: GenerateParams) {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastErr: unknown;

  for (const model of MODELS) {
    for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
      const remaining = deadline - Date.now();
      if (remaining < 5_000) {
        throw lastErr ?? new Error("Ran out of time waiting for Gemini");
      }

      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
          config: {
            ...params.config,
            abortSignal: AbortSignal.timeout(
              Math.min(REQUEST_TIMEOUT_MS, remaining),
            ),
          },
        });
        return { response, model };
      } catch (err) {
        lastErr = err;
        const name = (err as Error)?.name;
        const timedOut = name === "TimeoutError" || name === "AbortError";
        const status = (err as { status?: number }).status;

        if (timedOut) {
          console.warn(`${model} timed out, trying next model`);
          break; // a hung model is unlikely to recover, so move on
        }
        if (!status || !RETRYABLE.has(status)) throw err;

        console.warn(
          `${model} attempt ${attempt}/${ATTEMPTS_PER_MODEL} failed (${status})`,
        );
        if (attempt < ATTEMPTS_PER_MODEL) await sleep(3000 * attempt);
      }
    }
  }
  throw lastErr;
}

// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

async function weekHasScores(week: number) {
  const entries = await sleeper<SleeperMatchup[]>(
    `/league/${LEAGUE_ID}/matchups/${week}`,
  );
  return pairUp(entries).some((pair) => !isScoreless(pair));
}

async function getPlayers(ids: string[]) {
  const unique = [...new Set(ids.filter((id) => id && id !== "0"))];
  const chunks: string[][] = [];
  for (let i = 0; i < unique.length; i += 150) {
    chunks.push(unique.slice(i, i + 150));
  }

  const results = await Promise.all(
    chunks.map((chunk) =>
      supabase
        .from("players")
        .select("id, name, position, team")
        .in("id", chunk),
    ),
  );

  const map = new Map<string, PlayerInfo>();
  for (const { data, error } of results) {
    if (error) throw error;
    for (const p of (data ?? []) as PlayerInfo[]) map.set(p.id, p);
  }
  return map;
}

async function getPreviousRecap(
  year: number,
  week: number,
): Promise<PreviousRecap | null> {
  const { data, error } = await supabase
    .from("recaps")
    .select("week, body, conference_summary, storylines")
    .eq("year", year)
    .lt("week", week)
    .order("week", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as PreviousRecap | null;
}

async function getLeagueContext() {
  const [owners, stats] = await Promise.all([
    supabase.from("owners").select("name, bio, active"),
    supabase
      .from("stats")
      .select("team, year, wins, loses, ptsFor, finalPlace"),
  ]);
  if (owners.error) throw owners.error;
  if (stats.error) throw stats.error;
  return JSON.stringify({ owners: owners.data, seasonHistory: stats.data });
}

// ---------------------------------------------------------------------------
// Turning raw Sleeper data into a short list of notable facts
// ---------------------------------------------------------------------------

async function buildWeekData(league: SleeperLeague, week: number) {
  const weeks = Array.from({ length: week }, (_, i) => i + 1);

  const [users, rosters, ownersRes, rawTransactions, allWeeks] =
    await Promise.all([
      sleeper<SleeperUser[]>(`/league/${LEAGUE_ID}/users`),
      sleeper<SleeperRoster[]>(`/league/${LEAGUE_ID}/rosters`),
      supabase.from("owners").select("name, sleeperId"),
      sleeper<SleeperTransaction[]>(
        `/league/${LEAGUE_ID}/transactions/${week}`,
      ),
      Promise.all(
        weeks.map((w) =>
          sleeper<SleeperMatchup[]>(`/league/${LEAGUE_ID}/matchups/${w}`),
        ),
      ),
    ]);
  if (ownersRes.error) throw ownersRes.error;

  // --- Who is who --------------------------------------------------------
  const userById = new Map(users.map((u) => [u.user_id, u]));
  const ownerBySleeperId = new Map(
    ((ownersRes.data ?? []) as OwnerName[]).map((o) => [o.sleeperId, o.name]),
  );
  const identity = new Map<number, { owner: string; team: string }>();
  for (const r of rosters) {
    const user = userById.get(r.owner_id ?? "");
    identity.set(r.roster_id, {
      owner:
        ownerBySleeperId.get(user?.user_id ?? "") ??
        user?.display_name ??
        `Team ${r.roster_id}`,
      team:
        user?.metadata?.team_name ||
        user?.display_name ||
        `Team ${r.roster_id}`,
    });
  }
  const ownerOf = (rid: number | undefined) =>
    rid == null ? "unknown" : (identity.get(rid)?.owner ?? `Team ${rid}`);

  // --- Every completed game this season, from both sides ------------------
  const games: Game[] = [];
  allWeeks.forEach((entries, i) => {
    for (const pair of pairUp(entries)) {
      if (isScoreless(pair)) continue;
      const [a, b] = pair;
      const pa = a.points ?? 0;
      const pb = b.points ?? 0;
      const res = (x: number, y: number) => (x > y ? "W" : x < y ? "L" : "T");
      games.push(
        {
          week: i + 1,
          rosterId: a.roster_id,
          opponentId: b.roster_id,
          points: pa,
          opponentPoints: pb,
          result: res(pa, pb),
        },
        {
          week: i + 1,
          rosterId: b.roster_id,
          opponentId: a.roster_id,
          points: pb,
          opponentPoints: pa,
          result: res(pb, pa),
        },
      );
    }
  });

  // --- Season standings and context ---------------------------------------
  const allPlay = new Map<number, { w: number; l: number; t: number }>();
  for (const w of weeks) {
    const weekGames = games.filter((g) => g.week === w);
    for (const g of weekGames) {
      const ap = allPlay.get(g.rosterId) ?? { w: 0, l: 0, t: 0 };
      for (const other of weekGames) {
        if (other.rosterId === g.rosterId) continue;
        if (g.points > other.points) ap.w++;
        else if (g.points < other.points) ap.l++;
        else ap.t++;
      }
      allPlay.set(g.rosterId, ap);
    }
  }

  const lines = rosters.map((r) => {
    const g = games
      .filter((x) => x.rosterId === r.roster_id)
      .sort((a, b) => a.week - b.week);
    const wins = g.filter((x) => x.result === "W").length;
    const losses = g.filter((x) => x.result === "L").length;
    const ties = g.filter((x) => x.result === "T").length;
    const ap = allPlay.get(r.roster_id) ?? { w: 0, l: 0, t: 0 };
    const scores = g.map((x) => x.points);
    return {
      rosterId: r.roster_id,
      wins,
      ties,
      line: {
        owner: ownerOf(r.roster_id),
        team: identity.get(r.roster_id)?.team ?? `Team ${r.roster_id}`,
        leaguePosition: 0,
        record: fmtRecord(wins, losses, ties),
        allPlayRecord: fmtRecord(ap.w, ap.l, ap.t),
        pointsFor: round2(scores.reduce((s, x) => s + x, 0)),
        pointsForRank: 0,
        pointsAgainst: round2(g.reduce((s, x) => s + x.opponentPoints, 0)),
        streak: streakOf(g.map((x) => x.result)),
        lastFive: g
          .slice(-5)
          .map((x) => x.result)
          .join(""),
        seasonHigh: scores.length ? round2(Math.max(...scores)) : undefined,
        seasonLow: scores.length ? round2(Math.min(...scores)) : undefined,
        gamesPlayed: g.length,
      } as SeasonLine,
    };
  });

  [...lines]
    .sort(
      (a, b) =>
        b.wins - a.wins ||
        b.ties - a.ties ||
        b.line.pointsFor - a.line.pointsFor,
    )
    .forEach((x, i) => (x.line.leaguePosition = i + 1));
  [...lines]
    .sort((a, b) => b.line.pointsFor - a.line.pointsFor)
    .forEach((x, i) => (x.line.pointsForRank = i + 1));

  const season = new Map(lines.map((x) => [x.rosterId, x.line]));
  const standings = [...season.values()].sort(
    (a, b) => a.leaguePosition - b.leaguePosition,
  );

  // --- This week ----------------------------------------------------------
  const thisWeek = allWeeks[week - 1] ?? [];
  const byRoster = new Map(thisWeek.map((m) => [m.roster_id, m]));
  const pairs = pairUp(thisWeek).filter((p) => !isScoreless(p));

  const players = await getPlayers([
    ...thisWeek.flatMap((m) => m.players ?? []),
    ...rawTransactions.flatMap((t) => [
      ...Object.keys(t.adds ?? {}),
      ...Object.keys(t.drops ?? {}),
    ]),
  ]);

  const describe = (id: string) => {
    if (!id || id === "0") return "an empty roster slot";
    const p = players.get(id);
    if (!p) return `an unknown player (${id})`;
    return p.position ? `${p.name} (${p.position})` : p.name;
  };

  const slots = (league.roster_positions ?? []).filter(
    (s) => !NON_STARTING_SLOTS.has(s),
  );

  const lineupFacts = (m: SleeperMatchup) => {
    const pts = m.players_points ?? {};
    const starters = m.starters ?? [];
    const starterRows = starters.map((id, i) => ({
      id,
      slot: slots[i] ?? "FLEX",
      points: round2(m.starters_points?.[i] ?? pts[id] ?? 0),
    }));
    const filled = starterRows.filter((s) => s.id && s.id !== "0");
    const starterSet = new Set(starters);
    const bench = (m.players ?? [])
      .filter((id) => !starterSet.has(id))
      .map((id) => ({ id, points: round2(pts[id] ?? 0) }));

    const top = filled.reduce<(typeof filled)[number] | undefined>(
      (best, s) => (!best || s.points > best.points ? s : best),
      undefined,
    );
    const worst = filled.reduce<(typeof filled)[number] | undefined>(
      (low, s) => (!low || s.points < low.points ? s : low),
      undefined,
    );
    const bestBench = bench.reduce<(typeof bench)[number] | undefined>(
      (best, b) => (!best || b.points > best.points ? b : best),
      undefined,
    );

    // The single bench-for-starter swap that would have gained the most.
    let mistake:
      | {
          benched: string;
          benchedPoints: number;
          startedInstead: string;
          startedPoints: number;
          pointsLeftOnBench: number;
        }
      | undefined;
    for (const s of starterRows) {
      const eligible = SLOT_ELIGIBILITY[s.slot] ?? [s.slot];
      for (const b of bench) {
        const pos = players.get(b.id)?.position;
        if (!pos || !eligible.includes(pos)) continue;
        const gain = round2(b.points - s.points);
        if (gain > (mistake?.pointsLeftOnBench ?? 0)) {
          mistake = {
            benched: describe(b.id),
            benchedPoints: b.points,
            startedInstead: describe(s.id),
            startedPoints: s.points,
            pointsLeftOnBench: gain,
          };
        }
      }
    }

    const emptySlots = starterRows.length - filled.length;
    return {
      topStarter: top && { player: describe(top.id), points: top.points },
      worstStarter: worst && {
        player: describe(worst.id),
        points: worst.points,
      },
      emptyStartingSlots: emptySlots || undefined,
      benchPoints: round2(bench.reduce((s, b) => s + b.points, 0)),
      bestBenchPlayer:
        bestBench && bestBench.points > 0
          ? { player: describe(bestBench.id), points: bestBench.points }
          : undefined,
      biggestLineupMistake: mistake,
    };
  };

  const teamWeek = (m: SleeperMatchup) => {
    const s = season.get(m.roster_id);
    const points = round2(m.points ?? 0);
    // Only meaningful once there are a few games and the scores actually vary.
    const enough = (s?.gamesPlayed ?? 0) >= 3 && s?.seasonHigh !== s?.seasonLow;
    return {
      owner: ownerOf(m.roster_id),
      team: s?.team,
      points,
      recordAfterThisWeek: s?.record,
      leaguePosition: s?.leaguePosition,
      streak: s?.streak,
      seasonHighScore: enough && points === s?.seasonHigh ? true : undefined,
      seasonLowScore: enough && points === s?.seasonLow ? true : undefined,
      ...lineupFacts(m),
    };
  };

  const allScores = pairs
    .flatMap(([a, b]) => [a.points ?? 0, b.points ?? 0])
    .sort((a, b) => a - b);
  const mid = Math.floor(allScores.length / 2);
  const median =
    allScores.length % 2
      ? allScores[mid]
      : ((allScores[mid - 1] ?? 0) + (allScores[mid] ?? 0)) / 2;

  const matchups = pairs.map(([a, b]) => {
    const [win, lose] = (a.points ?? 0) >= (b.points ?? 0) ? [a, b] : [b, a];
    const winner = teamWeek(win);
    const loser = teamWeek(lose);
    const margin = round2(winner.points - loser.points);
    const earlier = games
      .filter(
        (g) =>
          g.rosterId === win.roster_id &&
          g.opponentId === lose.roster_id &&
          g.week < week,
      )
      .map((g) =>
        g.result === "T"
          ? `week ${g.week}: tied ${g.points}-${g.opponentPoints}`
          : `week ${g.week}: ${
              g.result === "W" ? winner.owner : loser.owner
            } won ${Math.max(g.points, g.opponentPoints)}-${Math.min(
              g.points,
              g.opponentPoints,
            )}`,
      );

    return {
      winner,
      loser,
      margin,
      tie: margin === 0 ? true : undefined,
      blowout: margin > 40 ? true : undefined,
      loserOutscoredLeagueMedian: loser.points > median ? true : undefined,
      loserWouldHaveWonWithBetterLineup:
        (loser.biggestLineupMistake?.pointsLeftOnBench ?? 0) > margin
          ? true
          : undefined,
      earlierMeetingsThisSeason: earlier.length ? earlier : undefined,
    };
  });

  // --- Conference race ----------------------------------------------------
  const conferenceOf = new Map(
    CONFERENCES.flatMap((c) =>
      c.rosterIds.map((rid) => [rid, c.name] as const),
    ),
  );
  const tally = (gs: Game[]) =>
    fmtRecord(
      gs.filter((g) => g.result === "W").length,
      gs.filter((g) => g.result === "L").length,
      gs.filter((g) => g.result === "T").length,
    );

  const winsIn = (gs: Game[]) => gs.filter((g) => g.result === "W").length;

  const race = CONFERENCES.map((c) => {
    const own = games.filter((g) => c.rosterIds.includes(g.rosterId));
    const cross = (gs: Game[]) =>
      gs.filter((g) => conferenceOf.get(g.opponentId) !== c.name);
    const thisWeek = own.filter((g) => g.week === week);
    return {
      conference: c.name,
      wins: winsIn(own),
      winsBeforeThisWeek: winsIn(own) - winsIn(thisWeek),
      pointsFor: round2(own.reduce((s, g) => s + g.points, 0)),
      crossConferenceRecord: tally(cross(own)),
      crossConferenceRecordThisWeek: tally(cross(thisWeek)),
      owners: c.rosterIds.map((rid) => ({
        owner: ownerOf(rid),
        record: season.get(rid)?.record,
        crossConferenceRecord: tally(
          cross(own.filter((g) => g.rosterId === rid)),
        ),
      })),
    };
  });
  const [ca, cb] = race;
  // Fewer wins pays; combined points break a tie. Matches the Home page.
  const payer =
    ca.wins < cb.wins || (ca.wins === cb.wins && ca.pointsFor < cb.pointsFor)
      ? ca
      : cb;
  const other = payer === ca ? cb : ca;

  // Spelled out as sentences so the model reports the race instead of
  // working it out, which lite models tend to get backwards.
  const standing = (a: number, b: number, verb: string) =>
    a === b
      ? `tied at ${a} wins each`
      : a > b
        ? `${ca.conference} ${verb} ${a}-${b}`
        : `${cb.conference} ${verb} ${b}-${a}`;
  const swing =
    ca.wins - cb.wins - (ca.winsBeforeThisWeek - cb.winsBeforeThisWeek);

  const facts = [
    ca.wins === cb.wins
      ? `The ${ca.conference} and ${cb.conference} are tied at ${ca.wins} wins each. The ${payer.conference} have fewer combined points, so on the tiebreaker the ${payer.conference} are currently buying the food.`
      : `The ${other.conference} lead the ${payer.conference} ${other.wins}-${payer.wins} in combined wins, a lead of ${other.wins - payer.wins}. The ${payer.conference} are trailing, so the ${payer.conference} are currently buying the food.`,
    `Before this week: ${standing(ca.winsBeforeThisWeek, cb.winsBeforeThisWeek, "led")}. After this week: ${standing(ca.wins, cb.wins, "lead")}.`,
    swing === 0
      ? "The gap between the conferences did not change this week."
      : `This week the ${swing > 0 ? ca.conference : cb.conference} gained ${Math.abs(swing)} ${Math.abs(swing) === 1 ? "win" : "wins"} on the ${swing > 0 ? cb.conference : ca.conference}.`,
    ...race.map((c) =>
      c.wins >= FREE_DINNER_WINS
        ? `The ${c.conference} have clinched a free dinner.`
        : `The ${c.conference} need ${FREE_DINNER_WINS - c.wins} more wins to clinch a free dinner.`,
    ),
  ];

  const crossGames = pairs
    .filter(
      ([a, b]) =>
        conferenceOf.get(a.roster_id) !== conferenceOf.get(b.roster_id),
    )
    .map((pair) => {
      const [win, lose] =
        (pair[0].points ?? 0) >= (pair[1].points ?? 0)
          ? pair
          : [pair[1], pair[0]];
      const label = (m: SleeperMatchup) =>
        `${ownerOf(m.roster_id)} (${conferenceOf.get(m.roster_id)})`;
      const margin = round2((win.points ?? 0) - (lose.points ?? 0));
      return margin === 0
        ? `${label(win)} and ${label(lose)} tied.`
        : `${label(win)} beat ${label(lose)} by ${margin}.`;
    });

  const conferences = {
    facts,
    crossConferenceGamesThisWeek: crossGames.length
      ? crossGames
      : ["There were no cross-conference games this week."],
    conferences: race,
  };

  // --- League-wide highlights ---------------------------------------------
  const teamsThisWeek = pairs.flat();
  const byPoints = [...teamsThisWeek].sort(
    (a, b) => (b.points ?? 0) - (a.points ?? 0),
  );
  const byMargin = [...matchups].sort((a, b) => a.margin - b.margin);

  let bestStarter: { id: string; rid: number; points: number } | undefined;
  let bestBenched: { id: string; rid: number; points: number } | undefined;
  for (const m of teamsThisWeek) {
    const pts = m.players_points ?? {};
    const starterSet = new Set(m.starters ?? []);
    for (const id of m.players ?? []) {
      const p = pts[id] ?? 0;
      if (starterSet.has(id)) {
        if (!bestStarter || p > bestStarter.points) {
          bestStarter = { id, rid: m.roster_id, points: p };
        }
      } else if (!bestBenched || p > bestBenched.points) {
        bestBenched = { id, rid: m.roster_id, points: p };
      }
    }
  }

  const leagueWeek = {
    highestScore: byPoints[0] && {
      owner: ownerOf(byPoints[0].roster_id),
      points: round2(byPoints[0].points ?? 0),
    },
    lowestScore: byPoints.at(-1) && {
      owner: ownerOf(byPoints.at(-1)!.roster_id),
      points: round2(byPoints.at(-1)!.points ?? 0),
    },
    medianScore: round2(median),
    closestGame: byMargin[0] && {
      winner: byMargin[0].winner.owner,
      loser: byMargin[0].loser.owner,
      margin: byMargin[0].margin,
    },
    biggestBlowout: byMargin.at(-1) && {
      winner: byMargin.at(-1)!.winner.owner,
      loser: byMargin.at(-1)!.loser.owner,
      margin: byMargin.at(-1)!.margin,
    },
    bestPlayerPerformance: bestStarter && {
      player: describe(bestStarter.id),
      owner: ownerOf(bestStarter.rid),
      points: round2(bestStarter.points),
    },
    bestPerformanceLeftOnABench:
      bestBenched && bestBenched.points > 0
        ? {
            player: describe(bestBenched.id),
            owner: ownerOf(bestBenched.rid),
            points: round2(bestBenched.points),
          }
        : undefined,
  };

  // --- Transactions made this week, with how they turned out --------------
  const pointsOn = (pid: string, rid: number) => {
    const m = byRoster.get(rid);
    if (!m) return undefined;
    return {
      points: round2(m.players_points?.[pid] ?? 0),
      started: (m.starters ?? []).includes(pid),
    };
  };
  const whereNow = (pid: string) =>
    thisWeek.find((m) => (m.players ?? []).includes(pid));

  const transactions = rawTransactions
    .filter((t) => t.status === "complete" && t.type !== "commissioner")
    .slice(0, MAX_TRANSACTIONS)
    .map((t) => {
      if (t.type === "trade") {
        return {
          type: "trade",
          between: t.roster_ids.map(ownerOf),
          playersMoved: Object.entries(t.adds ?? {}).map(([pid, to]) => ({
            player: describe(pid),
            from: ownerOf(t.drops?.[pid]),
            to: ownerOf(to),
            thisWeekForNewTeam: pointsOn(pid, to),
          })),
          draftPicks: (t.draft_picks ?? []).length
            ? t.draft_picks!.map(
                (p) =>
                  `${p.season} round ${p.round} pick: ${ownerOf(
                    p.previous_owner_id,
                  )} to ${ownerOf(p.owner_id)}`,
              )
            : undefined,
        };
      }

      const rid = t.roster_ids[0];
      return {
        type: t.type === "waiver" ? "waiver claim" : "free agent pickup",
        by: ownerOf(rid),
        faabBid: t.settings?.waiver_bid,
        added: Object.keys(t.adds ?? {}).map((pid) => ({
          player: describe(pid),
          thisWeek: pointsOn(pid, rid),
        })),
        dropped: Object.keys(t.drops ?? {}).map((pid) => {
          const now = whereNow(pid);
          return now && now.roster_id !== rid
            ? {
                player: describe(pid),
                nowOn: ownerOf(now.roster_id),
                pointsForThemThisWeek: round2(now.players_points?.[pid] ?? 0),
              }
            : { player: describe(pid) };
        }),
      };
    });

  return { matchups, leagueWeek, transactions, standings, conferences };
}

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

const RECAP_INSTRUCTIONS = `You write the weekly recap for Boot Scoot n' Juke, a fantasy football league of long-time friends.

Voice: a league insider who has watched these people lose for years. Dry, specific, genuinely funny. Roast the decisions, not the people. You are writing for a group chat, not ESPN. Everyone here has signed up to be made fun of; that is the point of the league.

What makes a recap good:
- Specifics. Every joke hangs on a fact from this week's data: a starter who scored 3, a player left on the bench, a waiver pickup that blew up, a losing streak. A sentence that could be written about any team in any week is filler. Cut it.
- Memory. Use the running storylines and season facts to connect this week to the season. Pay off a storyline when this week gives it something new; do not just restate it.
- Variety. Open every paragraph differently. Do not reuse any opening or joke listed under "Already used".
- Truth. Use only facts in the data. Never invent players, stats or history. Copy numbers exactly as given; never round or retype them from memory.
- Names. Refer to a team by its full team name or its owner's name. Never shorten or nickname a team name; many contain real NFL team names, and "the Bills" reads as Buffalo.

Avoid sportswriter filler like "came out swinging", "left it all on the field", "statement win" or "nail-biter".

Format:
- One paragraph per matchup, in whatever order tells the week best. Most get 2-3 sentences; the best story of the week can get up to 5. Mention the winner and the score somewhere in each paragraph, but you do not have to lead with them.
- Use records, streaks and margins when they add something; do not list them mechanically. A blowout is worth saying so. A loser flagged as outscoring the league median got robbed and gets sympathy, not abuse.
- After the matchups, a line starting "Biggest Winner: " naming the week's highest scorer, with one sentence of credit that still needles them. Do not repeat numbers already used above; this line is for the joke, not the stats.
- Then a final line starting "Biggest Loser: " naming the week's lowest scorer, with one sentence of abuse. Same rule: no repeated numbers.
- Plain text only. No markdown, headers or bullet points. Separate paragraphs with a blank line.

Conferences stay out of the recap:
- The recap is about matchups only. Never mention the conferences, the conference race or the Supper Bowl anywhere in the recap field.

Conference summary:
The league is split into two conferences, the ${CONFERENCE_NAMES.join(" and the ")}. Their race is called the Supper Bowl. Rules:
- The conference with MORE combined wins at the end of the season eats free. The conference with FEWER combined wins buys the food at next year's draft. The trailing conference is the one buying. Never say the leading conference is buying.
- Each week both conferences play the same number of games among themselves, and each of those games hands that conference a guaranteed win, so they cancel out. Only cross-conference games change the gap. Talk only about cross-conference games and owners' cross-conference records when explaining why the gap moved.

Write the conferenceSummary field:
- Exactly 2 or 3 sentences, one paragraph, plain text.
- Sentence 1: who leads, and who is buying the food. Take this from the "facts" list word for word in meaning; do not work it out yourself.
- Sentence 2: how the gap moved this week, taken from the "facts" list, and the cross-conference result or owner that caused it.
- Optional sentence 3: one joke about an owner whose cross-conference record is hurting or carrying their conference.
- The summary sits under a win tracker that already shows the totals, so use at most two numbers.
- Same voice and truth rules as the recap. Do not reuse any joke from the recap.

Storylines:
Also return the running storylines for next week's writer, at most ${MAX_STORYLINES}. Each is one short sentence of fact about something ongoing: a streak, a rivalry, a repeated mistake, a team that keeps getting robbed, a pickup that keeps paying off. Keep storylines that are still alive, update ones this week changed, drop ones that are resolved or stale, and add new ones this week started. Write them as facts, not jokes, so next week's writer can find a fresh angle. Storylines are about results only: never mention family relationships in them.`;

const SEED_INSTRUCTIONS = `You keep the running storylines for Boot Scoot n' Juke, a fantasy football league of long-time friends, so that whoever writes each weekly recap remembers what has happened this season.

From the standings and recaps provided, write at most ${MAX_STORYLINES} storylines worth carrying into next week. Each is one short sentence of fact about something ongoing: a streak, a rivalry, a repeated mistake, a team that keeps getting robbed, a pickup that keeps paying off. Write them as facts, not jokes. Use only facts in the data, and trust the standings over the recaps if they disagree. Storylines are about results only: never mention family relationships in them.`;

const WHO = `Who these people are to each other:
- The D'Agostinos: Rudy (father) and Matthew (son).
- The McCuskers: Gord (father), Troy (son), and Kyle Sharpe (Gord's son-in-law, Troy's brother-in-law).
- The Rovers: Al (father) and Shayne (son).
- No one else in the league is related. Garret Beauvais, Greg Telford and Mark Spalding have no family in the league.
- Shayne, Matthew, Troy, Garret, Greg and Mark are friends from high school.
- Shayne, Matthew, Troy, Garret, Greg, Mark and Kyle are in their mid 30s. Rudy, Al and Gord are in their mid 60s.

Use a relationship only when it makes a joke land better. Do not force it in, do not recite the list, and do not mention the same relationship two weeks running.`;

const SAFETY = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_NONE }));

const RECAP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    recap: {
      type: Type.STRING,
      description:
        "The full recap in plain text, paragraphs separated by blank lines.",
    },
    conferenceSummary: {
      type: Type.STRING,
      description: `2-3 plain-text sentences on the ${CONFERENCE_NAMES.join(" vs ")} race, based on the conference facts. The trailing conference is the one buying the food. Never mention conferences in the recap field.`,
    },
    storylines: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: `Running storylines for next week, at most ${MAX_STORYLINES}.`,
    },
  },
  required: ["recap", "conferenceSummary", "storylines"],
  propertyOrdering: ["recap", "conferenceSummary", "storylines"],
};

const SEED_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    storylines: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: `Running storylines, at most ${MAX_STORYLINES}.`,
    },
  },
  required: ["storylines"],
};

// The first few words of each line of last week's recap, so the model can
// see exactly which openings to avoid.
function openingsOf(body: string) {
  return body
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      /^Biggest (Winner|Loser):/.test(line)
        ? line
        : `${line.split(/\s+/).slice(0, 8).join(" ")} ...`,
    );
}

function buildRecapPrompt(
  year: number,
  week: number,
  data: Awaited<ReturnType<typeof buildWeekData>>,
  previous: PreviousRecap | null,
) {
  const lens = LENSES[(week - 1) % LENSES.length];
  const sections = [
    `Week ${week} of the ${year} season is final. Write the recap and update the storylines.`,
    `This week's angle, only where the facts support it: ${lens}.`,
    `This week's matchups and notable facts:\n${JSON.stringify(data.matchups)}`,
    `League-wide this week:\n${JSON.stringify(data.leagueWeek)}`,
    `Transactions this week:\n${
      data.transactions.length ? JSON.stringify(data.transactions) : "none"
    }`,
    `Standings after week ${week}:\n${JSON.stringify(data.standings)}`,
    `Conference race after week ${week}:\n${JSON.stringify(data.conferences)}`,
  ];

  if (previous?.storylines?.length) {
    sections.push(
      `Running storylines going into this week:\n${previous.storylines
        .map((s) => `- ${s}`)
        .join("\n")}`,
    );
  } else {
    sections.push(
      "Running storylines: none yet. Start the list from this week.",
    );
  }

  if (previous) {
    sections.push(
      `Last week's recap (week ${previous.week}), for callbacks only. Do not copy its jokes or structure:\n${previous.body}`,
      `Already used. Do not reuse these openings or jokes:\n${openingsOf(
        previous.body,
      )
        .map((o) => `- ${o}`)
        .join("\n")}`,
    );
  }

  if (previous?.conference_summary) {
    sections.push(
      `Last week's conference summary. Do not reuse its opening, structure or joke:\n${previous.conference_summary}`,
    );
  }

  return sections.join("\n\n");
}

// ---------------------------------------------------------------------------
// Seeding: build the first set of storylines from recaps already written
// ---------------------------------------------------------------------------

async function seedStorylines(
  year: number,
  week: number,
  league: SleeperLeague,
  dryRun: boolean,
) {
  const [data, recapsRes, leagueHistory] = await Promise.all([
    buildWeekData(league, week),
    supabase
      .from("recaps")
      .select("week, body")
      .eq("year", year)
      .lte("week", week)
      .order("week", { ascending: true }),
    getLeagueContext(),
  ]);
  if (recapsRes.error) throw recapsRes.error;

  const recaps = (recapsRes.data ?? []) as { week: number; body: string }[];
  if (!recaps.some((r) => r.week === week)) {
    throw new Error(`No saved recap for week ${week} to attach storylines to`);
  }

  const { response, model } = await generateWithRetries({
    contents: [
      `Here is the ${year} season through week ${week}. Write the running storylines.`,
      `Standings after week ${week}:\n${JSON.stringify(data.standings)}`,
      `Every recap so far:\n${recaps
        .map((r) => `Week ${r.week}:\n${r.body}`)
        .join("\n\n")}`,
    ].join("\n\n"),
    config: {
      systemInstruction: [
        SEED_INSTRUCTIONS,
        WHO,
        `League history (past seasons and owner bios):\n${leagueHistory}`,
      ].join("\n\n"),
      safetySettings: SAFETY,
      responseMimeType: "application/json",
      responseSchema: SEED_SCHEMA,
    },
  });

  const { storylines: raw } = parseJson<{ storylines: string[] }>(
    response.text,
  );
  const storylines = (raw ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_STORYLINES);

  if (!dryRun) {
    const { error } = await supabase
      .from("recaps")
      .update({ storylines })
      .eq("year", year)
      .eq("week", week);
    if (error) throw error;
  }

  console.log(
    `${dryRun ? "Dry-run seeded" : "Seeded"} ${storylines.length} storylines for ${year} week ${week} using ${model}`,
  );
  return Response.json({ seeded: !dryRun, year, week, storylines, model });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req) => {
  // Only allow callers using the key stored in the CRON_KEY secret (i.e. the cron job).
  const expectedKey = Deno.env.get("CRON_KEY");
  const callerKey =
    req.headers.get("apikey") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedKey || !callerKey || callerKey !== expectedKey) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const url = new URL(req.url);
    const dryRun = url.searchParams.get("dry") === "1";
    const seed = url.searchParams.get("seed") === "1";
    const force = url.searchParams.get("force") === "1" || dryRun;
    const weekParam = url.searchParams.get("week");

    const state = await sleeper<SleeperState>("/state/nfl");
    const year = Number(url.searchParams.get("year") ?? state.season);

    const league = await sleeper<SleeperLeague>(`/league/${LEAGUE_ID}`);
    if (Number(league.season) !== year) {
      throw new Error(
        `LEAGUE_ID points at the ${league.season} league but the target year ` +
          `is ${year}. Update the LEAGUE_ID secret to this season's league.`,
      );
    }

    if (!weekParam && state.season_type !== "regular") {
      return Response.json({ skipped: `season_type is ${state.season_type}` });
    }

    let week = Number(weekParam ?? state.week);
    let played = await weekHasScores(week);
    if (!weekParam && week > 1 && !played) {
      week -= 1;
      played = await weekHasScores(week);
    }
    if (!played) {
      return Response.json({
        skipped: `no completed matchups for week ${week}`,
      });
    }

    if (seed) return await seedStorylines(year, week, league, dryRun);

    if (!force) {
      const { data: existing, error } = await supabase
        .from("recaps")
        .select("id")
        .eq("year", year)
        .eq("week", week)
        .maybeSingle();
      if (error) throw error;
      if (existing) {
        return Response.json({ skipped: `week ${week} already recapped` });
      }
    }

    const [data, previous, leagueHistory] = await Promise.all([
      buildWeekData(league, week),
      getPreviousRecap(year, week),
      getLeagueContext(),
    ]);

    const { response, model: usedModel } = await generateWithRetries({
      contents: buildRecapPrompt(year, week, data, previous),
      config: {
        systemInstruction: [
          RECAP_INSTRUCTIONS,
          WHO,
          `League history (past seasons and owner bios):\n${leagueHistory}`,
        ].join("\n\n"),
        safetySettings: SAFETY,
        responseMimeType: "application/json",
        responseSchema: RECAP_SCHEMA,
      },
    });

    const blockReason = response.promptFeedback?.blockReason;
    if (blockReason) throw new Error(`Prompt blocked: ${blockReason}`);

    const output = parseJson<{
      recap?: string;
      conferenceSummary?: string;
      storylines?: string[];
    }>(response.text);
    const body = output.recap?.trim();
    // Optional: a missing summary hides the block instead of failing the recap.
    const conference_summary = output.conferenceSummary?.trim() || null;
    if (!body) {
      const finish = response.candidates?.[0]?.finishReason;
      throw new Error(`Model returned no recap (finishReason: ${finish})`);
    }
    const storylines = (output.storylines ?? [])
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_STORYLINES);

    if (dryRun) {
      console.log(`Dry run for ${year} week ${week} using ${usedModel}`);
      return Response.json({
        dryRun: true,
        year,
        week,
        body,
        conference_summary,
        storylines,
        model: usedModel,
      });
    }

    const { error } = await supabase
      .from("recaps")
      .upsert(
        { year, week, body, conference_summary, storylines, model: usedModel },
        { onConflict: "year,week" },
      );
    if (error) throw error;

    console.log(`Wrote recap for ${year} week ${week} using ${usedModel}`);
    return Response.json({
      year,
      week,
      body,
      conference_summary,
      storylines,
      model: usedModel,
    });
  } catch (err) {
    console.error("weekly-recap failed:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
