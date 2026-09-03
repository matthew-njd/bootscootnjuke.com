import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getChampionshipWinners,
  getHighestWeekTotals,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
} from "../services/database";
import Podium from "../components/common/Podium";
import Page, { Notice } from "../components/layout/Page";
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

export default function Leaderboards() {
  const [champs, setChamps] = useState<Champion[]>([]);
  const [weekTotals, setWeekTotals] = useState<HighestWeekTotal[]>([]);
  const [playerTotals, setPlayerTotals] = useState<HighestPlayerTotal[]>([]);
  const [seasonTotals, setSeasonTotals] = useState<HighestSeasonalTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      getChampionshipWinners(),
      getHighestWeekTotals(),
      getHighestPlayerTotals(),
      getHighestSeasonTotals(),
    ])
      .then(([champsData, week, player, season]) => {
        setChamps((champsData as Champion[]) ?? []);
        setWeekTotals(week ?? []);
        setPlayerTotals(player ?? []);
        setSeasonTotals(season ?? []);
      })
      .catch((err) => {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || error) {
    return (
      <Page title="Leaderboards" kicker="Record Book">
        <Notice>{error ?? "Loading leaderboards…"}</Notice>
      </Page>
    );
  }

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
