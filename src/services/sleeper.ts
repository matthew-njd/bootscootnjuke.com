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
