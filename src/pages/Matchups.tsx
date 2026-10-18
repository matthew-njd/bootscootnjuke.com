import { useState } from "react";
import {
  getMappedMatchups,
  getNflWeek,
  getRecordsThroughWeek,
  getWeekStatus,
  type MappedMatchup,
} from "../services/sleeper";
import { groupByMatchup } from "../lib/records";
import { useAsync } from "../lib/useAsync";
import Recap from "../components/common/Recap";
import MatchupCard from "../components/matchups/MatchupCard";
import StatCards from "../components/common/StatCards";
import Page, { Notice } from "../components/layout/Page";

const FINAL_WEEK = 17;

function WeekPicker({
  week,
  onChange,
}: {
  week: number;
  onChange: (week: number) => void;
}) {
  // Triangles match the table's sort glyphs; arrows mean "navigate" elsewhere.
  const arrow =
    "figures text-lg leading-none px-2 py-1 text-base-content/45 hover:text-primary disabled:opacity-25 disabled:hover:text-base-content/45 transition-colors";

  return (
    <div className="shrink-0 basis-full lg:basis-auto text-center lg:text-start">
      <p className="label-caps text-xs text-base-content/80">Week</p>
      <div className="flex items-center justify-center lg:justify-start gap-1">
        <button
          onClick={() => onChange(Math.max(1, week - 1))}
          disabled={week === 1}
          aria-label="Previous week"
          className={arrow}
        >
          ◀
        </button>
        <span className="figures text-3xl w-10 text-center">{week}</span>
        <button
          onClick={() => onChange(Math.min(FINAL_WEEK, week + 1))}
          disabled={week === FINAL_WEEK}
          aria-label="Next week"
          className={arrow}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

function weekStats(pairs: [MappedMatchup, MappedMatchup][]) {
  const teams = pairs.flat();
  const points = teams.map((t) => t.points ?? 0);

  const tile = (label: string, value: string, caption: string) => ({
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

  if (teams.length === 0 || points.every((p) => p === 0)) {
    return ["Highest", "Lowest", "Median"].map((label) =>
      tile(label, "—", "Points"),
    );
  }

  const sorted = [...points].sort((a, b) => a - b);
  const mid = sorted.length / 2;
  const median =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[Math.floor(mid)];

  const best = teams.reduce((a, b) =>
    (b.points ?? 0) > (a.points ?? 0) ? b : a,
  );
  const worst = teams.reduce((a, b) =>
    (b.points ?? 0) < (a.points ?? 0) ? b : a,
  );

  const scorer = (label: string, team: MappedMatchup) =>
    tile(label, (team.points ?? 0).toFixed(2), team.team_name || "Team");

  return [
    scorer("Highest", best),
    scorer("Lowest", worst),
    tile("Median", median.toFixed(2), "Points"),
  ];
}

async function loadWeek(week: number, currentWeek: number | null) {
  const status = await getWeekStatus(week, currentWeek);

  // Only a final week counts toward records, so others stop a week short.
  const [matchups, records] = await Promise.all([
    getMappedMatchups(week, status === "live"),
    getRecordsThroughWeek(status === "final" ? week : week - 1),
  ]);

  return { pairs: groupByMatchup(matchups), records, status };
}

export default function Matchups() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: currentWeek, failed: weekFailed } = useAsync(getNflWeek, []);

  const week = selected ?? currentWeek ?? (weekFailed ? 1 : null);

  const { data, loading: boardLoading } = useAsync(
    () => (week === null ? Promise.resolve(null) : loadWeek(week, currentWeek)),
    [week, currentWeek],
  );

  const loading = week === null || boardLoading;
  const pairs = data?.pairs ?? [];
  const status = data?.status ?? "upcoming";
  const records = data?.records;

  return (
    <Page
      title="Matchups"
      kicker="Week by Week"
      subtitle="Every head-to-head of the season, with scores and full lineups."
    >
      {week !== null && (
        <div className="flex flex-wrap items-start justify-center lg:justify-between gap-6 mb-4">
          <WeekPicker week={week} onChange={setSelected} />
          {!loading && (
            <StatCards
              stats={weekStats(pairs)}
              className="grow justify-center lg:justify-end"
            />
          )}
        </div>
      )}

      {loading ? (
        <Notice>Loading matchups…</Notice>
      ) : pairs.length === 0 ? (
        <Notice>No matchups on the board for this week.</Notice>
      ) : (
        <div className="grid gap-4">
          {pairs.map(([a, b]) => (
            <MatchupCard
              key={a.matchup_id}
              a={a}
              b={b}
              records={records}
              status={status}
            />
          ))}
        </div>
      )}

      {week !== null && (
        <div className="mt-14 flex justify-center">
          <Recap week={week} />
        </div>
      )}
    </Page>
  );
}
