import { collection, getDocs } from "@firebase/firestore";
import { db } from "$lib/firebase";
import type { Owner } from "$lib/types";

export async function getOwners(): Promise<Owner[]> {
  const colRef = collection(db, "owners");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((o) => {
    const data = o.data();

    return {
      id: o.id,
      owner: data["owner"],
      name: data["name"],
    };
  });
}
