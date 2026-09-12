import { Link } from "react-router-dom";
import { getChampionshipWinners, getLeaderboard } from "../services/database";
import { useAsync } from "../lib/useAsync";
import Podium from "../components/common/Podium";
import Page, { Notice, LoadFailed } from "../components/layout/Page";
import type {
  Champion,
  HighestWeekTotal,
  HighestPlayerTotal,
  HighestSeasonalTotal,
} from "../types";

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-base-content/10 py-1 last:border-0">
      <span className="label-caps text-[0.6rem] text-base-content/50">
        {label}
      </span>
      <span className="text-sm">{value ?? "TBD"}</span>
    </div>
  );
}

function SeeMore({ to }: { to: string }) {
  return (
    <Link
      to={to}
      className="label-caps text-xs border-2 border-base-content px-5 py-2 hover:bg-primary hover:text-primary-content transition-colors"
    >
      Full table &rarr;
    </Link>
  );
}

function places<T>(rows: T[], render: (row: T | undefined) => Place) {
  return {
    firstPlace: render(rows[0]),
    secondPlace: render(rows[1]),
    thirdPlace: render(rows[2]),
  };
}

type Place = { stat: React.ReactNode; details: React.ReactNode };

function loadLeaderboards() {
  return Promise.all([
    getChampionshipWinners() as Promise<Champion[]>,
    getLeaderboard<HighestWeekTotal>("highest_week_totals"),
    getLeaderboard<HighestPlayerTotal>("highest_player_totals"),
    getLeaderboard<HighestSeasonalTotal>("highest_season_totals"),
  ]);
}

export default function Leaderboards() {
  const { data, loading, failed } = useAsync(loadLeaderboards, []);

  if (loading || failed || !data) {
    return (
      <Page title="Leaderboards" kicker="Record Book">
        {failed ? <LoadFailed /> : <Notice>Loading leaderboards…</Notice>}
      </Page>
    );
  }

  const [champs, weekTotals, playerTotals, seasonTotals] = data;

  return (
    <Page
      title="Leaderboards"
      kicker="Record Book"
      subtitle="Titles, blowouts, and the single best days anyone has ever had."
    >
      <div className="space-y-20">
        <Podium
          title="Most Z10s"
          {...places(champs, (row) => ({
            stat: row?.titlewins ?? 0,
            details: <Meta label="Owner" value={row?.name} />,
          }))}
          seeMoreButton={<SeeMore to="/leaderboards/champs/details" />}
        />

        <Podium
          title="Highest Weekly Total"
          {...places(weekTotals, (row) => ({
            stat: row?.points ?? 0,
            details: (
              <>
                <Meta label="Team" value={row?.team} />
                <Meta label="Owner" value={row?.owner} />
                <Meta
                  label="When"
                  value={row ? `${row.year} · Week ${row.week}` : undefined}
                />
              </>
            ),
          }))}
          seeMoreButton={
            <SeeMore to="/leaderboards/highest_week_totals/details" />
          }
        />

        <Podium
          title="Highest Player Total"
          {...places(playerTotals, (row) => ({
            stat: row?.points ?? 0,
            details: (
              <>
                <Meta label="Player" value={row?.player} />
                <Meta label="Team" value={row?.team} />
                <Meta label="Owner" value={row?.owner} />
                <Meta label="Year" value={row?.year} />
              </>
            ),
          }))}
          seeMoreButton={
            <SeeMore to="/leaderboards/highest_player_totals/details" />
          }
        />

        <Podium
          title="Highest Season Total"
          {...places(seasonTotals, (row) => ({
            stat: row?.points ?? 0,
            details: (
              <>
                <Meta label="Team" value={row?.team} />
                <Meta label="Owner" value={row?.owner} />
                <Meta label="Year" value={row?.year} />
              </>
            ),
          }))}
          seeMoreButton={
            <SeeMore to="/leaderboards/highest_season_totals/details" />
          }
        />
      </div>
    </Page>
  );
}
