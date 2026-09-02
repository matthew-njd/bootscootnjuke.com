import { useEffect, useState } from "react";
import { getMappedMatchups, type MappedMatchup } from "../services/sleeper";
import Card from "../components/common/Card";
import Recap from "../components/common/Recap";
import defaultAvatar from "../assets/images/default_avatar.png";

type GroupedMatchup = {
  matchup_id: number;
  teams: [MappedMatchup, MappedMatchup];
};

const WHISTLE_PATH =
  "m19.05 21.6l-2.925-2.9l-1.5 1.5q-.275.275-.7.275t-.7-.275q-.575-.575-.575-1.425t.575-1.425l4.225-4.225q.575-.575 1.425-.575t1.425.575q.275.275.275.7t-.275.7l-1.5 1.5l2.9 2.925q.3.3.3.7t-.3.7l-1.25 1.25q-.3.3-.7.3t-.7-.3M21.7 6.2L10.65 17.25l.125.1q.575.575.575 1.425t-.575 1.425q-.275.275-.7.275t-.7-.275l-1.5-1.5l-2.925 2.9q-.3.3-.7.3t-.7-.3L2.3 20.35q-.3-.3-.3-.7t.3-.7l2.9-2.925l-1.5-1.5q-.275-.275-.275-.7t.275-.7q.575-.575 1.425-.575t1.425.575l.1.125L17.425 2.475q.275-.275.638-.425t.762-.15H21q.425 0 .713.288T22 2.9v2.575q0 .2-.075.388T21.7 6.2M6.225 10.125l-3.65-3.65Q2.3 6.2 2.15 5.838T2 5.075V2.9q0-.425.288-.712T3 1.9h2.175q.4 0 .763.15t.637.425l3.65 3.65q.3.3.3.713t-.3.712L7.65 10.125q-.3.3-.712.3t-.713-.3";

function Heading({ className = "" }: { className?: string }) {
  return (
    <div className="flex gap-2">
      <h1 className={`text-6xl ${className}`}>Matchups</h1>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4em"
        height="4em"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d={WHISTLE_PATH} />
      </svg>
    </div>
  );
}

function TeamCard({ team }: { team: MappedMatchup }) {
  return (
    <Card
      title={
        <div className="flex items-center gap-3">
          <img
            src={team.avatar || defaultAvatar}
            alt={`${team.team_name} avatar`}
            className="w-14 h-14 rounded border object-cover"
          />
          <span>{team.team_name || "Team"}</span>
        </div>
      }
      body={
        <div className="text-center">
          <p className="text-4xl font-bold">{team.points}</p>
          <p className="text-sm">points</p>
        </div>
      }
      className="card bg-primary text-neutral flex-1 max-w-md"
    />
  );
}

function groupIntoPairs(teams: MappedMatchup[]): GroupedMatchup[] {
  const byMatchup = new Map<number, MappedMatchup[]>();
  for (const team of teams) {
    const group = byMatchup.get(team.matchup_id) ?? [];
    group.push(team);
    byMatchup.set(team.matchup_id, group);
  }

  return [...byMatchup.entries()]
    .filter(([, group]) => group.length === 2)
    .map(([matchup_id, group]) => ({
      matchup_id,
      teams: group as [MappedMatchup, MappedMatchup],
    }));
}

export default function Matchups() {
  const [week, setWeek] = useState<number>(1);
  const [loaded, setLoaded] = useState<{
    week: number;
    matchups: GroupedMatchup[];
  } | null>(null);

  const loading = loaded?.week !== week;

  useEffect(() => {
    let stale = false;

    getMappedMatchups(week)
      .then((data) => {
        if (!stale) setLoaded({ week, matchups: groupIntoPairs(data) });
      })
      .catch((err) => {
        console.error("Error fetching matchups:", err);
        if (!stale) setLoaded({ week, matchups: [] });
      });

    return () => {
      stale = true;
    };
  }, [week]);

  if (loading) {
    return (
      <div className="flex flex-col items-center">
        <Heading className="mb-6" />
        <p className="text-xl">Loading matchups...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-8">
        <Heading />
      </div>

      <div className="w-full max-w-6xl space-y-6 mt-12">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setWeek((prev) => Math.max(1, prev - 1))}
            disabled={week === 1}
            className="btn btn-rounded btn-outline"
            aria-label="Previous week"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m7.825 13l5.6 5.6L12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2z"
              />
            </svg>
          </button>

          <div className="text-2xl font-bold min-w-35 text-center">
            Week {week}
          </div>

          <button
            onClick={() => setWeek((prev) => Math.min(17, prev + 1))}
            disabled={week === 17}
            className="btn btn-rounded btn-outline"
            aria-label="Next week"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M16.175 13H4v-2h12.175l-5.6-5.6L12 4l8 8l-8 8l-1.425-1.4z"
              />
            </svg>
          </button>
        </div>

        {loaded.matchups.map((matchup) => (
          <div
            key={matchup.matchup_id}
            className="flex items-center justify-center gap-4"
          >
            <TeamCard team={matchup.teams[0]} />

            {/* VS Divider */}
            <div className="text-3xl font-bold px-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 4L6 20M3 4l4 8l4-8m8 9.5V13a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-.5"
                />
              </svg>
            </div>

            <TeamCard team={matchup.teams[1]} />
          </div>
        ))}

        <div className="flex justify-center pt-6">
          <Recap week={week} />
        </div>
      </div>
    </div>
  );
}
