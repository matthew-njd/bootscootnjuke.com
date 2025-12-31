import type { Sleeper } from "../types";

type User = Sleeper["User"];

const leagueId = import.meta.env.LEAGUE_ID;

export async function getLeagueUsers(): Promise<User[]> {
  const response = await fetch(
    `https://api.sleeper.app/v1/league/${leagueId}/users`
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json();
}
