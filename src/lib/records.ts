import type { Sleeper } from "../types";

type Matchup = Sleeper["Matchup"];
type Record = { wins: number; losses: number; ties: number };

export function tallyRecords(weeks: Matchup[][]): Map<number, string> {
  const table = new Map<number, Record>();

  const bump = (rosterId: number, field: keyof Record) => {
    const row = table.get(rosterId) ?? { wins: 0, losses: 0, ties: 0 };
    row[field] += 1;
    table.set(rosterId, row);
  };

  for (const matchups of weeks) {
    for (const [a, b] of groupByMatchup(matchups)) {
      const aPoints = a.points ?? 0;
      const bPoints = b.points ?? 0;

      if (aPoints === 0 && bPoints === 0) continue;

      if (aPoints > bPoints) {
        bump(a.roster_id, "wins");
        bump(b.roster_id, "losses");
      } else if (bPoints > aPoints) {
        bump(b.roster_id, "wins");
        bump(a.roster_id, "losses");
      } else {
        bump(a.roster_id, "ties");
        bump(b.roster_id, "ties");
      }
    }
  }

  return new Map(
    [...table].map(([rosterId, r]) => [
      rosterId,
      `${r.wins}-${r.losses}${r.ties ? `-${r.ties}` : ""}`,
    ]),
  );
}

export function groupByMatchup<T extends { matchup_id: number }>(
  teams: T[],
): [T, T][] {
  const byId = new Map<number, T[]>();
  for (const team of teams) {
    byId.set(team.matchup_id, [...(byId.get(team.matchup_id) ?? []), team]);
  }
  return [...byId.values()].filter((g): g is [T, T] => g.length === 2);
}
