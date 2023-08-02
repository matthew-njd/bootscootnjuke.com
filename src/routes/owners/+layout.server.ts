import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load() {
  interface Owner {
    docId: string;
    name: string;
  }
  try {
    const ownersObj: Owner[] = [];
    const docRef = await getDocs(collection(db, "owners"));

    docRef.forEach((owner) => {
      ownersObj.push({ docId: owner.id, name: owner.data().name });
    });

    return { ...ownersObj };
  } catch (error) {
    console.error("Error loading owners:", error);
    throw error;
  }
}

async function getOwnersSeasons(docId: string) {
  let seasons: any[] = [];
  const seasonsPerOwner = await getDocs(
    collection(db, "owners", docId, "seasons")
  );
  seasonsPerOwner.forEach((seasonPerOwner) => {
    seasons.push(seasonPerOwner.data());
  });
}
