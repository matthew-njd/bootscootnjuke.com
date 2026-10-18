import type { Database } from "../types";
import { NO_LOSER_SEASONS } from "./league";

type Stats = Database["public"]["Tables"]["stats"]["Row"];

export interface FinishCount {
  ownerId: string;
  count: number;
  years: number[];
}

// Owners ranked by how many seasons they finished in `place`. "last" is the
// lowest place recorded each season, since league size and ties vary by year,
// and skips seasons that had no loser.
export function finishCounts(
  stats: Stats[],
  place: number | "last",
): FinishCount[] {
  const lastPlace = new Map<number, number>();
  for (const r of stats) {
    if (r.year == null || r.finalPlace == null) continue;
    if (NO_LOSER_SEASONS.includes(r.year)) continue;
    lastPlace.set(r.year, Math.max(lastPlace.get(r.year) ?? 0, r.finalPlace));
  }

  const counts = new Map<string, FinishCount>();
  for (const r of stats) {
    if (r.year == null || r.ownerId == null || r.finalPlace == null) continue;
    if (r.finalPlace !== (place === "last" ? lastPlace.get(r.year) : place)) {
      continue;
    }

    const row = counts.get(r.ownerId) ?? {
      ownerId: r.ownerId,
      count: 0,
      years: [],
    };
    row.count += 1;
    row.years.push(r.year);
    counts.set(r.ownerId, row);
  }

  // Ties go to whoever did it most recently.
  return [...counts.values()]
    .map((row) => ({ ...row, years: row.years.sort((a, b) => a - b) }))
    .sort((a, b) => b.count - a.count || b.years.at(-1)! - a.years.at(-1)!);
}
