import { getDraftHistory } from "$lib/db";

import DraftTabStore from "../../store";

//TODO reload page after data from store changes.
let draftId: string;
DraftTabStore.subscribe((data) => {
  console.log(data);
});

export async function load() {
  try {
    const draft = await getDraftHistory("draft_2023");

    return { draft };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
