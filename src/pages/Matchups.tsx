import { useState } from "react";
import {
  getMappedMatchups,
  getNflWeek,
  getRecordsThroughWeek,
  type MappedMatchup,
} from "../services/sleeper";
import { groupByMatchup } from "../lib/records";
import { useAsync } from "../lib/useAsync";
import Recap from "../components/common/Recap";
import StatCards from "../components/common/StatCards";
import Page, { Notice } from "../components/layout/Page";
import defaultAvatar from "../assets/images/default_avatar.png";
import { weekInProgress } from "../lib/league";

const FINAL_WEEK = 17;

function TeamRow({
  team,
  won,
  record,
  live,
}: {
  team: MappedMatchup;
  won: boolean;
  record?: string;
  live: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 ${
        won || live ? "" : "opacity-55"
      }`}
    >
      <img
        src={team.avatar || defaultAvatar}
        alt=""
        className="w-10 h-10 object-cover border-2 border-base-content"
      />
      <div className="min-w-0 grow">
        <div className="label-caps text-sm truncate">
          {team.team_name || "Team"}
        </div>
        {record && (
          <div className="figures text-[0.65rem] text-base-content/45">
            {record}
          </div>
        )}
      </div>
      <div className="text-right">
        <div className="figures text-xl sm:text-2xl tabular-nums">
          {team.points?.toFixed(2) ?? "0.00"}
        </div>
        {team.projected !== null && (
          <div className="figures text-[0.65rem] text-base-content/45 tabular-nums">
            {team.projected.toFixed(2)}
          </div>
        )}
      </div>
      <span
        className={`w-2.5 h-2.5 ${
          won ? (live ? "bg-success live-dot" : "bg-primary") : "bg-transparent"
        }`}
        aria-label={
          won ? (live ? "Leading, week in progress" : "Winner") : undefined
        }
      />
    </div>
  );
}

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

async function loadWeek(week: number, live: boolean) {
  // A week in progress has no completed result yet, so records stop a week short.
  const [matchups, records] = await Promise.all([
    getMappedMatchups(week),
    getRecordsThroughWeek(live ? week - 1 : week),
  ]);

  return { pairs: groupByMatchup(matchups), records };
}

export default function Matchups() {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: currentWeek, failed: weekFailed } = useAsync(getNflWeek, []);

  const week = selected ?? currentWeek ?? (weekFailed ? 1 : null);
  const live = week === currentWeek && weekInProgress();

  const { data, loading: boardLoading } = useAsync(
    () => (week === null ? Promise.resolve(null) : loadWeek(week, live)),
    [week, live],
  );

  const loading = week === null || boardLoading;
  const pairs = data?.pairs ?? [];
  const records = data?.records;

  return (
    <Page
      title="Matchups"
      kicker="Week by Week"
      subtitle="Every head-to-head of the season, with the final margin."
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
        <div className="grid gap-5 md:grid-cols-2">
          {pairs.map(([a, b]) => (
            <div
              key={a.matchup_id}
              className="border-2 border-base-content bg-base-100 divide-y divide-base-content/15"
            >
              <TeamRow
                team={a}
                won={a.points >= b.points}
                record={records?.get(a.roster_id) ?? "0-0"}
                live={live}
              />
              <TeamRow
                team={b}
                won={b.points > a.points}
                record={records?.get(b.roster_id) ?? "0-0"}
                live={live}
              />
            </div>
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
