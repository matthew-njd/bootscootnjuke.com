import {
  getChampionshipWinners,
  getHighestPlayerTotals,
  getHighestWeekTotals,
} from "$lib/db";

export async function load() {
  try {
    const champs = await getChampionshipWinners();

    const highest_week_totals = await getHighestWeekTotals();

    const highest_player_totals = await getHighestPlayerTotals();

    return { champs, highest_week_totals, highest_player_totals };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
