import { useParams } from "react-router-dom";
import { type ReactNode } from "react";
import { getChampionshipWinners, getLeaderboard } from "../services/database";
import Table from "../components/common/Table";
import { useAsync } from "../lib/useAsync";
import Page, { Notice, LoadFailed } from "../components/layout/Page";

import type {
  Champion,
  HighestWeekTotal,
  HighestPlayerTotal,
  HighestSeasonalTotal,
} from "../types";

async function loadBoard(
  leaderboardId: string,
): Promise<{ title: string; table: ReactNode } | null> {
  switch (leaderboardId) {
    case "champs":
      return {
        title: "Z10 Winners",
        table: (
          <Table
            data={await getChampionshipWinners()}
            columns={[
              { header: "Owner", accessor: "name" as keyof Champion },
              {
                header: "Championships",
                accessor: "titlewins" as keyof Champion,
              },
            ]}
          />
        ),
      };

    case "highest_week_totals":
      return {
        title: "Highest Weekly Totals",
        table: (
          <Table<HighestWeekTotal>
            data={await getLeaderboard<HighestWeekTotal>("highest_week_totals")}
            columns={[
              { header: "Year", accessor: "year" },
              { header: "Week", accessor: "week" },
              { header: "Team", accessor: "team" },
              { header: "Owner", accessor: "owner" },
              { header: "Points", accessor: "points" },
            ]}
          />
        ),
      };

    case "highest_player_totals":
      return {
        title: "Highest Player Totals",
        table: (
          <Table<HighestPlayerTotal>
            data={await getLeaderboard<HighestPlayerTotal>(
              "highest_player_totals",
            )}
            columns={[
              { header: "Year", accessor: "year" },
              { header: "Week", accessor: "week" },
              { header: "Player", accessor: "player" },
              { header: "Team", accessor: "team" },
              { header: "Owner", accessor: "owner" },
              { header: "Points", accessor: "points" },
            ]}
          />
        ),
      };

    case "highest_season_totals":
      return {
        title: "Highest Season Totals",
        table: (
          <Table<HighestSeasonalTotal>
            data={await getLeaderboard<HighestSeasonalTotal>(
              "highest_season_totals",
            )}
            columns={[
              { header: "Year", accessor: "year" },
              { header: "Team", accessor: "team" },
              { header: "Owner", accessor: "owner" },
              { header: "Points", accessor: "points" },
            ]}
          />
        ),
      };

    default:
      return null;
  }
}

export default function LeaderboardDetails() {
  const { leaderboardId } = useParams<{ leaderboardId: string }>();
  const { data, loading, failed } = useAsync(
    () => loadBoard(leaderboardId ?? ""),
    [leaderboardId],
  );

  return (
    <Page
      title={data?.title ?? "Leaderboard"}
      kicker="Record Book"
      back={{ to: "/leaderboards", label: "All leaderboards" }}
    >
      {loading && <Notice>Loading leaderboard…</Notice>}
      {failed && <LoadFailed />}
      {!loading && !failed && !data && <Notice>Leaderboard not found.</Notice>}
      {data?.table}
    </Page>
  );
}
