import { Link } from "react-router-dom";
import {
  SEASON,
  SEASON_NUMBER,
  SEASON_START,
  daysUntilKickoff,
  seasonPhase,
} from "../../lib/league";

const CHAMPION = {
  season: 2025,
  name: "Rudy D'Agostino",
  team: "I'm in the Bills Mafia",
  path: "/owners/rudy_dagostino/stats",
};

type Content = {
  kicker: string;
  text: string;
  link?: { to: string; text: string };
};

const championLink = { to: CHAMPION.path, text: CHAMPION.team };

function kickoffText(days: number): string {
  if (days === 0) return "Kickoff is today";
  if (days === 1) return "Kickoff is tomorrow";
  return `Kickoff in ${days} days`;
}

function bannerContent(now: Date): Content {
  switch (seasonPhase(now)) {
    case "preseason":
      return {
        kicker: `Season ${SEASON_NUMBER}`,
        text: kickoffText(daysUntilKickoff(now)),
      };

    case "postseason":
      return CHAMPION.season === SEASON
        ? {
            kicker: `${SEASON} Z10 Champion`,
            text: CHAMPION.name,
            link: championLink,
          }
        : { kicker: "Season Complete", text: "Champion to be crowned" };

    default:
      return {
        kicker: "Defending Z10 Champion",
        text: CHAMPION.name,
        link: championLink,
      };
  }
}

export default function Announcement() {
  const { kicker, text, link } = bannerContent(new Date());
  const kickoff = SEASON_START.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });

  return (
    <aside className="relative bg-primary text-primary-content border-b-2 border-base-content overflow-hidden">
      <div
        className="absolute inset-0 halftone text-base-100 pointer-events-none"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 py-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
        <span className="label-caps text-[0.65rem] border border-primary-content/50 px-2 py-0.5">
          {kicker}
        </span>
        <span className="label-caps text-xs sm:text-sm" title={kickoff}>
          {text}
        </span>
        {link && (
          <Link
            to={link.to}
            className="label-caps text-xs border-b border-primary-content/60 hover:border-primary-content"
          >
            {link.text} &rarr;
          </Link>
        )}
      </div>
    </aside>
  );
}
