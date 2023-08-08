import { collection, getDocs } from "@firebase/firestore";
import { db } from "$lib/firebase";
import type { Owner, Season } from "$lib/types";

import { supabase } from "$lib/supabase";

export async function getOwnersOld(): Promise<Owner[]> {
  const colRef = collection(db, "owners");
  const snapshot = await getDocs(colRef);

  return snapshot.docs.map((o) => {
    const data = o.data();

    return {
      id: o.id,
      active: data.active,
      name: data.name,
      bio: data.bio,
      logo: data.logo,
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

export const getOwners = async () => {
  let { data: owners, error } = await supabase
    .from("owners")
    .select("*")
    .order("ownerId", { ascending: true });

  if (error) {
    console.log("error", error);
  } else {
    return owners;
  }
};

export const getSeasonsSupa = async (ownerId: string) => {
  let { data: seasons, error } = await supabase
    .from("seasons")
    .select("*")
    .eq("ownerId", `${ownerId}`)
    .order("year", { ascending: true });

  if (error) {
    console.log("error", error);
  } else {
    return seasons;
  }
};