import { GoogleGenAI, Type } from "npm:@google/genai@1.35.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const ESPN = "https://site.api.espn.com/apis/site/v2/sports/football/nfl";
// Tried in order until one succeeds. Same list as weekly-recap.
const MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);
const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY")! });

type Leg = { id: number; year: number; week: number; bet: string };
type Competitor = {
  score: string;
  team: { displayName: string; abbreviation: string };
};
type Event = {
  id: string;
  shortName: string;
  status: { type: { completed: boolean } };
  competitions: { competitors: Competitor[] }[];
};
type StatGroup = {
  name: string;
  labels: string[];
  athletes: { athlete: { id: string; displayName: string }; stats: string[] }[];
};
type Summary = {
  boxscore: {
    players?: { team: { abbreviation: string }; statistics: StatGroup[] }[];
  };
};
type Graded = {
  id: number;
  game: string;
  kind: "spread" | "over_under" | "at_least" | "unsure";
  subject: string;
  stat: string;
  line: number;
  reason: string;
};
// The model names what to look up; the numbers come from here.
type Game = {
  text: string;
  margins: Map<string, number>; // team abbreviation -> margin
  total: number;
  players: Map<string, Record<string, number>>; // lowercased name -> stats
};

const espn = async <T>(path: string): Promise<T> => {
  // ESPN returns 403 to Deno's default User-Agent ("Deno/x.y").
  const res = await fetch(`${ESPN}${path}`, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; bootscootnjuke-grader/1.0)" },
  });
  if (!res.ok) throw new Error(`ESPN ${path} returned ${res.status}`);
  return (await res.json()) as T;
};

// Box score columns worth passing along, with plain names for the model.
// C/ATT ("21/34") is split into completions and pass att below.
const STATS: Record<string, [label: string, name: string][]> = {
  passing: [
    ["YDS", "pass yds"],
    ["TD", "pass TD"],
    ["INT", "INT thrown"],
  ],
  rushing: [
    ["CAR", "rush att"],
    ["YDS", "rush yds"],
    ["TD", "rush TD"],
  ],
  receiving: [
    ["REC", "receptions"],
    ["YDS", "rec yds"],
    ["TD", "rec TD"],
  ],
};

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

const STAT_NAMES = [
  "completions",
  "pass att",
  ...new Set(Object.values(STATS).flat().map(([, name]) => name)),
  "anytime TD",
  "rush+rec yds",
];

const STAT_WORDS = new Set(
  "over under rush rushing rec receiving receptions yds yards yd pass passing catch anytime tds td".split(" "),
);

// Guards against the model picking the wrong player ("D. Brown" -> Darius
// Slayton). A bet word must hold the first 3 letters of a name part
// ("TLaw", "JTaylor", "Marv") or be its initials ("JSN").
function nameMatches(bet: string, name: string) {
  const parts = name.toLowerCase().split(/[\s\-.']+/).filter(Boolean);
  const initials = parts.map((p) => p[0]).join("");
  return bet
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => !STAT_WORDS.has(w))
    .some(
      (w) =>
        (w.length >= 2 && initials.startsWith(w)) ||
        parts.some((p) => p.length >= 3 && w.includes(p.slice(0, 3))),
    );
}

// Flash-Lite shouldn't do math, so totals, margins and anytime TDs are precomputed.
function parseGame(event: Event, summary: Summary): Game {
  const [a, b] = event.competitions[0].competitors;
  const [sa, sb] = [Number(a.score), Number(b.score)];
  const margins = new Map([
    [a.team.abbreviation, sa - sb],
    [b.team.abbreviation, sb - sa],
  ]);
  const lines = [
    `${event.shortName}: ${a.team.displayName} (${a.team.abbreviation}) ${sa}, ` +
      `${b.team.displayName} (${b.team.abbreviation}) ${sb}.`,
  ];

  const players = new Map<
    string,
    { name: string; team: string; stats: Record<string, number> }
  >();
  for (const side of summary.boxscore.players ?? []) {
    for (const group of side.statistics) {
      const wanted = STATS[group.name];
      if (!wanted) continue;
      for (const { athlete, stats } of group.athletes) {
        const p = players.get(athlete.id) ?? {
          name: athlete.displayName,
          team: side.team.abbreviation,
          stats: { "anytime TD": 0 },
        };
        const col = (label: string) => stats[group.labels.indexOf(label)];
        for (const [label, name] of wanted) p.stats[name] = Number(col(label)) || 0;
        if (group.name === "passing") {
          const [done, tried] = (col("C/ATT") ?? "0/0").split("/").map(Number);
          p.stats["completions"] = done || 0;
          p.stats["pass att"] = tried || 0;
        } else {
          p.stats["anytime TD"] += Number(col("TD")) || 0;
        }
        players.set(athlete.id, p);
      }
    }
  }
  for (const p of players.values()) {
    if ("rush yds" in p.stats || "rec yds" in p.stats) {
      p.stats["rush+rec yds"] = (p.stats["rush yds"] ?? 0) + (p.stats["rec yds"] ?? 0);
    }
    const parts = Object.entries(p.stats).map(([k, v]) => `${v} ${k}`);
    lines.push(`- ${p.name} (${p.team}): ${parts.join(", ")}`);
  }
  return {
    text: lines.join("\n"),
    margins,
    total: sa + sb,
    players: new Map(
      [...players.values()].map((p) => [p.name.toLowerCase(), p.stats]),
    ),
  };
}

// The number the bet is graded on, read from the box score, plus the reason
// shown on the card. null when the subject or stat isn't there.
function lookUp(g: Graded, game: Game, bet: string): [number, string] | null {
  if (g.kind === "spread") {
    const margin = game.margins.get(g.subject.toUpperCase());
    return margin === undefined ? null : [margin, `${g.subject.toUpperCase()} margin ${signed(margin)}`];
  }
  if (g.subject.toLowerCase() === "total") {
    return [game.total, `${g.game} total points ${game.total}`];
  }
  const stats = game.players.get(g.subject.toLowerCase());
  if (!stats || !STAT_NAMES.includes(g.stat) || !nameMatches(bet, g.subject)) {
    return null;
  }
  // A listed player with no line in a category had none of that stat.
  const value = stats[g.stat] ?? 0;
  return [value, `${g.subject}: ${value} ${g.stat}`];
}

const RULES = `You match NFL parlay bets to final box scores. You only name what to look up. Never copy stat values, do math, or decide whether a bet won.

For each leg:
1. Find the game. Teams can appear as a city, nickname, or abbreviation ("Dallas", "Cowboys", "DAL"). Players can appear by last name, first name, or initials ("Lamar" is Lamar Jackson, "JSN" is Jaxon Smith-Njigba). Copy the game's name exactly as written before the colon in GAMES, or exactly as written in NOT FINISHED.
2. Pick the kind, subject, stat, and line:
- Team spread ("Bills -2.5", "Raiders +1.5"): kind "spread". subject = that team's abbreviation from GAMES. stat = "margin". line = the spread as written, with its sign.
- Team win ("Bills W", "Bills Win", "Bengals ML"): kind "spread". subject = that team's abbreviation. stat = "margin". line = 0.
- Game total ("Bills/Ravens O53.5", "HOU/IND U44.5"): kind "over_under". subject = "total". stat = "total points". line = the number.
- Player over or under ("Lamar O21.5 rush yds", "Gesicki O3.5 Receptions"): kind "over_under". subject = the player's full name exactly as written in GAMES. stat = the stat name. line = the number.
- Player N+ ("Bowers 70+ rec yards", "Allen 2+ pass TDs"): kind "at_least". subject = the player's full name exactly as written in GAMES. stat = the stat name. line = N.
- Anytime TD ("Pitts TD", "Gibbs anytime TD"): kind "at_least". subject = the player's full name exactly as written in GAMES. stat = "anytime TD". line = 1.
- "TD" or "N+ TD" without the word "pass" always means "anytime TD", even for a QB. Use "pass TD" only when the bet says "pass".
- "yds" with no type means rec yds for a WR or TE, rush yds for a RB, and pass yds for a QB.
- "rush+rec" or "scrimmage yds" means stat "rush+rec yds".
3. Use kind "unsure", with line 0, when:
- The bet needs a number and has none ("Dolphins/Jets O").
- You can't tell which game or player it means.
- The player isn't listed in that game in GAMES.
4. reason: under 60 characters. Say why you're unsure, or leave it empty.`;

const SCHEMA = {
  type: Type.OBJECT,
  properties: {
    legs: {
      type: Type.ARRAY,
      description: "One entry per leg in LEGS, same ids.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          game: {
            type: Type.STRING,
            description:
              "Copied exactly from GAMES or NOT FINISHED, like 'BAL @ BUF'.",
          },
          kind: {
            type: Type.STRING,
            enum: ["spread", "over_under", "at_least", "unsure"],
          },
          subject: {
            type: Type.STRING,
            description:
              "A team abbreviation for spreads, 'total' for game totals, or the player's full name exactly as written in GAMES.",
          },
          stat: {
            type: Type.STRING,
            enum: ["margin", "total points", ...STAT_NAMES],
            description: "'anytime TD' for any TD bet that doesn't say 'pass'.",
          },
          line: {
            type: Type.NUMBER,
            description:
              "Copied from the bet. Spreads keep their sign; a win bet is 0.",
          },
          reason: { type: Type.STRING },
        },
        required: ["id", "game", "kind", "subject", "stat", "line", "reason"],
      },
    },
  },
  required: ["legs"],
};

// Flash-Lite misreads O and U, so the direction comes from the bet text.
// 1 = over, -1 = under, 0 = can't tell.
function overOrUnder(bet: string) {
  const over = /\b(o|over)\s*\d/i.test(bet);
  const under = /\b(u|under)\s*\d/i.test(bet);
  return over === under ? 0 : over ? 1 : -1;
}

// true = hit, false = miss, null = push or unsure.
function settle(
  { kind, line }: Graded,
  actual: number,
  bet: string,
): boolean | null {
  const edge =
    kind === "spread"
      ? actual + line
      : kind === "over_under"
        ? (actual - line) * overOrUnder(bet)
        : kind === "at_least"
          ? actual >= line
            ? 1
            : -1
          : 0;
  return edge > 0 ? true : edge < 0 ? false : null;
}

async function generate(contents: string) {
  let lastErr: unknown;
  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: RULES,
          responseMimeType: "application/json",
          responseSchema: SCHEMA,
          temperature: 0,
          abortSignal: AbortSignal.timeout(35_000),
        },
      });
      if (!response.text) throw new Error("Model returned no text");
      return {
        graded: (JSON.parse(response.text) as { legs: Graded[] }).legs,
        model,
      };
    } catch (err) {
      lastErr = err;
      console.warn(`${model} failed:`, err);
    }
  }
  throw lastErr;
}

async function gradeWeek(legs: Leg[], dryRun: boolean) {
  const { year, week } = legs[0];
  const { events } = await espn<{ events: Event[] }>(
    `/scoreboard?dates=${year}&seasontype=2&week=${week}`,
  );
  const finals = events.filter((e) => e.status.type.completed);
  if (!finals.length) return [];

  const summaries = await Promise.all(
    finals.map((e) => espn<Summary>(`/summary?event=${e.id}`)),
  );
  const games = new Map(
    finals.map((e, i) => [e.shortName, parseGame(e, summaries[i])]),
  );
  const unfinished = events.filter((e) => !e.status.type.completed);
  const prompt = [
    "GAMES (final):",
    ...[...games.values()].map((g) => g.text),
    "",
    "NOT FINISHED:",
    ...(unfinished.length ? unfinished.map((e) => e.shortName) : ["none"]),
    "",
    "LEGS:",
    ...legs.map((l) => `${l.id}: ${l.bet}`),
  ].join("\n");

  const { graded, model } = await generate(prompt);
  const bets = new Map(legs.map((l) => [l.id, l.bet]));

  const updates = graded
    // A leg on a game that isn't over waits for the next run.
    .filter((g) => bets.has(g.id) && games.has(g.game))
    .map((g) => {
      const bet = bets.get(g.id)!;
      const found = g.kind === "unsure" ? null : lookUp(g, games.get(g.game)!, bet);
      if (!found) {
        const why = g.reason || `couldn't find ${g.subject} ${g.stat}`;
        return { id: g.id, hit: null, hit_reason: `Check by hand: ${why}` };
      }
      const [actual, reason] = found;
      const hit = settle(g, actual, bet);
      return {
        id: g.id,
        hit,
        // A push, or an over/under bet with no O or U.
        hit_reason: hit === null ? `Check by hand: ${reason}` : reason,
      };
    });

  if (!dryRun) {
    for (const { id, hit, hit_reason } of updates) {
      // .is("hit", null) keeps a hand-entered result from being overwritten.
      const { error } = await supabase
        .from("parlay_legs")
        .update({ hit, hit_reason })
        .eq("id", id)
        .is("hit", null);
      if (error) throw error;
    }
  }
  console.log(
    `${year} week ${week}: graded ${updates.length}/${legs.length} with ${model}`,
  );
  return updates;
}

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
    const dryRun = new URL(req.url).searchParams.get("dry") === "1";
    const { data: legs, error } = await supabase
      .from("parlay_legs")
      .select("id, year, week, bet")
      .is("hit", null)
      .is("hit_reason", null);
    if (error) throw error;
    if (!legs.length) return Response.json({ skipped: "no ungraded legs" });

    const weeks = Object.values(
      Object.groupBy(legs as Leg[], (l) => `${l.year}-${l.week}`),
    );
    const results = [];
    for (const weekLegs of weeks) {
      results.push(...(await gradeWeek(weekLegs!, dryRun)));
    }
    return Response.json({ dryRun, results });
  } catch (err) {
    console.error("grade-parlay failed:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
