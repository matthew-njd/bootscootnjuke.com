import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getChampionshipWinners,
  getHighestWeekTotals,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
} from "../services/database";
import Table from "../components/common/Table";
import type {
  Champion,
  HighestWeekTotal,
  HighestPlayerTotal,
  HighestSeasonalTotal,
} from "../types";

type LeaderboardConfig = {
  title: string;
  data:
    | Champion[]
    | HighestWeekTotal[]
    | HighestPlayerTotal[]
    | HighestSeasonalTotal[];
  columns: any[];
};

export default function LeaderboardDetails() {
  const { leaderboardId } = useParams<{ leaderboardId: string }>();
  const [config, setConfig] = useState<LeaderboardConfig | null>(null);
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

        switch (leaderboardId) {
          case "champs": {
            const data = await getChampionshipWinners();
            setConfig({
              title: "Championship Winners",
              data: data || [],
              columns: [
                { header: "Owner", accessor: "name" as keyof Champion },
                {
                  header: "Championships",
                  accessor: "titlewins" as keyof Champion,
                },
              ],
            });
            break;
          }
          case "highest_week_totals": {
            const data = await getHighestWeekTotals();
            setConfig({
              title: "Highest Weekly Totals",
              data: data || [],
              columns: [
                { header: "Year", accessor: "year" as keyof HighestWeekTotal },
                { header: "Week", accessor: "week" as keyof HighestWeekTotal },
                { header: "Team", accessor: "team" as keyof HighestWeekTotal },
                {
                  header: "Owner",
                  accessor: "owner" as keyof HighestWeekTotal,
                },
                {
                  header: "Points",
                  accessor: "points" as keyof HighestWeekTotal,
                },
              ],
            });
            break;
          }
          case "highest_player_totals": {
            const data = await getHighestPlayerTotals();
            setConfig({
              title: "Highest Player Totals",
              data: data || [],
              columns: [
                {
                  header: "Year",
                  accessor: "year" as keyof HighestPlayerTotal,
                },
                {
                  header: "Week",
                  accessor: "week" as keyof HighestPlayerTotal,
                },
                {
                  header: "Player",
                  accessor: "player" as keyof HighestPlayerTotal,
                },
                {
                  header: "Team",
                  accessor: "team" as keyof HighestPlayerTotal,
                },
                {
                  header: "Owner",
                  accessor: "owner" as keyof HighestPlayerTotal,
                },
                {
                  header: "Points",
                  accessor: "points" as keyof HighestPlayerTotal,
                },
              ],
            });
            break;
          }
          case "highest_season_totals": {
            const data = await getHighestSeasonTotals();
            setConfig({
              title: "Highest Season Totals",
              data: data || [],
              columns: [
                {
                  header: "Year",
                  accessor: "year" as keyof HighestSeasonalTotal,
                },
                {
                  header: "Team",
                  accessor: "team" as keyof HighestSeasonalTotal,
                },
                {
                  header: "Owner",
                  accessor: "owner" as keyof HighestSeasonalTotal,
                },
                {
                  header: "Points",
                  accessor: "points" as keyof HighestSeasonalTotal,
                },
              ],
            });
            break;
          }
          default:
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading leaderboard...
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="text-error">Error: {error || "Unknown error"}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex gap-2 mb-6">
        <h1 className="text-6xl">{config.title}</h1>
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

      {config.data.length === 0 ? (
        <p>No data available for this leaderboard.</p>
      ) : (
        <Table
          data={config.data}
          columns={config.columns}
          showIndex={false}
          className="w-full max-w-6xl"
        />
      )}
    </div>
  );
}
