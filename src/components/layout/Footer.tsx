import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 bg-neutral text-neutral-content">
      <div className="relative h-3 bg-primary overflow-hidden">
        <div className="absolute inset-0 yardlines opacity-50" aria-hidden />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-8 sm:grid-cols-[1fr_auto] items-center">
        <div>
          <div className="wood-type text-3xl uppercase">
            &copy; Boot Scoot n' Juke
          </div>
          <p className="mt-2 max-w-md text-sm text-neutral-content/70">
            A fantasy football league where friendships are tested.
          </p>
        </div>

        <nav className="label-caps flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0 })}
            className="hover:text-primary"
          >
            Home
          </Link>
          <Link to="/owners" className="hover:text-primary">
            Owners
          </Link>
          <Link to="/leaderboards" className="hover:text-primary">
            Leaderboards
          </Link>
          <Link to="/matchups" className="hover:text-primary">
            Matchups
          </Link>
          <Link to="/drafts" className="hover:text-primary">
            Drafts
          </Link>
        </nav>
      </div>
    </footer>
  );
}
