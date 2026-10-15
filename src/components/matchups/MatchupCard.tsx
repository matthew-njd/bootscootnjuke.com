import { useState } from "react";
import { getStarterSlots, type MappedMatchup } from "../../services/sleeper";
import { getPlayers, type Player } from "../../services/database";
import { useAsync } from "../../lib/useAsync";
import type { WeekStatus } from "../../lib/league";
import defaultAvatar from "../../assets/images/default_avatar.png";

type Slot = { id?: string; points?: number; projected?: number };
type Row = { slot: string; a: Slot; b: Slot };

function TeamSide({
  team,
  won,
  record,
  status,
  flip,
}: {
  team: MappedMatchup;
  won: boolean;
  record: string;
  status: WeekStatus;
  flip?: boolean;
}) {
  const live = status === "live";
  // A live week can start 0-0; mark the leader only once they have points.
  const marked = won && team.points > 0 && status !== "upcoming";

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 min-w-0 ${
        flip ? "flex-row-reverse text-right" : ""
      } ${status === "final" && !won ? "opacity-55" : ""}`}
    >
      <img
        src={team.avatar || defaultAvatar}
        alt=""
        className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 object-cover border-2 border-base-content"
      />
      <div className="min-w-0 grow">
        <div className="label-caps text-xs sm:text-sm truncate">
          {team.team_name || "Team"}
        </div>
        <div className="figures text-[0.65rem] text-base-content/45">
          {record}
        </div>
      </div>
      {/* Projection lines up under the score, not the marker. */}
      <div className={flip ? "text-left" : "text-right"}>
        <div
          className={`flex items-center justify-end gap-1.5 ${
            flip ? "flex-row-reverse" : ""
          }`}
        >
          <span
            className={`w-2 h-2 shrink-0 ${
              marked
                ? live
                  ? "bg-success live-dot"
                  : "bg-primary"
                : "bg-transparent"
            }`}
            aria-label={
              marked
                ? live
                  ? "Leading, week in progress"
                  : "Winner"
                : undefined
            }
          />
          <span className="figures text-lg sm:text-2xl tabular-nums">
            {team.points?.toFixed(2) ?? "0.00"}
          </span>
        </div>
        {team.projected !== null && (
          <div className="figures text-[0.65rem] text-base-content/45 tabular-nums">
            {team.projected.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}

function bench(team: MappedMatchup): Slot[] {
  const starters = new Set(team.starters ?? []);
  return (team.players ?? [])
    .filter((id) => !starters.has(id))
    .map((id) => ({
      id,
      points: team.players_points?.[id] ?? 0,
      projected: team.player_projections[id],
    }))
    .sort((x, y) => y.points - x.points);
}

// Short enough to fit the boxed slot label.
const SLOT_LABELS: Record<string, string> = {
  SUPER_FLEX: "SF",
  WRRB_FLEX: "W/R",
  REC_FLEX: "W/T",
};

function lineupRows(
  a: MappedMatchup,
  b: MappedMatchup,
  slots: string[],
): Row[] {
  const starter = (team: MappedMatchup, i: number): Slot => {
    const id = team.starters?.[i];
    return {
      id,
      points: team.starters_points?.[i],
      projected: id ? team.player_projections[id] : undefined,
    };
  };
  const starters = Math.max(a.starters?.length ?? 0, b.starters?.length ?? 0);
  const [aBench, bBench] = [bench(a), bench(b)];

  return [
    ...Array.from({ length: starters }, (_, i) => ({
      slot: SLOT_LABELS[slots[i]] ?? slots[i] ?? "",
      a: starter(a, i),
      b: starter(b, i),
    })),
    ...Array.from(
      { length: Math.max(aBench.length, bBench.length) },
      (_, i) => ({
        slot: "BN",
        a: aBench[i] ?? {},
        b: bBench[i] ?? {},
      }),
    ),
  ];
}

function shortName(player: Player) {
  if (player.position === "DEF") return player.team ?? player.name;
  const [first, ...rest] = player.name.split(" ");
  return rest.length ? `${first[0]}. ${rest.join(" ")}` : player.name;
}

type Outcome = "won" | "lost" | "even";

function PlayerCell({
  slot,
  player,
  outcome,
  max,
  flip,
}: {
  slot: Slot;
  player?: Player;
  outcome: Outcome;
  max: number;
  flip?: boolean;
}) {
  const empty = !slot.id || slot.id === "0";
  const width = Math.max(0, ((slot.points ?? 0) / max) * 100);

  return (
    <div className="min-w-0">
      <div
        className={`flex items-center gap-2 ${
          flip ? "flex-row-reverse text-right" : ""
        }`}
      >
        <div className="min-w-0 grow">
          {empty ? (
            <span className="text-base-content/35">Empty</span>
          ) : player ? (
            <>
              <div className="truncate">
                <span className="sm:hidden">{shortName(player)}</span>
                <span className="hidden sm:inline">{player.name}</span>
              </div>
              <div className="truncate text-[0.65rem] text-base-content/45">
                {player.position}
                {player.team && player.position !== "DEF"
                  ? ` · ${player.team}`
                  : ""}
              </div>
            </>
          ) : (
            <span className="text-base-content/35">—</span>
          )}
        </div>
        {!empty && (
          <div className={`shrink-0 ${flip ? "text-left" : "text-right"}`}>
            <div
              className={`figures tabular-nums ${
                outcome === "won"
                  ? "text-primary font-bold"
                  : outcome === "lost"
                    ? "text-base-content/45"
                    : ""
              }`}
            >
              {(slot.points ?? 0).toFixed(2)}
            </div>
            {slot.projected !== undefined && (
              <div className="figures tabular-nums text-[0.65rem] text-base-content/45">
                {slot.projected.toFixed(2)}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Bar grows outward from the center column. */}
      <div
        className={`h-1 mt-1 transition-[width] ${flip ? "" : "ml-auto"} ${
          outcome === "won" ? "bg-primary" : "bg-base-content/20"
        }`}
        style={{ width: `${Math.min(100, width)}%` }}
      />
    </div>
  );
}

function outcomes(row: Row): [Outcome, Outcome] {
  const [x, y] = [row.a.points ?? 0, row.b.points ?? 0];
  if (row.slot === "BN" || x === y) return ["even", "even"];
  return x > y ? ["won", "lost"] : ["lost", "won"];
}

const benchTotal = (rows: Row[], side: "a" | "b") =>
  rows
    .filter((r) => r.slot === "BN")
    .reduce((sum, r) => sum + (r[side].points ?? 0), 0);

function Lineups({ a, b }: { a: MappedMatchup; b: MappedMatchup }) {
  const { data, failed } = useAsync(
    () =>
      Promise.all([
        getPlayers([...(a.players ?? []), ...(b.players ?? [])]),
        getStarterSlots(),
      ]),
    [],
  );

  if (failed) {
    return (
      <p className="px-4 py-3 text-sm text-base-content/60">
        Couldn't load lineups.
      </p>
    );
  }
  if (!data) {
    return (
      <p className="px-4 py-3 text-sm text-base-content/60">Loading lineups…</p>
    );
  }

  const [players, slots] = data;
  const rows = lineupRows(a, b, slots);
  const firstBench = rows.findIndex((r) => r.slot === "BN");
  // One scale for the whole card so bars compare across rows.
  const max = Math.max(
    1,
    ...rows.flatMap((r) => [r.a.points ?? 0, r.b.points ?? 0]),
  );
  const grid = "grid grid-cols-[1fr_3rem_1fr] items-center gap-2 px-2 sm:px-4";

  return (
    <div className="text-xs sm:text-sm">
      {rows.map((row, i) => {
        const [aOutcome, bOutcome] = outcomes(row);
        const benchRow = row.slot === "BN";

        return (
          <div key={i}>
            {i === firstBench && (
              <div className="label-caps text-[0.65rem] text-center bg-base-content text-base-100 py-1 my-2">
                Bench
              </div>
            )}
            <div
              className={`${grid} py-2 ${i % 2 ? "bg-base-content/5" : ""} ${
                benchRow ? "text-base-content/70" : ""
              }`}
            >
              <PlayerCell
                slot={row.a}
                player={players.get(row.a.id ?? "")}
                outcome={aOutcome}
                max={max}
              />
              {benchRow ? (
                <span />
              ) : (
                <span className="label-caps text-[0.6rem] text-center border-2 border-base-content py-0.5">
                  {row.slot}
                </span>
              )}
              <PlayerCell
                slot={row.b}
                player={players.get(row.b.id ?? "")}
                outcome={bOutcome}
                max={max}
                flip
              />
            </div>
          </div>
        );
      })}
      {firstBench !== -1 && (
        <div
          className={`${grid} py-2 mt-1 border-t-2 border-base-content label-caps text-[0.65rem]`}
        >
          <span className="figures text-sm text-right">
            {benchTotal(rows, "a").toFixed(2)}
          </span>
          <span className="text-center leading-tight text-base-content/60">
            Left on bench
          </span>
          <span className="figures text-sm">
            {benchTotal(rows, "b").toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}

export default function MatchupCard({
  a,
  b,
  records,
  status,
}: {
  a: MappedMatchup;
  b: MappedMatchup;
  records?: Map<number, string>;
  status: WeekStatus;
}) {
  // Mount the lineup on first open, then keep it so re-opening doesn't refetch.
  const [opened, setOpened] = useState(false);

  return (
    <details
      className="group border-2 border-base-content bg-base-100"
      onToggle={(e) => e.currentTarget.open && setOpened(true)}
    >
      <summary className="grid grid-cols-[1fr_auto_1fr] items-center cursor-pointer list-none [&::-webkit-details-marker]:hidden hover:bg-base-content/5">
        <TeamSide
          team={a}
          won={a.points >= b.points}
          record={records?.get(a.roster_id) ?? "0-0"}
          status={status}
        />
        <span aria-hidden className="flex flex-col items-center gap-1">
          <span className="wood-type text-base sm:text-xl text-primary">
            vs
          </span>
          <span className="text-[0.6rem] leading-none text-base-content/45 transition-transform group-open:rotate-180">
            ▼
          </span>
        </span>
        <TeamSide
          team={b}
          won={b.points > a.points}
          record={records?.get(b.roster_id) ?? "0-0"}
          status={status}
          flip
        />
      </summary>
      <div className="border-t border-base-content/15 pb-2">
        {opened && <Lineups a={a} b={b} />}
      </div>
    </details>
  );
}
