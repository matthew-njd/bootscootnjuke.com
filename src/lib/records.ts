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
    const byId = new Map<number, Matchup[]>();
    for (const m of matchups) {
      byId.set(m.matchup_id, [...(byId.get(m.matchup_id) ?? []), m]);
    }

    for (const pair of byId.values()) {
      if (pair.length !== 2) continue;
      const [a, b] = pair;

      if (!a.points && !b.points) continue;

      if (a.points > b.points) {
        bump(a.roster_id, "wins");
        bump(b.roster_id, "losses");
      } else if (b.points > a.points) {
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
