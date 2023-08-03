import { collection, getDocs } from "@firebase/firestore";
import { db } from "$lib/firebase";
import type { Owner, Season } from "$lib/types";

export async function getOwners(): Promise<Owner[]> {
  const colRef = collection(db, "owners");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((o) => {
    const data = o.data();

    return {
      id: o.id,
      active: data.active,
      name: data.name,
      bio: data.bio,
    };
  });
}

export async function getSeasons(ownerId: string): Promise<Season[]> {
  const colRef = collection(db, "owners", ownerId, "seasons");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((s) => {
    const data = s.data();

    return {
      id: s.id,
      year: data.year,
      team: data.team_name,
      wins: data.wins,
      loses: data.loses,
      ptsFor: data.pts_for,
      ptsAgst: data.pts_agst,
      finalPlace: data.final_place,
    };
  });
}
