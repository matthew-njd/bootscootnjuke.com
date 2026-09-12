import { supabase } from "../lib/supabase";
import type { Database } from "../types";

type Owner = Database["public"]["Tables"]["owners"]["Row"];
type Recap = Database["public"]["Tables"]["recaps"]["Row"];

function unwrap<T>({
  data,
  error,
}: {
  data: T | null;
  error: { message: string } | null;
}): T {
  if (error) throw new Error(error.message);
  return data as T;
}

// for owners page
export async function getOwners(): Promise<Owner[]> {
  return unwrap(
    await supabase.from("owners").select("*").order("ownerId", {
      ascending: true,
    }),
  );
}

// for owner's stat page
export async function getStatsByOwner(ownerId: string) {
  return unwrap(
    await supabase
      .from("stats")
      .select("*")
      .eq("ownerId", ownerId)
      .order("year", { ascending: false }),
  );
}

// for leaderboard page
export async function getChampionshipWinners() {
  return unwrap(
    await supabase
      .from("champs")
      .select("*")
      .order("titlewins", { ascending: false })
      .order("name", { ascending: true }),
  );
}

export async function getLeaderboard<T>(leaderboardId: string): Promise<T[]> {
  return (unwrap(
    await supabase
      .from("leaderboards")
      .select("*")
      .eq("leaderboardId", leaderboardId)
      .order("points", { ascending: false }),
  ) ?? []) as T[];
}

// for recaps
export async function getLatestRecap(): Promise<Recap | null> {
  return unwrap(
    await supabase
      .from("recaps")
      .select("*")
      .order("year", { ascending: false })
      .order("week", { ascending: false })
      .limit(1)
      .maybeSingle(),
  );
}

export async function getRecapByWeek(week: number): Promise<Recap | null> {
  return unwrap(
    await supabase
      .from("recaps")
      .select("*")
      .eq("week", week)
      .order("year", { ascending: false })
      .limit(1)
      .maybeSingle(),
  );
}

// for drafts page
export async function getDraftHistory() {
  return unwrap(
    await supabase.from("drafts").select("*").order("id", { ascending: true }),
  );
}
