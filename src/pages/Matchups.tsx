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
      <span className="figures text-xl sm:text-2xl tabular-nums">
        {team.points?.toFixed(1) ?? "0.0"}
      </span>
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
  return (
    <div className="flex items-stretch justify-center border-2 border-base-content w-fit mx-auto mb-8">
      <button
        onClick={() => onChange(Math.max(1, week - 1))}
        disabled={week === 1}
        aria-label="Previous week"
        className="label-caps px-4 text-sm border-e-2 border-base-content hover:bg-primary hover:text-primary-content disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content transition-colors"
      >
        &larr;
      </button>
      <span className="figures text-lg px-8 py-2 min-w-36 text-center">
        Week {week}
      </span>
      <button
        onClick={() => onChange(Math.min(FINAL_WEEK, week + 1))}
        disabled={week === FINAL_WEEK}
        aria-label="Next week"
        className="label-caps px-4 text-sm border-s-2 border-base-content hover:bg-primary hover:text-primary-content disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content transition-colors"
      >
        &rarr;
      </button>
    </div>
  );
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
      {week !== null && <WeekPicker week={week} onChange={setSelected} />}

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
