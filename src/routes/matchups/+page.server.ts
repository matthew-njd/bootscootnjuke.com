import type { PageServerLoad } from "./$types";

export const load = (async () => {
  const url =
    "https://api.sleeper.app/v1/league/1101906658076311552/matchups/1";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return { json };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}) satisfies PageServerLoad;
