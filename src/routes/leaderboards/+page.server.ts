import { getOwners, getStats, getTeamsWithChampionships } from "$lib/db";

export async function load() {
  try {
    const owners = await getOwners();
    const stats = await getStats();

    const champs = await getTeamsWithChampionships();

    return { champs };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
