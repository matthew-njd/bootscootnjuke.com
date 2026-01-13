import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChampionshipWinners,
  getHighestWeekTotals,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
} from "../services/database";
import Table from "../components/common/Table";

type LeaderboardData =
  | Awaited<ReturnType<typeof getChampionshipWinners>>
  | Awaited<ReturnType<typeof getHighestWeekTotals>>
  | Awaited<ReturnType<typeof getHighestPlayerTotals>>
  | Awaited<ReturnType<typeof getHighestSeasonTotals>>;

export default function LeaderboardDetails() {
  const { leaderboardId } = useParams<{ leaderboardId: string }>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!leaderboardId) {
        setError("Leaderboard ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        let data: LeaderboardData | undefined;

        switch (leaderboardId) {
          case "champs":
            data = await getChampionshipWinners();
            break;
          case "highest_week_totals":
            data = await getHighestWeekTotals();
            break;
          case "highest_player_totals":
            data = await getHighestPlayerTotals();
            break;
          case "highest_season_totals":
            data = await getHighestSeasonTotals();
            break;
        }

        if (data) {
          console.log(data);
          setLeaderboard(data);
        } else {
          setError("Leaderboard not found");
        }
      } catch (err) {
        setError("Failed to fetch leaderboard");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [leaderboardId]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <h1 className="text-6xl mb-6">Leaderboard Details</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4em"
          height="4em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2 21V9h5.5v12zm7.25 0V3h5.5v18zm7.25 0V11H22v10z"
          />
        </svg>
      </div>
    </div>
  );
}
