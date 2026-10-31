import { useState } from "react";
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

// The all-time longest run of hits, and the longest run of misses still going.
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
  const currentMisses = (hits: boolean[]) => {
    const lastHit = hits.lastIndexOf(true);
    return hits.length - 1 - lastHit;
  };

  // Ties share the tile rather than one owner getting it by list order.
  const leader = (score: (hits: boolean[]) => number) => {
    const scored = [...results].map(([id, hits]) => ({ id, n: score(hits) }));
    const top = Math.max(0, ...scored.map((s) => s.n));
    const who = scored
      .filter((s) => s.n === top)
      .map((s) => names.get(s.id) ?? s.id);
    return { n: top, who: top ? who.join(" & ") : "Nobody" };
  };

  return { heater: leader(longestHits), cold: leader(currentMisses) };
}

// A stat with the owner it belongs to underneath, like the Matchups tiles.
const tile = (label: string, value: number, caption: string) => ({
  label,
  value: (
    <>
      {value}
      <span className="block label-caps text-[0.65rem] text-base-content/45 truncate max-w-40">
        {caption}
      </span>
    </>
  ),
});

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
  const best = weeks
    .map((w) => ({
      hits: w.legs.filter((l) => l.hit).length,
      legs: w.legs.length,
    }))
    .sort((a, b) => b.hits - a.hits)[0];
  const cashed = weeks.filter(
    (w) => w.legs.length >= 10 && w.legs.every((l) => l.hit),
  ).length;
  const { heater, cold } = streaks(weeks, names);

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
          <div className="flex flex-wrap items-start justify-center lg:justify-between gap-6 mb-4">
            <StatCards
              className="justify-center"
              stats={[
                tile("Longest heater", heater.n, heater.who),
                tile("Ice cold", cold.n, cold.who),
              ]}
            />
            <StatCards
              className="grow justify-center lg:justify-end"
              stats={[
                { label: "Weeks", value: weeks.length },
                { label: "Slips cashed", value: cashed },
                {
                  label: "Legs hit",
                  value: `${Math.round(pct(hits, settled.length) * 100)}%`,
                },
                { label: "Best week", value: `${best.hits}/${best.legs}` },
              ]}
            />
          </div>

          <Table data={owners} columns={COLUMNS} />

          <section className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="wood-type text-3xl sm:text-5xl uppercase">
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
