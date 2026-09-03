import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getNflWeek,
  getStandings,
  getMappedMatchups,
  type Standing,
  type MappedMatchup,
} from "../services/sleeper";
import Recap from "../components/common/Recap";
import defaultAvatar from "../assets/images/default_avatar.png";
import { seasonHeadline, seasonPhase } from "../lib/league";

type Pair = [MappedMatchup, MappedMatchup];

function pairUp(teams: MappedMatchup[]): Pair[] {
  const byId = new Map<number, MappedMatchup[]>();
  for (const team of teams) {
    byId.set(team.matchup_id, [...(byId.get(team.matchup_id) ?? []), team]);
  }
  return [...byId.values()].filter((g): g is Pair => g.length === 2);
}

function ScoreRow({ team, won }: { team: MappedMatchup; won: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 ${
        won ? "" : "opacity-55"
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
      <span className="figures text-xl tabular-nums">
        {team.points?.toFixed(1) ?? "0.0"}
      </span>
      <span
        className={`w-2 h-2 ${won ? "bg-warning" : "bg-transparent"}`}
        aria-label={won ? "Leading" : undefined}
      />
    </div>
  );
}

function Scoreboard({ pairs, week }: { pairs: Pair[]; week: number }) {
  return (
    <div className="border-2 border-base-content bg-neutral text-neutral-content">
      <div className="flex items-baseline justify-between gap-2 px-3 sm:px-4 py-2 bg-primary text-primary-content border-b-2 border-base-content">
        <h2 className="label-caps text-xs sm:text-sm truncate min-w-0">
          Around the League
        </h2>
        <span className="figures text-sm shrink-0">Week {week}</span>
      </div>

      {pairs.length === 0 ? (
        <p className="p-6 text-center text-sm text-neutral-content/60">
          No games on the board yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-content/15">
          {pairs.map(([a, b]) => (
            <li key={a.matchup_id} className="py-1">
              <ScoreRow team={a} won={a.points >= b.points} />
              <ScoreRow team={b} won={b.points > a.points} />
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/matchups"
        className="label-caps block px-4 py-3 text-xs text-center border-t-2 border-base-content bg-base-content/20 hover:bg-primary hover:text-primary-content transition-colors"
      >
        All matchups &rarr;
      </Link>
    </div>
  );
}

function Standings({ standings }: { standings: Standing[] }) {
  return (
    <div className="border-2 border-base-content bg-base-100">
      <div className="flex items-baseline justify-between gap-2 px-3 sm:px-4 py-2 bg-secondary text-secondary-content border-b-2 border-base-content">
        <h2 className="label-caps text-xs sm:text-sm truncate min-w-0">
          Current Rankings
        </h2>
        <span className="label-caps text-[0.6rem] opacity-70 shrink-0">
          W-L &middot; PF
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
            <span className="figures text-sm tabular-nums">
              {team.wins}-{team.losses}
              {team.ties ? `-${team.ties}` : ""}
            </span>
            <span className="figures text-xs tabular-nums text-base-content/55 w-14 text-end">
              {team.points.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>

      <Link
        to="/leaderboards"
        className="label-caps block px-4 py-3 text-xs text-center border-t-2 border-base-content hover:bg-secondary hover:text-secondary-content transition-colors"
      >
        Leaderboards &rarr;
      </Link>
    </div>
  );
}

export default function Home() {
  const phase = seasonPhase();
  const [week, setWeek] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    let stale = false;

    Promise.all([getNflWeek(), getStandings()])
      .then(async ([currentWeek, table]) => {
        if (stale) return;
        setWeek(currentWeek);
        setStandings(table);
        const matchups = await getMappedMatchups(currentWeek);
        if (!stale) setPairs(pairUp(matchups));
      })
      .catch((err) => console.error("Error loading home page:", err));

    return () => {
      stale = true;
    };
  }, []);

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
            Every owner, every draft, every collapse. Ten seasons of receipts,
            kept in one place.
          </p>
        </div>
      </section>

      {/* Scoreboard hero */}
      <section className="mx-auto max-w-6xl px-6 -mt-8 relative z-10 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Scoreboard pairs={pairs} week={week ?? 1} />
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
