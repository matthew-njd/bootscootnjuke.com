import { useState, type ReactNode } from "react";
import { useAsync } from "../lib/useAsync";
import { loadParlay, type ParlayWeek } from "../lib/parlay";
import Page, { Notice, LoadFailed } from "../components/layout/Page";
import ParlayCard from "../components/common/ParlayCard";
import StatCards from "../components/common/StatCards";
import Table, { type Column } from "../components/common/Table";
import Stepper from "../components/common/Stepper";

interface OwnerRecord {
  name: string;
  hits: number;
  legs: number;
}

const pct = (hits: number, legs: number) => (legs ? hits / legs : 0);

const COLUMNS: Column<OwnerRecord>[] = [
  { header: "Owner", accessor: "name", className: "label-caps text-xs" },
  { header: "Hits", accessor: "hits", className: "figures text-center" },
  { header: "Legs", accessor: "legs", className: "figures text-center" },
  {
    header: "Hit %",
    accessor: (r) => `${Math.round(pct(r.hits, r.legs) * 100)}%`,
    sortValue: (r) => pct(r.hits, r.legs),
    className: "figures text-end",
  },
];

// The all-time longest run of hits, plus the longest runs of hits and misses still going.
function streaks(weeks: ParlayWeek[], names: Map<string, string>) {
  const results = new Map<string, boolean[]>();
  // Weeks arrive newest first; streaks are counted oldest first.
  for (const week of [...weeks].reverse()) {
    for (const leg of week.legs) {
      if (leg.hit === null) continue;
      const hits = results.get(leg.ownerId) ?? [];
      hits.push(leg.hit);
      results.set(leg.ownerId, hits);
    }
  }

  const longestHits = (hits: boolean[]) => {
    let run = 0;
    let most = 0;
    for (const hit of hits) {
      run = hit ? run + 1 : 0;
      most = Math.max(most, run);
    }
    return most;
  };
  // The run still going at the end of the list, of hits or of misses.
  const current = (want: boolean) => (hits: boolean[]) =>
    hits.length - 1 - hits.lastIndexOf(!want);

  // Ties share the tile rather than one owner getting it by list order.
  const leader = (score: (hits: boolean[]) => number) => {
    const scored = [...results].map(([id, hits]) => ({ id, n: score(hits) }));
    const top = Math.max(0, ...scored.map((s) => s.n));
    const who = scored
      .filter((s) => s.n === top)
      .map((s) => names.get(s.id) ?? s.id);
    return { n: top, who: top ? who : [] };
  };

  return {
    heater: leader(longestHits),
    active: leader(current(true)),
    cold: leader(current(false)),
  };
}

const CAPTION = "label-caps text-[0.65rem] text-base-content/45";

// A stat with a short caption underneath, like the Matchups tiles.
const tile = (label: string, value: ReactNode, caption: ReactNode) => ({
  label,
  value: (
    <>
      {value}
      {/* No truncate: its overflow clip would cut off the tooltip. */}
      <span className={`block ${CAPTION}`}>{caption}</span>
    </>
  ),
});

// The owners a stat belongs to. Big ties collapse to a count, with the
// names in a tooltip (tap works too).
const ownersCaption = (who: string[]) =>
  who.length > 2 ? (
    <span
      tabIndex={0}
      data-tip={who.join(", ")}
      className="tooltip tooltip-bottom before:text-[0.65rem]! before:font-medium! cursor-help underline decoration-dotted"
    >
      {who.length} tied
    </span>
  ) : (
    who.join(" & ") || "Nobody"
  );

export default function Parlay() {
  const [year, setYear] = useState<number | null>(null);
  const { data, loading, failed } = useAsync(loadParlay, []);
  const title = "The Parlay";
  const kicker = "Ten Legs, Five Bucks";

  if (loading || failed || !data) {
    return (
      <Page title={title} kicker={kicker}>
        {failed ? <LoadFailed /> : <Notice>Loading the slips…</Notice>}
      </Page>
    );
  }

  // Stats and the owner table cover every season; the picker only filters the slips.
  const { weeks, names } = data;
  // Weeks arrive newest first, so the first year is the latest season.
  const years = [...new Set(weeks.map((w) => w.year))];
  const activeYear = year ?? years[0];
  const slips = weeks.filter((w) => w.year === activeYear);
  // Pending legs haven't won or lost anyone anything yet.
  const settled = weeks.flatMap((w) => w.legs).filter((l) => l.hit !== null);
  const hits = settled.filter((l) => l.hit).length;

  const byOwner = new Map<string, OwnerRecord>();
  for (const leg of settled) {
    const row = byOwner.get(leg.ownerId) ?? {
      name: names.get(leg.ownerId) ?? leg.ownerId,
      hits: 0,
      legs: 0,
    };
    row.legs += 1;
    if (leg.hit) row.hits += 1;
    byOwner.set(leg.ownerId, row);
  }
  const owners = [...byOwner.values()].sort(
    (a, b) => pct(b.hits, b.legs) - pct(a.hits, a.legs) || b.hits - a.hits,
  );

  // Some weeks were short a leg, so the best week keeps its own leg count.
  const scored = weeks.map((w) => ({
    ...w,
    hits: w.legs.filter((l) => l.hit).length,
  }));
  const top = Math.max(...scored.map((w) => w.hits));
  // Weeks are newest first, so a tie shows the most recent best week.
  const bestWeeks = scored.filter((w) => w.hits === top);
  const best = bestWeeks[0];

  // The latest season on its own, to compare against the all-time rate.
  const thisSeason = settled.filter((l) => l.year === years[0]);
  const thisSeasonHits = thisSeason.filter((l) => l.hit).length;
  const { heater, active, cold } = streaks(weeks, names);

  return (
    <Page
      title={title}
      kicker={kicker}
      subtitle="Everyone picks one leg. One miss sinks the whole slip."
    >
      {weeks.length === 0 ? (
        <Notice>No slips on the books yet.</Notice>
      ) : (
        <>
          <StatCards
            className="mb-4 justify-between"
            stats={[
              tile("Weeks", weeks.length, `Since ${years.at(-1)}`),
              tile(
                `${years[0]} hit %`,
                `${Math.round(pct(thisSeasonHits, thisSeason.length) * 100)}%`,
                `${thisSeasonHits} of ${thisSeason.length}`,
              ),
              tile(
                "Legs hit",
                `${Math.round(pct(hits, settled.length) * 100)}%`,
                `${hits} of ${settled.length}`,
              ),
              tile(
                "Best week",
                `${best.hits}/${best.legs.length}`,
                bestWeeks.length > 1
                  ? `${bestWeeks.length} times`
                  : `Wk ${best.week}, ${best.year}`,
              ),
              tile("Longest heater", heater.n, ownersCaption(heater.who)),
              tile("Active heater", active.n, ownersCaption(active.who)),
              tile("Ice cold", cold.n, ownersCaption(cold.who)),
            ]}
          />

          <Table data={owners} columns={COLUMNS} />

          <section className="mt-14">
            {/* One row at every width; the subtitle wraps instead of the picker. */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2 className="wood-type text-3xl sm:text-5xl uppercase text-nowrap!">
                  The Slips
                </h2>
                <p className="mt-3 max-w-2xl text-base-content/70">
                  Week by week, newest first.
                </p>
              </div>
              <Stepper
                label="Season"
                value={activeYear}
                min={years.at(-1)!}
                max={years[0]}
                onChange={setYear}
                className="text-end"
              />
            </div>
            <div className="rule-double text-base-content/40 mt-5 mb-8" />
            <div className="grid gap-6 md:grid-cols-2">
              {slips.map((w) => (
                <ParlayCard
                  key={`${w.year}-${w.week}`}
                  {...w}
                  names={names}
                  hideYear
                />
              ))}
            </div>
          </section>
        </>
      )}
    </Page>
  );
}
