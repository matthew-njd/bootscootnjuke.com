import type { Sleeper } from "../types";

type User = Sleeper["User"];
type Matchup = Sleeper["Matchup"];

const leagueId = import.meta.env.VITE_LEAGUE_ID;

export async function getLeagueUsers(): Promise<User[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/users`
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}

export async function getLeagueMatchups(week: number): Promise<Matchup[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}
