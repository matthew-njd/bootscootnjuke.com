import type { Sleeper } from "../types";
import { getOwners } from "./database";

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
