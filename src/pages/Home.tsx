import { Link } from "react-router-dom";
import {
  getNflWeek,
  getStandings,
  getMappedMatchups,
  getWeekStatus,
  type Standing,
  type MappedMatchup,
} from "../services/sleeper";
import { groupByMatchup } from "../lib/records";
import { useAsync } from "../lib/useAsync";
import Recap from "../components/common/Recap";
import defaultAvatar from "../assets/images/default_avatar.png";
import {
  SEASON_NUMBER,
  seasonHeadline,
  seasonPhase,
  type WeekStatus,
} from "../lib/league";

type Pair = [MappedMatchup, MappedMatchup];

function ScoreRow({
  team,
  won,
  status,
}: {
  team: MappedMatchup;
  won: boolean;
  status: WeekStatus;
}) {
  const live = status === "live";
  // A live week can start 0-0; mark the leader only once they have points.
  const marked = won && team.points > 0 && status !== "upcoming";

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 ${
        status === "final" && !won ? "opacity-55" : ""
      }`}
    >
      <img
        src={team.avatar || defaultAvatar}
        alt=""
        className="w-7 h-7 object-cover border border-base-100/30"
      />
      <span className="label-caps text-xs truncate grow min-w-0">
        {team.team_name}
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 shrink-0 ${
            marked
              ? live
                ? "bg-success live-dot"
                : "bg-warning"
              : "bg-transparent"
          }`}
          aria-label={
            marked ? (live ? "Leading, week in progress" : "Won") : undefined
          }
        />
        <span className="figures text-xl tabular-nums">
          {team.points?.toFixed(2) ?? "0.00"}
        </span>
        {/* A final score needs no forecast. Fixed width keeps scores aligned. */}
        {status !== "final" && (
          <span className="figures text-xs tabular-nums text-neutral-content/50 w-[5ch] text-right">
            {team.projected?.toFixed(2)}
          </span>
        )}
      </span>
    </div>
  );
}

function Scoreboard({
  pairs,
  week,
  status,
}: {
  pairs: Pair[];
  week: number;
  status: WeekStatus;
}) {
  return (
    <div className="border-2 border-base-content bg-neutral text-neutral-content flex flex-col">
      <div className="flex items-baseline justify-between gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-content border-b-2 border-base-content">
        <h2 className="label-caps text-xs sm:text-sm truncate min-w-0">
          Around the League
        </h2>
        <span className="figures text-sm shrink-0">
          Week {week}
          {status === "live" && (
            <span className="label-caps ml-2 text-[0.6rem] opacity-75">
              In progress
            </span>
          )}
        </span>
      </div>

      {pairs.length === 0 ? (
        <p className="p-6 text-center text-sm text-neutral-content/60">
          No games on the board yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-content/15">
          {pairs.map(([a, b]) => (
            <li key={a.matchup_id} className="py-1">
              <ScoreRow team={a} won={a.points >= b.points} status={status} />
              <ScoreRow team={b} won={b.points > a.points} status={status} />
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/matchups"
        className="label-caps mt-auto block px-4 py-3 text-xs text-center border-t-2 border-base-content bg-base-content/20 hover:bg-primary hover:text-primary-content transition-colors"
      >
        All matchups &rarr;
      </Link>
    </div>
  );
}

// Shared by the header labels and the row values so the columns line up.
// Widths use ch, so each slot carries the values' font size even around a label.
const STAT_GROUP = "flex items-baseline gap-2 shrink-0";
const RECORD_SLOT = "figures text-sm tabular-nums min-w-[3.5ch] text-center";
// Sized to "000.00".
const POINTS_SLOT = "figures text-xs tabular-nums w-[5.5ch]";

function Standings({ standings }: { standings: Standing[] }) {
  const label = "label-caps text-[0.6rem] opacity-70";

  return (
    <div className="border-2 border-base-content bg-base-100 flex flex-col">
      {/* Right padding matches the rows so labels sit over their columns. */}
      <div className="flex items-baseline justify-between gap-2 pl-3 sm:pl-4 pr-2 sm:pr-3 py-2 bg-secondary text-secondary-content border-b-2 border-base-content">
        <h2 className="label-caps text-xs sm:text-sm truncate min-w-0">
          Current Rankings
        </h2>
        <span className={STAT_GROUP}>
          <span className={RECORD_SLOT}>
            <span className={label}>W-L</span>
          </span>
          <span className={`${POINTS_SLOT} text-center`}>
            <span className={label}>PF</span>
          </span>
          <span className={`${POINTS_SLOT} text-center`}>
            <span className={label}>PA</span>
          </span>
        </span>
      </div>

      <ol className="divide-y divide-base-content/15">
        {standings.map((team, i) => (
          <li
            key={team.roster_id}
            className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 ${
              i < 3 ? "bg-base-200/60" : ""
            }`}
          >
            <span
              className={`figures w-5 text-end text-sm ${
                i < 3 ? "text-primary" : "text-base-content/45"
              }`}
            >
              {i + 1}
            </span>
            <img
              src={team.avatar || defaultAvatar}
              alt=""
              className="w-8 h-8 object-cover border border-base-content"
            />
            <span className="label-caps text-xs truncate grow min-w-0">
              {team.team_name}
            </span>
            <span className={STAT_GROUP}>
              <span className={RECORD_SLOT}>
                {team.wins}-{team.losses}
                {team.ties ? `-${team.ties}` : ""}
              </span>
              <span className={`${POINTS_SLOT} text-end text-base-content/55`}>
                {team.points.toFixed(2)}
              </span>
              <span className={`${POINTS_SLOT} text-end text-base-content/55`}>
                {team.pointsAgainst.toFixed(2)}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <Link
        to="/leaderboards"
        className="label-caps mt-auto block px-4 py-3 text-xs text-center border-t-2 border-base-content hover:bg-secondary hover:text-secondary-content transition-colors"
      >
        Leaderboards &rarr;
      </Link>
    </div>
  );
}

async function loadHome() {
  const [week, standings] = await Promise.all([getNflWeek(), getStandings()]);
  // Status decides whether projections use live game data.
  const status = await getWeekStatus(week, week);
  const matchups = await getMappedMatchups(week, status === "live");

  return { week, standings, pairs: groupByMatchup(matchups), status };
}

export default function Home() {
  const phase = seasonPhase();
  const { data } = useAsync(loadHome, []);

  const week = data?.week ?? null;
  const standings = data?.standings ?? [];
  const pairs = data?.pairs ?? [];

  return (
    <div>
      {/* Hero band */}
      <section className="relative bg-secondary text-secondary-content overflow-hidden border-b-2 border-base-content">
        <div className="absolute inset-0 yardlines opacity-30" aria-hidden />
        <div
          className="absolute inset-0 halftone text-base-100 pointer-events-none"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:py-20 text-center">
          <p className="label-caps text-xs text-warning">
            {seasonHeadline(phase, week)}
          </p>
          <h1 className="wood-type mt-3 text-5xl sm:text-7xl uppercase">
            The Premier
            <br />
            Fantasy Football League
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-secondary-content/85">
            {SEASON_NUMBER} seasons in. The trophy changes hands. The receipts
            don't.
          </p>
        </div>
      </section>

      {/* Scoreboard hero */}
      <section className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Scoreboard
          pairs={pairs}
          week={week ?? 1}
          status={data?.status ?? "upcoming"}
        />
        <Standings standings={standings} />
      </section>

      {/* Recap */}
      <section className="mx-auto max-w-4xl px-6 mt-14">
        <div className="rule-double text-base-content/30 mb-6" />
        <Recap />
      </section>
    </div>
  );
}
