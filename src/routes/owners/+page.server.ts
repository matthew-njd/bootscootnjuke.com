import { getOwners } from "$lib/db";

export async function load() {
  try {
    const owner = await getOwners();

    return { owner };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
