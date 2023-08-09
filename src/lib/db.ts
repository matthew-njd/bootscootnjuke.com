import { supabase } from "$lib/supabase";

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

export const getStats = async (ownerId: string) => {
  let { data: stats, error } = await supabase
    .from("stats")
    .select("*")
    .eq("ownerId", `${ownerId}`)
    .order("year", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return stats;
  }
};
