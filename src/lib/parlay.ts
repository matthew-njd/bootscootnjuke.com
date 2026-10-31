import {
  getOwners,
  getParlayLegs,
  getParlays,
  type ParlayLeg,
} from "../services/database";

export interface ParlayWeek {
  year: number;
  week: number;
  legs: ParlayLeg[];
  payout: number | null;
}

// Every week's slip, newest first, with owners by first name as the chat uses them.
export async function loadParlay() {
  const [legs, parlays, owners] = await Promise.all([
    getParlayLegs(),
    getParlays(),
    getOwners(),
  ]);

  const payouts = new Map(
    parlays.map((p) => [`${p.year}-${p.week}`, p.payout]),
  );
  const weeks = new Map<string, ParlayWeek>();
  // Legs arrive newest week first; within a week, keep the order they were entered.
  for (const leg of [...legs].sort((a, b) => a.id - b.id)) {
    const key = `${leg.year}-${leg.week}`;
    const week = weeks.get(key) ?? {
      year: leg.year,
      week: leg.week,
      legs: [],
      payout: payouts.get(key) ?? null,
    };
    week.legs.push(leg);
    weeks.set(key, week);
  }

  const names = new Map(
    owners.map((o) => [o.ownerId, o.name?.split(" ")[0] ?? o.ownerId]),
  );

  return {
    weeks: [...weeks.values()].sort(
      (a, b) => b.year - a.year || b.week - a.week,
    ),
    names,
  };
}
