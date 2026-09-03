import type { Sleeper } from "../types";
import { getOwners } from "./database";
import { tallyRecords } from "../lib/records";

type User = Sleeper["User"];
type Roster = Sleeper["Roster"];
type Matchup = Sleeper["Matchup"];

export type MappedMatchup = Matchup & {
  avatar: string | null;
  team_name: string | null;
};

const leagueId = import.meta.env.VITE_LEAGUE_ID;

export async function getLeagueUsers(): Promise<User[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/users`,
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getLeagueRosters(): Promise<Roster[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/rosters`,
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getLeagueMatchups(week: number): Promise<Matchup[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`,
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export type Standing = {
  roster_id: number;
  team_name: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  points: number;
};

export async function getNflWeek(): Promise<number> {
  const response = await fetch("https://api.sleeper.app/v1/state/nfl");

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const state = await response.json();
  return Math.min(17, Math.max(1, state.display_week || state.week || 1));
}

export async function getStandings(): Promise<Standing[]> {
  const [users, rosters, owners] = await Promise.all([
    getLeagueUsers(),
    getLeagueRosters(),
    getOwners(),
  ]);

  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const ownerMap = new Map(owners.map((o) => [o.sleeperId, o]));

  return rosters
    .map((roster) => {
      const user = userMap.get(roster.owner_id);
      const owner = user ? ownerMap.get(String(user.user_id)) : null;
      const s = roster.settings;

      return {
        roster_id: roster.roster_id,
        team_name: user?.metadata?.team_name || user?.display_name || "Team",
        avatar: owner?.logoUrl || null,
        wins: s?.wins ?? 0,
        losses: s?.losses ?? 0,
        ties: s?.ties ?? 0,
        points: Number(`${s?.fpts ?? 0}.${s?.fpts_decimal ?? 0}`),
      };
    })
    .sort((a, b) => b.wins - a.wins || b.points - a.points);
}

export async function getMappedMatchups(
  week: number,
): Promise<MappedMatchup[]> {
  const [users, rosters, matchups, owners] = await Promise.all([
    getLeagueUsers(),
    getLeagueRosters(),
    getLeagueMatchups(week),
    getOwners(),
  ]);

  const userMap = new Map(users.map((u) => [u.user_id, u]));
  const ownerMap = new Map(owners.map((o) => [o.sleeperId, o]));

  const rosterToUserMap = new Map();
  rosters.forEach((roster) => {
    const user = userMap.get(roster.owner_id);
    if (user) {
      rosterToUserMap.set(roster.roster_id, user);
    }
  });

  return matchups.map((matchup) => {
    const user = rosterToUserMap.get(matchup.roster_id);
    const owner = user ? ownerMap.get(user.user_id) : null;

    return {
      ...matchup,
      avatar: owner?.logoUrl || null,
      team_name: user?.metadata?.team_name || user?.display_name || "Team",
    };
  });
}

export type DraftPick = {
  key: string;
  year: number;
  pickNo: number;
  round: number;
  pick: string;
  player: string;
  team: string | null;
  owner: string | null;
  headshotUrl: string | null;
};

type RawDraft = {
  draft_id: string;
  season: string;
  settings?: { teams?: number };
};

type RawPick = {
  pick_no: number;
  round: number;
  draft_slot: number;
  roster_id: number;
  picked_by: string;
  player_id: string | null;
  metadata?: {
    first_name?: string;
    last_name?: string;
    position?: string;
  };
};

async function fetchJson(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

async function leagueSeasons(): Promise<string[]> {
  const ids: string[] = [];
  let id: string | null = leagueId;

  while (id) {
    ids.push(id);
    const league = await fetchJson(`https://api.sleeper.app/v1/league/${id}`);
    id = league.previous_league_id ?? null;
  }

  return ids;
}

async function draftPicksForLeague(id: string): Promise<DraftPick[]> {
  const [users, rosters, drafts, owners] = await Promise.all([
    fetchJson(`https://api.sleeper.app/v1/league/${id}/users`),
    fetchJson(`https://api.sleeper.app/v1/league/${id}/rosters`),
    fetchJson(`https://api.sleeper.app/v1/league/${id}/drafts`),
    getOwners(),
  ]);

  const userMap = new Map(users.map((u: User) => [String(u.user_id), u]));
  const ownerMap = new Map(owners.map((o) => [o.sleeperId, o]));
  const rosterOwner = new Map(
    rosters.map((r: Roster) => [r.roster_id, String(r.owner_id)]),
  );

  const picked = await Promise.all(
    drafts.map((draft: RawDraft) =>
      fetchJson(
        `https://api.sleeper.app/v1/draft/${draft.draft_id}/picks`,
      ).then((picks) => ({ draft, picks })),
    ),
  );

  return picked.flatMap(({ draft, picks }) => {
    const teams = draft.settings?.teams || rosters.length || 10;

    return picks.map((pick: RawPick) => {
      const inRound = ((pick.pick_no - 1) % teams) + 1;
      const userId = pick.picked_by || rosterOwner.get(pick.roster_id) || "";
      const user = userMap.get(String(userId)) as User | undefined;
      const owner = ownerMap.get(String(userId));
      const meta = pick.metadata ?? {};

      return {
        key: `${draft.draft_id}-${pick.pick_no}`,
        year: Number(draft.season),
        pickNo: pick.pick_no,
        round: pick.round,
        pick: `${pick.round}.${String(inRound).padStart(2, "0")}`,
        player: `${meta.first_name ?? ""} ${meta.last_name ?? ""}`.trim()
          ? `${meta.first_name} ${meta.last_name}${
              meta.position ? ` (${meta.position})` : ""
            }`
          : "Unknown player",
        team: user?.metadata?.team_name || user?.display_name || null,
        owner: owner?.name ?? user?.display_name ?? null,
        headshotUrl: pick.player_id
          ? `https://sleepercdn.com/content/nfl/players/thumb/${pick.player_id}.jpg`
          : null,
      };
    });
  });
}

export async function getSleeperDrafts(): Promise<DraftPick[]> {
  const leagues = await leagueSeasons();
  const perLeague = await Promise.all(leagues.map(draftPicksForLeague));
  return perLeague.flat();
}

const weekCache = new Map<number, Matchup[]>();

async function cachedMatchups(week: number): Promise<Matchup[]> {
  const cached = weekCache.get(week);
  if (cached) return cached;

  const data = await getLeagueMatchups(week);
  weekCache.set(week, data);
  return data;
}

export async function getRecordsThroughWeek(
  week: number,
): Promise<Map<number, string>> {
  const weeks = await Promise.all(
    Array.from({ length: week }, (_, i) => cachedMatchups(i + 1)),
  );
  return tallyRecords(weeks);
}
