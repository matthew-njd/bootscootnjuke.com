import {
  getChampionshipWinners,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
  getHighestWeekTotals,
} from "$lib/db";

export async function load() {
  try {
    const champs = await getChampionshipWinners();

    const highest_week_totals = await getHighestWeekTotals();

    const highest_player_totals = await getHighestPlayerTotals();

    const highest_seasonal_totals = await getHighestSeasonTotals();

    return {
      champs,
      highest_week_totals,
      highest_player_totals,
      highest_seasonal_totals,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
