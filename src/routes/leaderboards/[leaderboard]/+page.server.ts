import { getLeaderBoardById, getLeaderborders } from "$lib/db";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const leaderboards = await getLeaderborders();
  const leaderboard = leaderboards?.find(
    (leaderboard) => leaderboard.leaderboardId === params.leaderboard
  );
  const leadboard_category = await getLeaderBoardById(params.leaderboard);

  if (!leaderboard) throw error(404);
  if (!leadboard_category) throw error(404);

  console.log(params.leaderboard);

  return {
    leadboard_category,
  };
}
