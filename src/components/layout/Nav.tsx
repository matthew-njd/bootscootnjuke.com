import { Link, useLocation } from "react-router-dom";
import leagueLogo from "../../assets/images/league_logo.png";
import { FOUNDED, SEASON_LABEL, SEASON_NUMBER } from "../../lib/league";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/owners", label: "Owners" },
  { to: "/leaderboards", label: "Leaderboards" },
  { to: "/matchups", label: "Matchups" },
  { to: "/drafts", label: "Drafts" },
];

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-40">
      {/* Masthead */}
      <div className="bg-base-100 border-b-2 border-base-content/80">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center gap-4">
          <Link to="/" className="shrink-0">
            <img
              src={leagueLogo}
              alt="Boot Scoot n' Juke"
              className="w-14 transition-transform hover:-rotate-3 hover:scale-105"
            />
          </Link>

          <Link to="/" className="min-w-0">
            <div className="wood-type text-2xl sm:text-3xl uppercase truncate">
              Boot Scoot n' Juke
            </div>
            <div className="label-caps text-[0.6rem] sm:text-xs text-base-content/60">
              Fantasy Football League &middot; Est. {FOUNDED}
            </div>
          </Link>

          <div className="hidden sm:block ms-auto text-end">
            <div className="label-caps text-[0.6rem] text-base-content/60">
              Season {SEASON_NUMBER}
            </div>
            <div className="figures text-lg leading-none">{SEASON_LABEL}</div>
          </div>
        </div>
      </div>

      {/* Navigation band */}
      <nav className="relative bg-secondary text-secondary-content border-b-2 border-base-content/80 overflow-hidden">
        <div className="absolute inset-0 yardlines opacity-40" aria-hidden />
        <ul className="relative mx-auto max-w-6xl px-2 sm:px-4 flex flex-wrap justify-center">
          {LINKS.map(({ to, label }) => {
            const active =
              to === "/" ? pathname === "/" : pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  onClick={
                    to === "/" ? () => window.scrollTo({ top: 0 }) : undefined
                  }
                  aria-current={active ? "page" : undefined}
                  className={`label-caps block px-3 sm:px-7 py-3 text-[0.7rem] sm:text-sm border-x border-base-100/15 transition-colors ${
                    active
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-100/15"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
