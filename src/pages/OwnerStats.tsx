import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwners, getStatsByOwner } from "../services/database";
import type { Database } from "../types";
import Table from "../components/common/Table";
import defaultAvatar from "../assets/images/default_avatar.png";

type Stats = Database["public"]["Tables"]["stats"]["Row"];
type Owner = Database["public"]["Tables"]["owners"]["Row"];

export default function OwnerStats() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!ownerId) {
        setError("Owner ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [statsData, ownersData] = (await Promise.all([
          getStatsByOwner(ownerId),
          getOwners(),
        ])) as [Stats[], Owner[]];

        if (statsData) {
          setStats(statsData);
        }

        if (ownersData) {
          const currentOwner = ownersData.find(
            (o: Owner) => o.ownerId === ownerId,
          );
          setOwner(currentOwner || null);
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerId]);

  const columns = [
    { header: "Year", accessor: "year" as keyof Stats },
    { header: "Team", accessor: "team" as keyof Stats },
    { header: "Wins", accessor: "wins" as keyof Stats },
    { header: "Losses", accessor: "loses" as keyof Stats },
    {
      header: "Win %",
      accessor: (row: Stats) => {
        const wins = row.wins ?? 0;
        const losses = row.loses ?? 0;
        const total = wins + losses;
        return total > 0 ? ((wins / total) * 100).toFixed(1) + "%" : "N/A";
      },
    },
    { header: "Pts For", accessor: "ptsFor" as keyof Stats },
    { header: "Pts Against", accessor: "ptsAgst" as keyof Stats },
    { header: "Final Place", accessor: "finalPlace" as keyof Stats },
  ];

  const calculateAverages = () => {
    if (stats.length === 0) return null;

    const totals = stats.reduce(
      (acc, stat) => ({
        wins: acc.wins + (stat.wins ?? 0),
        loses: acc.loses + (stat.loses ?? 0),
        ptsFor: acc.ptsFor + (stat.ptsFor ?? 0),
        ptsAgst: acc.ptsAgst + (stat.ptsAgst ?? 0),
        finalPlace: acc.finalPlace + (stat.finalPlace ?? 0),
      }),
      { wins: 0, loses: 0, ptsFor: 0, ptsAgst: 0, finalPlace: 0 },
    );

    const count = stats.length;
    const avgWins = (totals.wins / count).toFixed(1);
    const avgLoses = (totals.loses / count).toFixed(1);
    const avgPtsFor = (totals.ptsFor / count).toFixed(1);
    const avgPtsAgst = (totals.ptsAgst / count).toFixed(1);
    const avgFinalPlace = (totals.finalPlace / count).toFixed(1);

    const totalGames = totals.wins + totals.loses;
    const winPercentage =
      totalGames > 0
        ? ((totals.wins / totalGames) * 100).toFixed(1) + "%"
        : "N/A";

    return (
      <tr className="font-bold">
        <td>Average</td>
        <td></td>
        <td>{avgWins}</td>
        <td>{avgLoses}</td>
        <td>{winPercentage}</td>
        <td>{avgPtsFor}</td>
        <td>{avgPtsAgst}</td>
        <td>{avgFinalPlace}</td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading stats...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-8">
        <Link to={"/owners"} className="btn btn-outline btn-primary mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"
            />
          </svg>
          Back to Owners
        </Link>
        <div className="text-error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Link
        to={"/owners"}
        className="btn btn-outline btn-primary mb-4 ml-8 self-start"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"
          />
        </svg>
        Back to Owners
      </Link>
      <div className="flex flex-col items-center p-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={owner?.logoUrl || defaultAvatar}
            alt={owner?.name || "Owner"}
            className={`w-24 h-24 rounded ${
              !owner?.logoUrl ? "bg-accent p-2" : ""
            }`}
          />
          <h1 className="text-4xl">Stats for {owner?.name}</h1>
        </div>

        {stats.length === 0 ? (
          <p>No stats available for this owner.</p>
        ) : (
          <Table
            data={stats}
            columns={columns}
            showIndex={false}
            className="w-full max-w-6xl"
            footer={calculateAverages()}
          />
        )}
      </div>
    </div>
  );
}
