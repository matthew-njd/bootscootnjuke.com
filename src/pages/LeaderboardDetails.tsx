import { useParams } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  getChampionshipWinners,
  getHighestWeekTotals,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
} from "../services/database";
import Table, { type Column } from "../components/common/Table";
import Page, { Notice } from "../components/layout/Page";

import type {
  Champion,
  HighestWeekTotal,
  HighestPlayerTotal,
  HighestSeasonalTotal,
} from "../types";

function board<T>(data: T[], columns: Column<T>[]): ReactNode {
  if (data.length === 0) return <Notice>No data available yet.</Notice>;
  return <Table data={data} columns={columns} />;
}

async function loadBoard(
  leaderboardId: string,
): Promise<{ title: string; table: ReactNode } | null> {
  switch (leaderboardId) {
    case "champs":
      return {
        title: "Z10 Winners",
        table: board(await getChampionshipWinners(), [
          { header: "Owner", accessor: "name" as keyof Champion },
          { header: "Championships", accessor: "titlewins" as keyof Champion },
        ]),
      };

    case "highest_week_totals":
      return {
        title: "Highest Weekly Totals",
        table: board<HighestWeekTotal>(await getHighestWeekTotals(), [
          { header: "Year", accessor: "year" },
          { header: "Week", accessor: "week" },
          { header: "Team", accessor: "team" },
          { header: "Owner", accessor: "owner" },
          { header: "Points", accessor: "points" },
        ]),
      };

    case "highest_player_totals":
      return {
        title: "Highest Player Totals",
        table: board<HighestPlayerTotal>(await getHighestPlayerTotals(), [
          { header: "Year", accessor: "year" },
          { header: "Week", accessor: "week" },
          { header: "Player", accessor: "player" },
          { header: "Team", accessor: "team" },
          { header: "Owner", accessor: "owner" },
          { header: "Points", accessor: "points" },
        ]),
      };

    case "highest_season_totals":
      return {
        title: "Highest Season Totals",
        table: board<HighestSeasonalTotal>(await getHighestSeasonTotals(), [
          { header: "Year", accessor: "year" },
          { header: "Team", accessor: "team" },
          { header: "Owner", accessor: "owner" },
          { header: "Points", accessor: "points" },
        ]),
      };

    default:
      return null;
  }
}

export default function LeaderboardDetails() {
  const { leaderboardId } = useParams<{ leaderboardId: string }>();
  const [result, setResult] = useState<{
    title: string;
    table: ReactNode;
  } | null>(null);
  const [loading, setLoading] = useState(Boolean(leaderboardId));
  const [fetchError, setFetchError] = useState<string | null>(null);
  const error = leaderboardId ? fetchError : "Leaderboard ID not found";

  useEffect(() => {
    if (!leaderboardId) return;

    loadBoard(leaderboardId)
      .then((loaded) => {
        if (loaded) setResult(loaded);
        else setFetchError("Leaderboard not found");
      })
      .catch((err) => {
        setFetchError("Failed to fetch leaderboard");
        console.error("Error fetching leaderboard:", err);
      })
      .finally(() => setLoading(false));
  }, [leaderboardId]);

  return (
    <Page
      title={result?.title ?? "Leaderboard"}
      kicker="Record Book"
      back={{ to: "/leaderboards", label: "All leaderboards" }}
    >
      {loading && <Notice>Loading leaderboard…</Notice>}
      {error && <Notice>{error}</Notice>}
      {result?.table}
    </Page>
  );
}
