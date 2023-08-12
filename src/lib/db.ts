import { supabase } from "$lib/supabase";

// for owners page
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

// for owner's stat page
export const getStatsByOwner = async (ownerId: string) => {
  let { data: ownerStats, error } = await supabase
    .from("stats")
    .select("*")
    .eq("ownerId", `${ownerId}`)
    .order("year", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return ownerStats;
  }
};

// for leaderboard page
export const getTeamsWithChampionships = async () => {
  let { data: winners, error } = await supabase
    .from("stats")
    .select("ownerId")
    .eq("finalPlace", 1)
    .order("ownerId", { ascending: true });

  if (error) {
    console.log("error", error);
  } else {
    return winners;
  }
};

export const getAllStats = async () => {
  let { data: stats, error } = await supabase
    .from("stats")
    .select("*")
    .order("ownerId", { ascending: true })
    .order("year", { ascending: true });

  if (error) {
    console.log("error", error);
  } else {
    return stats;
  }
};
