import { getChampionshipWinners, getHighestWeekTotals } from "$lib/db";

export async function load() {
  try {
    const champs = await getChampionshipWinners();

    const highest_week_totals = await getHighestWeekTotals();

    return { champs, highest_week_totals };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
