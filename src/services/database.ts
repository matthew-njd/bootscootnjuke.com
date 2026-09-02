import { supabase } from "../lib/supabase";
import type { Database, HighestWeekTotal } from "../types";
import type { HighestPlayerTotal } from "../types";
import type { HighestSeasonalTotal } from "../types";
type Owner = Database["public"]["Tables"]["owners"]["Row"];
type Recap = Database["public"]["Tables"]["recaps"]["Row"];

// for owners page
export const getOwners = async (): Promise<Owner[]> => {
  const { data, error } = await supabase
    .from("owners")
    .select("*")
    .order("ownerId", { ascending: true });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return data;
  }
};

// for owner's stat page
export const getStatsByOwner = async (ownerId: string) => {
  const { data: ownerStats, error } = await supabase
    .from("stats")
    .select("*")
    .eq("ownerId", `${ownerId}`)
    .order("year", { ascending: false });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return ownerStats;
  }
};

export const getAllStats = async () => {
  const { data: stats, error } = await supabase
    .from("stats")
    .select("*")
    .order("ownerId", { ascending: true })
    .order("year", { ascending: true });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return stats;
  }
};

// for leaderboard page
export const getLeaderborders = async () => {
  const { data: leaderboards, error } = await supabase
    .from("leaderboards")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return leaderboards;
  }
};

export const getChampionshipWinners = async () => {
  const { data: champs, error } = await supabase
    .from("champs")
    .select("*")
    .order("titlewins", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return champs;
  }
};

export const getHighestWeekTotals = async (): Promise<HighestWeekTotal[]> => {
  const { data, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_week_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  }

  return (data ?? []) as HighestWeekTotal[];
};

export const getHighestPlayerTotals = async (): Promise<
  HighestPlayerTotal[]
> => {
  const { data, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_player_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as HighestPlayerTotal[];
};

export const getHighestSeasonTotals = async (): Promise<
  HighestSeasonalTotal[]
> => {
  const { data, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_season_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  }
  return (data ?? []) as HighestSeasonalTotal[];
};

// for recaps
export const getLatestRecap = async (): Promise<Recap | null> => {
  const { data, error } = await supabase
    .from("recaps")
    .select("*")
    .order("year", { ascending: false })
    .order("week", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  }
  return data;
};

export const getRecapByWeek = async (week: number): Promise<Recap | null> => {
  const { data, error } = await supabase
    .from("recaps")
    .select("*")
    .eq("week", week)
    .order("year", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  }
  return data;
};

// for drafts page
export const getDraftHistory = async () => {
  const { data: drafts, error } = await supabase
    .from("drafts")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.log("error", error.message);
    throw new Error(error.message);
  } else {
    return drafts;
  }
};
