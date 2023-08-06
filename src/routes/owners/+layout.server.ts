import { getOwners, getOwnersSupa } from "$lib/db";

export async function load() {
  try {
    const owners = await getOwners();

    const supaOwners = await getOwnersSupa();

    return { owners, supaOwners };
  } catch (error) {
    console.error("Error fetching data from Firebase:", error);
    throw error;
  }
}
