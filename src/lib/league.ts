export const SEASON = 2026;
export const SEASON_LABEL = `${SEASON}–${String(SEASON + 1).slice(2)}`;
export const SEASON_NUMBER = 14;
export const FOUNDED = 2013;

// Fewer combined wins buys the food at next year's draft. Keyed by Sleeper
// roster_id. Teams are drawn at random, so update this list with SEASON.
export const CONFERENCES = [
  // Mr. Unlimited, Club D'Agostino, Patriots of Pigskin, Original Draughters, Downtown Browns
  { name: "Scooters", rosterIds: [2, 4, 5, 6, 10] },
  // Rover's Rams, Brady Gaga, Saved by the Bell, Bills Mafia, Put me in Joe
  { name: "Jukers", rosterIds: [1, 3, 7, 8, 9] },
];

// 14 weeks of 5 games puts 70 wins up for grabs, so 36 is a guaranteed majority.
export const FREE_DINNER_WINS = 36;

export const SEASON_START = new Date(2026, 8, 9); // Sep 9, 2026
export const SEASON_END = new Date(2027, 0, 4); // Jan 4, 2027

export type SeasonPhase = "preseason" | "regular" | "postseason";

function dayNumber(date: Date): number {
  return (
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000
  );
}

export function seasonPhase(now: Date = new Date()): SeasonPhase {
  const today = dayNumber(now);

  if (today < dayNumber(SEASON_START)) return "preseason";
  if (today > dayNumber(SEASON_END)) return "postseason";
  return "regular";
}

export function daysUntilKickoff(now: Date = new Date()): number {
  return dayNumber(SEASON_START) - dayNumber(now);
}

export function seasonHeadline(
  phase: SeasonPhase,
  week: number | null,
): string {
  if (phase === "preseason") return "Preseason in progress";
  if (phase === "postseason") return "Postseason in progress";
  return week ? `Week ${week} · ${SEASON} Season` : `${SEASON} Season`;
}

export function weekInProgress(now: Date = new Date()): boolean {
  if (seasonPhase(now) !== "regular") return false;
  const day = now.getDay();
  return day !== 2 && day !== 3;
}

export type WeekStatus = "upcoming" | "live" | "final";
