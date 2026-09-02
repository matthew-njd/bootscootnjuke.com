import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
} from "npm:@google/genai@1.35.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const LEAGUE_ID = Deno.env.get("LEAGUE_ID")!;
const SLEEPER = "https://api.sleeper.app/v1";
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.6-flash";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const ai = new GoogleGenAI({ apiKey: Deno.env.get("GEMINI_API_KEY")! });

type SleeperUser = {
  user_id: string;
  display_name: string;
  metadata?: { team_name?: string };
};
type SleeperRoster = { owner_id: string; roster_id: number };
type SleeperMatchup = {
  matchup_id: number;
  roster_id: number;
  points: number | null;
};
type SleeperState = {
  season: string;
  week: number;
  season_type: "pre" | "regular" | "post";
};
type SleeperLeague = { season: string; name: string };
type OwnerName = { name: string | null; sleeperId: string };

const sleeper = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${SLEEPER}${path}`);
  if (!res.ok) throw new Error(`Sleeper ${path} returned ${res.status}`);
  return (await res.json()) as T;
};

async function getMatchups(week: number) {
  const [users, rosters, matchups, { data: owners }] = await Promise.all([
    sleeper<SleeperUser[]>(`/league/${LEAGUE_ID}/users`),
    sleeper<SleeperRoster[]>(`/league/${LEAGUE_ID}/rosters`),
    sleeper<SleeperMatchup[]>(`/league/${LEAGUE_ID}/matchups/${week}`),
    supabase.from("owners").select("name, sleeperId"),
  ]);

  const userById = new Map(users.map((u) => [u.user_id, u]));
  const ownerBySleeperId = new Map(
    ((owners ?? []) as OwnerName[]).map((o) => [o.sleeperId, o]),
  );
  const userByRoster = new Map(
    rosters.map((r) => [r.roster_id, userById.get(r.owner_id)]),
  );

  const named = matchups.map((m) => {
    const user = userByRoster.get(m.roster_id);
    return {
      matchup_id: m.matchup_id,
      points: m.points ?? 0,
      team: user?.metadata?.team_name ?? user?.display_name ?? "Unknown Team",
      owner:
        ownerBySleeperId.get(user?.user_id ?? "")?.name ??
        user?.display_name ??
        "Unknown",
    };
  });

  const byMatchup = new Map<number, typeof named>();
  for (const team of named) {
    const group = byMatchup.get(team.matchup_id) ?? [];
    group.push(team);
    byMatchup.set(team.matchup_id, group);
  }

  return [...byMatchup.values()].filter((teams) => teams.length === 2);
}

async function getLeagueContext() {
  const [{ data: owners }, { data: stats }] = await Promise.all([
    supabase.from("owners").select("name, bio, active"),
    supabase
      .from("stats")
      .select("team, year, wins, loses, ptsFor, finalPlace"),
  ]);
  return JSON.stringify({ owners, seasonHistory: stats });
}

const VOICE = `You write the weekly recap for Boot Scoot n' Juke, a fantasy football league of long-time friends.

Voice: a league insider who has watched these people lose for years. Dry, specific, genuinely funny. Roast the bad decisions, not the people. You are writing for a group chat, not ESPN. Everyone here has consented to being made fun of; that is the entire point of the league.

Never do these:
- Generic sportswriter filler ("came out swinging", "left it all on the field", "statement win")
- Praising everyone. Somebody played badly. Say so.
- Inventing stats, players, or history. You only know what is in the data given to you.

Format, exactly:
- One paragraph per matchup, 2-4 sentences. Lead with who won and the score.
- Then a final line starting "Biggest Loser: " naming the lowest scorer with one sentence of abuse.
- Plain text only. No markdown, no headers, no bullet points. Separate paragraphs with a blank line.`;

const SAFETY = [
  HarmCategory.HARM_CATEGORY_HARASSMENT,
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
].map((category) => ({ category, threshold: HarmBlockThreshold.BLOCK_NONE }));

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";

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
    let games = await getMatchups(week);

    if (!weekParam && week > 1 && games.every((g) => g[0].points === 0)) {
      week -= 1;
      games = await getMatchups(week);
    }

    const unplayed = games.every((g) => g[0].points === 0 && g[1].points === 0);
    if (!games.length || unplayed) {
      return Response.json({
        skipped: `no completed matchups for week ${week}`,
      });
    }

    if (!force) {
      const { data: existing } = await supabase
        .from("recaps")
        .select("id")
        .eq("year", year)
        .eq("week", week)
        .maybeSingle();
      if (existing) {
        return Response.json({ skipped: `week ${week} already recapped` });
      }
    }

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: `Week ${week} of the ${year} season is final. Write the recap.\n\n${JSON.stringify(games)}`,
      config: {
        systemInstruction: `${VOICE}\n\nLeague history:\n${await getLeagueContext()}`,
        safetySettings: SAFETY,
        temperature: 1.0,
      },
    });

    const blockReason = response.promptFeedback?.blockReason;
    if (blockReason) throw new Error(`Prompt blocked: ${blockReason}`);

    const body = response.text?.trim();
    if (!body) {
      const finish = response.candidates?.[0]?.finishReason;
      throw new Error(`Model returned no text (finishReason: ${finish})`);
    }

    const { error } = await supabase
      .from("recaps")
      .upsert({ year, week, body }, { onConflict: "year,week" });
    if (error) throw error;

    console.log(`Wrote recap for ${year} week ${week} using ${MODEL}`);
    return Response.json({ year, week, body });
  } catch (err) {
    console.error("weekly-recap failed:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
