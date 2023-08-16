import { getChampionshipWinners } from "$lib/db";

export async function load() {
  try {
    const champs = await getChampionshipWinners();

    return { champs };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
