import { db } from "$lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function load() {
  let ownersArr: object[] = [];

  const docRef = await getDocs(collection(db, "owners"));
  docRef.forEach((owner) => {
    ownersArr.push({ id: owner.id, title: owner.data().name });
  });
  return { ...ownersArr };
}

async function getOwnersSeasons(docId: string) {
  let seasons: any[] = [];
  try {
    const seasonsPerOwner = await getDocs(
      collection(db, "owners", docId, "seasons")
    );
    seasonsPerOwner.forEach((seasonPerOwner) => {
      seasons.push(seasonPerOwner.data());
    });
    console.log(seasons);
  } catch (error) {
    console.error("Error fetching seasons:", error);
    throw error;
  }
}
