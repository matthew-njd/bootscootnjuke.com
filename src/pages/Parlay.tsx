import { useAsync } from "../lib/useAsync";
import { loadParlay } from "../lib/parlay";
import Page, { Notice, LoadFailed } from "../components/layout/Page";
import ParlayCard from "../components/common/ParlayCard";
import StatCards from "../components/common/StatCards";
import Table, { type Column } from "../components/common/Table";

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

function Heading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <h2 className="wood-type text-3xl sm:text-5xl uppercase">{title}</h2>
      <p className="mt-3 max-w-2xl text-base-content/70">{subtitle}</p>
      <div className="rule-double text-base-content/40 mt-5 mb-8" />
    </>
  );
}

export default function Parlay() {
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

  const { weeks, names } = data;
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

  const weekHits = weeks.map((w) => w.legs.filter((l) => l.hit).length);
  const cashed = weeks.filter(
    (w) => w.legs.length >= 10 && w.legs.every((l) => l.hit),
  ).length;

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
            stats={[
              { label: "Weeks", value: weeks.length },
              { label: "Slips cashed", value: cashed },
              {
                label: "Legs hit",
                value: `${Math.round(pct(hits, settled.length) * 100)}%`,
              },
              { label: "Best week", value: `${Math.max(...weekHits)}/10` },
            ]}
          />

          <section className="mt-14">
            <Heading
              title="Who Can Pick"
              subtitle="Every owner's settled legs, all time."
            />
            <Table data={owners} columns={COLUMNS} />
          </section>

          <section className="mt-14">
            <Heading title="The Slips" subtitle="Week by week, newest first." />
            <div className="grid gap-6 md:grid-cols-2">
              {weeks.map((w) => (
                <ParlayCard key={`${w.year}-${w.week}`} {...w} names={names} />
              ))}
            </div>
          </section>
        </>
      )}
    </Page>
  );
}
