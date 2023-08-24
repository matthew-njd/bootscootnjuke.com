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

// for leaderboard page
export const getLeaderborders = async () => {
  let { data: leaderboards, error } = await supabase
    .from("leaderboards")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return leaderboards;
  }
};

export const getChampionshipWinners = async () => {
  let { data: champs, error } = await supabase
    .from("champs")
    .select("*")
    .order("titlewins", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    console.log("error", error);
  } else {
    return champs;
  }
};

export const getHighestWeekTotals = async () => {
  let { data: highest_week_totals, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_week_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return highest_week_totals;
  }
};

export const getHighestPlayerTotals = async () => {
  let { data: highest_player_totals, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_player_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return highest_player_totals;
  }
};

export const getHighestSeasonTotals = async () => {
  let { data: highest_seasonal_totals, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", "highest_season_totals")
    .order("points", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return highest_seasonal_totals;
  }
};

// for individual leadboard page
export const getLeaderBoardById = async (leaderboardId: string) => {
  let { data: leaderboard, error } = await supabase
    .from("leaderboards")
    .select("*")
    .eq("leaderboardId", `${leaderboardId}`)
    .order("year", { ascending: false });

  if (error) {
    console.log("error", error);
  } else {
    return leaderboard;
  }
};
