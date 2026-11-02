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
  actual: number;
  line: number;
  reason: string;
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
const STATS: Record<string, [label: string, name: string][]> = {
  passing: [
    ["C/ATT", "completions/attempts"],
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

// Flash-Lite shouldn't do math, so totals, margins and anytime TDs are precomputed.
function describeGame(event: Event, summary: Summary) {
  const [a, b] = event.competitions[0].competitors;
  const [sa, sb] = [Number(a.score), Number(b.score)];
  const lines = [
    `${event.shortName}: ${a.team.displayName} (${a.team.abbreviation}) ${sa}, ` +
      `${b.team.displayName} (${b.team.abbreviation}) ${sb}. ` +
      `Total points ${sa + sb}. ${a.team.abbreviation} margin ${signed(sa - sb)}. ` +
      `${b.team.abbreviation} margin ${signed(sb - sa)}.`,
  ];

  const players = new Map<
    string,
    { name: string; team: string; parts: string[]; tds: number }
  >();
  for (const side of summary.boxscore.players ?? []) {
    for (const group of side.statistics) {
      const wanted = STATS[group.name];
      if (!wanted) continue;
      for (const { athlete, stats } of group.athletes) {
        const p = players.get(athlete.id) ?? {
          name: athlete.displayName,
          team: side.team.abbreviation,
          parts: [],
          tds: 0,
        };
        for (const [label, name] of wanted) {
          const value = stats[group.labels.indexOf(label)];
          if (value !== undefined) p.parts.push(`${value} ${name}`);
        }
        if (group.name !== "passing") {
          p.tds += Number(stats[group.labels.indexOf("TD")]) || 0;
        }
        players.set(athlete.id, p);
      }
    }
  }
  for (const p of players.values()) {
    lines.push(
      `- ${p.name} (${p.team}): ${p.parts.join(", ")}, ${p.tds} anytime TD`,
    );
  }
  return lines.join("\n");
}

const RULES = `You match NFL parlay bets to final box scores. You only copy numbers. Never add, subtract, or decide whether a bet won.

For each leg:
1. Find the game. Teams can appear as a city, nickname, or abbreviation ("Dallas", "Cowboys", "DAL"). Players can appear by last name, first name, or initials ("Lamar" is Lamar Jackson, "JSN" is Jaxon Smith-Njigba). Copy the game's name exactly as written before the colon in GAMES, or exactly as written in NOT FINISHED.
2. Pick the kind and copy the numbers:
- Team spread ("Bills -2.5", "Raiders +1.5"): kind "spread". actual = that team's margin. line = the spread as written, with its sign.
- Team win ("Bills W", "Bills Win", "Bengals ML"): kind "spread". actual = that team's margin. line = 0.
- Game total ("Bills/Ravens O53.5", "HOU/IND U44.5"): kind "over_under". actual = total points. line = the number.
- Player over or under ("Lamar O21.5 rush yds", "Gesicki O3.5 Receptions"): kind "over_under". actual = that player's stat. line = the number.
- Player N+ ("Bowers 70+ rec yards", "Allen 2+ pass TDs"): kind "at_least". actual = that player's stat. line = N.
- Anytime TD ("Pitts TD", "Gibbs anytime TD"): kind "at_least". actual = that player's anytime TD. line = 1.
- "TD" or "N+ TD" without the word "pass" always means anytime TD, even for a QB. "J. Allen 1+ TD": actual = Josh Allen's anytime TD, line = 1. Never use pass TD unless the bet says "pass".
- "yds" with no type means rec yds for a WR or TE, rush yds for a RB, and pass yds for a QB.
3. Use kind "unsure", with actual 0 and line 0, when:
- The bet needs a number and has none ("Dolphins/Jets O").
- You can't tell which game or player it means.
- The player has no line in the box score.
- The stat isn't listed.
4. reason: under 60 characters. Name the stat you used ("Bowers: 74 rec yds", "BUF margin +26"), or say why you're unsure.`;

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
          actual: {
            type: Type.NUMBER,
            description:
              "Copied from the box score: a team margin, total points, or a player stat.",
          },
          line: {
            type: Type.NUMBER,
            description:
              "Copied from the bet. Spreads keep their sign; a win bet is 0.",
          },
          reason: { type: Type.STRING },
        },
        required: ["id", "game", "kind", "actual", "line", "reason"],
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
function settle({ kind, actual, line }: Graded, bet: string): boolean | null {
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
  const unfinished = events.filter((e) => !e.status.type.completed);
  const prompt = [
    "GAMES (final):",
    ...finals.map((e, i) => describeGame(e, summaries[i])),
    "",
    "NOT FINISHED:",
    ...(unfinished.length ? unfinished.map((e) => e.shortName) : ["none"]),
    "",
    "LEGS:",
    ...legs.map((l) => `${l.id}: ${l.bet}`),
  ].join("\n");

  const { graded, model } = await generate(prompt);
  const bets = new Map(legs.map((l) => [l.id, l.bet]));
  const finalNames = new Set(finals.map((e) => e.shortName));

  const updates = graded
    // A leg on a game that isn't over waits for the next run.
    .filter((g) => bets.has(g.id) && finalNames.has(g.game))
    .map((g) => {
      const hit = settle(g, bets.get(g.id)!);
      return {
        id: g.id,
        hit,
        hit_reason: hit === null ? `Check by hand: ${g.reason}` : g.reason,
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
