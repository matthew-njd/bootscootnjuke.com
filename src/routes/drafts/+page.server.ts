import { getDraftHistory } from "$lib/db";

export async function load() {
  try {
    const draft = await getDraftHistory();

    return { draft };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
