export const SEASON = 2026;
export const SEASON_LABEL = `${SEASON}–${String(SEASON + 1).slice(2)}`;
export const SEASON_NUMBER = 14;
export const FOUNDED = 2013;

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
