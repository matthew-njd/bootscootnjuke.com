import {
  getChampionshipWinners,
  getLeaderboard,
  getOwners,
  getStats,
} from "../services/database";
import { useAsync } from "../lib/useAsync";
import { finishCounts, type FinishCount } from "../lib/shame";
import Podium, { type Place } from "../components/common/Podium";
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
      <span className="text-sm text-end">{value ?? "TBD"}</span>
    </div>
  );
}

function loadLeaderboards() {
  return Promise.all([
    getChampionshipWinners() as Promise<Champion[]>,
    getLeaderboard<HighestWeekTotal>("highest_week_totals"),
    getLeaderboard<HighestPlayerTotal>("highest_player_totals"),
    getLeaderboard<HighestSeasonalTotal>("highest_season_totals"),
    getOwners(),
    getStats(),
  ]);
}

// The shame boards share one look: red band on a dark stage.
const SHAME = {
  band: "bg-error text-error-content",
  stage: "bg-neutral text-neutral-content",
};

export default function Leaderboards() {
  const { data, loading, failed } = useAsync(loadLeaderboards, []);

  if (loading || failed || !data) {
    return (
      <Page title="Leaderboards" kicker="Record Book">
        {failed ? <LoadFailed /> : <Notice>Loading leaderboards…</Notice>}
      </Page>
    );
  }

  const [champs, weekTotals, playerTotals, seasonTotals, owners, stats] = data;
  const logos = new Map(owners.map((o) => [o.ownerId, o.logoUrl]));
  const names = new Map(owners.map((o) => [o.ownerId, o.name]));

  // Top three rows, padded so a short board still fills the podium.
  const places = <T extends { ownerId: string | null }>(
    rows: T[],
    render: (row: T | undefined) => Omit<Place, "avatar">,
  ): Place[] =>
    [0, 1, 2].map((i) => ({
      ...render(rows[i]),
      avatar: logos.get(rows[i]?.ownerId ?? ""),
    }));

  const finishes = (row: FinishCount | undefined) => ({
    stat: row?.count ?? 0,
    details: (
      <>
        <Meta label="Owner" value={row && names.get(row.ownerId)} />
        <Meta label="Years" value={row?.years.join(", ")} />
      </>
    ),
  });

  const season = (row: (typeof stats)[number] | undefined, stat: number) => ({
    stat,
    details: (
      <>
        <Meta label="Team" value={row?.team} />
        <Meta label="Owner" value={row && names.get(row.ownerId ?? "")} />
        <Meta
          label="When"
          value={row ? `${row.year} · ${row.wins}-${row.loses}` : undefined}
        />
      </>
    ),
  });

  const mostAgainst = [...stats].sort(
    (a, b) => (b.ptsAgst ?? 0) - (a.ptsAgst ?? 0),
  );
  const fewestFor = [...stats].sort(
    (a, b) => (a.ptsFor ?? Infinity) - (b.ptsFor ?? Infinity),
  );

  return (
    <Page
      title="Leaderboards"
      kicker="Record Book"
      subtitle="Titles, blowouts, and the single best days anyone has ever had."
    >
      <div className="space-y-12">
        <Podium
          title="Most Z10s"
          band="bg-primary text-primary-content"
          to="/leaderboards/champs/details"
          places={places(champs, (row) => ({
            stat: row?.titlewins ?? 0,
            details: <Meta label="Owner" value={row?.name} />,
          }))}
        />

        <Podium
          title="Highest Weekly Total"
          band="bg-accent text-accent-content"
          to="/leaderboards/highest_week_totals/details"
          places={places(weekTotals, (row) => ({
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
        />

        <Podium
          title="Highest Player Total"
          band="bg-neutral text-neutral-content"
          to="/leaderboards/highest_player_totals/details"
          places={places(playerTotals, (row) => ({
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
        />

        <Podium
          title="Highest Season Total"
          band="bg-primary text-primary-content"
          to="/leaderboards/highest_season_totals/details"
          places={places(seasonTotals, (row) => ({
            stat: row?.points ?? 0,
            details: (
              <>
                <Meta label="Team" value={row?.team} />
                <Meta label="Owner" value={row?.owner} />
                <Meta label="Year" value={row?.year} />
              </>
            ),
          }))}
        />
      </div>

      <section className="mt-20">
        <h2 className="wood-type text-3xl sm:text-5xl uppercase">
          Wall of Shame
        </h2>
        <p className="mt-3 max-w-2xl text-base-content/70">
          The records nobody wants, kept forever anyway.
        </p>
        <div className="rule-double text-base-content/40 mt-5 mb-10" />

        <div className="space-y-12">
          <Podium
            title="Most Wurtzes"
            subtitle="The last-place trophy"
            {...SHAME}
            places={places(finishCounts(stats, "last"), finishes)}
          />

          <Podium
            title="Always the Bridesmaid"
            subtitle="Most second-place finishes"
            {...SHAME}
            places={places(finishCounts(stats, 2), finishes)}
          />

          <Podium
            title="Snakebitten"
            subtitle="Most points against in a season"
            {...SHAME}
            places={places(mostAgainst, (row) =>
              season(row, row?.ptsAgst ?? 0),
            )}
          />

          <Podium
            title="Running on Empty"
            subtitle="Fewest points in a season"
            {...SHAME}
            places={places(fewestFor, (row) => season(row, row?.ptsFor ?? 0))}
          />
        </div>
      </section>
    </Page>
  );
}
