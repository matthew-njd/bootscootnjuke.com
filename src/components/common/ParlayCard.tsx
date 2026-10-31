import { Link } from "react-router-dom";
import type { ParlayLeg } from "../../services/database";

const MARKS = {
  hit: {
    icon: "H",
    label: "Hit",
    className: "bg-success text-success-content",
  },
  miss: {
    icon: "M",
    label: "Missed",
    className: "bg-error text-error-content",
  },
  pending: {
    icon: "–",
    label: "Pending",
    className: "border border-base-content/30 text-base-content/50",
  },
};

const mark = (hit: boolean | null) =>
  MARKS[hit === null ? "pending" : hit ? "hit" : "miss"];

// One miss busts the slip; it only cashes once every leg is in and hit.
function status(legs: ParlayLeg[]) {
  if (legs.some((l) => l.hit === false)) return "Busted";
  if (legs.length >= 10 && legs.every((l) => l.hit)) return "Cashed";
  return "Live";
}

export default function ParlayCard({
  year,
  week,
  legs,
  names,
  payout,
  link,
  wide,
  hideYear,
}: {
  year: number;
  week: number;
  legs: ParlayLeg[];
  names: Map<string, string>;
  payout?: number | null;
  link?: boolean;
  wide?: boolean;
  hideYear?: boolean;
}) {
  const hits = legs.filter((l) => l.hit).length;
  const state = status(legs);

  return (
    <div className="border-2 border-base-content bg-base-100 flex flex-col">
      <div className="flex items-baseline justify-between gap-2 px-3 sm:px-4 py-2 bg-warning text-warning-content border-b-2 border-base-content">
        <h2 className="label-caps text-xs sm:text-sm truncate min-w-0">
          {!hideYear && <>{year} &middot; </>}Week {week} Parlay
        </h2>
        <span className="flex items-baseline gap-2 shrink-0">
          <span
            className={`label-caps text-[0.6rem] ${
              // Gold on gold would vanish, so a cashed slip gets a dark badge.
              state === "Cashed"
                ? "bg-warning-content text-warning px-1.5 py-0.5"
                : "opacity-75"
            }`}
          >
            {state}
            {payout != null && ` · $${payout.toFixed(2)}`}
          </span>
          <span className="figures text-sm tabular-nums">
            {hits}/{legs.length}
          </span>
        </span>
      </div>

      {legs.length === 0 ? (
        <p className="p-6 text-center text-sm text-base-content/60">
          No picks in yet.
        </p>
      ) : (
        // Wide cards split into two columns; the second leg sits beside the
        // first, so it drops its divider and borders the left column instead.
        <ul
          className={`divide-y divide-base-content/15 ${
            wide
              ? "md:grid md:grid-cols-2 md:[&>li:nth-child(2)]:border-t-0 md:[&>li:nth-child(even)]:border-l md:[&>li]:border-base-content/15"
              : ""
          }`}
        >
          {legs.map((leg) => {
            const m = mark(leg.hit);
            return (
              <li
                key={leg.id}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 ${
                  leg.hit === false ? "opacity-55" : ""
                }`}
              >
                <span
                  className={`w-6 h-6 shrink-0 grid place-items-center figures text-sm ${m.className}`}
                  role="img"
                  aria-label={m.label}
                >
                  {m.icon}
                </span>
                <span className="text-sm grow min-w-0 truncate">{leg.bet}</span>
                <span className="label-caps text-[0.65rem] text-base-content/60 shrink-0">
                  {names.get(leg.ownerId) ?? leg.ownerId}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {link && (
        <Link
          to="/parlay"
          className="label-caps mt-auto block px-4 py-3 text-xs text-center border-t-2 border-base-content hover:bg-warning hover:text-warning-content transition-colors"
        >
          Parlay history &rarr;
        </Link>
      )}
    </div>
  );
}
