import { getOwners, getStats } from "$lib/db";

export async function load() {
  try {
    const owners = await getOwners();

    return { owners };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
