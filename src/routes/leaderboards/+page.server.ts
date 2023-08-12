import { getOwners, getAllStats, getTeamsWithChampionships } from "$lib/db";

export async function load() {
  try {
    const owners = await getOwners();
    const stats = await getAllStats();

    const champs = await getTeamsWithChampionships();

    return { stats };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
