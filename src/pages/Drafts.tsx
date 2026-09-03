import { useEffect, useState } from "react";
import { getDraftHistory } from "../services/database";
import { getSleeperDrafts, type DraftPick } from "../services/sleeper";
import type { Database } from "../types";
import Page, { Notice } from "../components/layout/Page";
import defaultAvatar from "../assets/images/default_avatar.png";

type DraftRow = Database["public"]["Tables"]["drafts"]["Row"];

function PickCell({ pick }: { pick: DraftPick }) {
  const [name, position] = pick.player.split(/\s*\(/);

  return (
    <article className="border-2 border-base-content bg-base-100 flex flex-col text-center">
      <div className="flex items-center justify-between px-1.5 py-0.5 bg-secondary text-secondary-content border-b-2 border-base-content">
        <span className="figures text-[0.7rem]">{pick.pick}</span>
        {position && (
          <span className="label-caps text-[0.55rem] opacity-80">
            {position.replace(")", "")}
          </span>
        )}
      </div>

      <img
        src={pick.headshotUrl || defaultAvatar}
        alt=""
        onError={(e) => {
          e.currentTarget.src = defaultAvatar;
        }}
        className="w-full aspect-square object-cover object-top bg-base-200 border-b-2 border-base-content"
      />

      <div className="px-1.5 py-1.5 grow flex flex-col justify-between gap-1">
        <p className="label-caps text-[0.6rem] leading-tight">{name}</p>
        <p className="text-[0.6rem] leading-tight text-base-content/55 truncate">
          {pick.team || "—"}
        </p>
      </div>
    </article>
  );
}

function YearPicker({
  years,
  active,
  onChange,
}: {
  years: number[];
  active: number;
  onChange: (year: number) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center border-2 border-base-content w-fit mx-auto mb-8">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onChange(year)}
          aria-current={year === active ? "true" : undefined}
          className={`figures px-4 py-2 text-sm border-e-2 border-base-content last:border-e-0 transition-colors ${
            year === active
              ? "bg-primary text-primary-content"
              : "hover:bg-base-200"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default function Drafts() {
  const [drafts, setDrafts] = useState<DraftPick[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getDraftHistory(), getSleeperDrafts()])
      .then(([stored, sleeper]) => {
        const archived: DraftPick[] = ((stored ?? []) as DraftRow[])
          .filter((row) => row.year !== null)
          .map((row) => ({
            key: `db-${row.id}`,
            year: row.year as number,
            pickNo: row.pick ?? 0,
            round: Math.floor(row.pick ?? 0),
            pick: (row.pick ?? 0).toFixed(2),
            player: row.player || "Unknown player",
            team: row.team,
            owner: row.owner,
            headshotUrl: row.playerHeadshotUrl,
          }));

        setDrafts([...archived, ...sleeper]);
      })
      .catch((err) => {
        setError("Failed to fetch draft history");
        console.error("Error fetching drafts:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const years = [...new Set(drafts.map((d) => d.year))].sort((a, b) => b - a);
  const activeYear = year ?? years[0] ?? null;

  const picks = drafts
    .filter((d) => d.year === activeYear)
    .sort((a, b) => a.pickNo - b.pickNo);

  const rounds = [...new Set(picks.map((p) => p.round))].sort((a, b) => a - b);

  return (
    <Page
      title="Drafts"
      kicker="The Archive"
      subtitle="Every pick ever made, and everyone who has to live with it."
    >
      {loading && <Notice>Loading draft history…</Notice>}
      {error && <Notice>{error}</Notice>}

      {!loading && !error && years.length === 0 && (
        <Notice>No draft history recorded yet.</Notice>
      )}

      {!loading && !error && activeYear !== null && (
        <>
          <YearPicker years={years} active={activeYear} onChange={setYear} />

          <div className="flex items-baseline justify-between mb-4">
            <h2 className="wood-type text-2xl uppercase">{activeYear} Draft</h2>
            <span className="label-caps text-[0.65rem] text-base-content/55">
              {picks.length} picks &middot; {rounds.length} rounds
            </span>
          </div>

          <div className="space-y-6">
            {rounds.map((round) => (
              <section key={round}>
                <h3 className="label-caps text-[0.65rem] text-base-content/55 border-b-2 border-base-content/25 pb-1 mb-2">
                  Round {round}
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
                  {picks
                    .filter((p) => p.round === round)
                    .map((pick) => (
                      <PickCell key={pick.key} pick={pick} />
                    ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
