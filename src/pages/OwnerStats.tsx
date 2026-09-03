import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwners, getStatsByOwner } from "../services/database";
import type { Database } from "../types";
import Table from "../components/common/Table";
import Page, { Notice } from "../components/layout/Page";
import defaultAvatar from "../assets/images/default_avatar.png";

type Stats = Database["public"]["Tables"]["stats"]["Row"];
type Owner = Database["public"]["Tables"]["owners"]["Row"];

const winPct = (wins: number, losses: number) =>
  wins + losses > 0 ? `${((wins / (wins + losses)) * 100).toFixed(1)}%` : "N/A";

const columns = [
  { header: "Year", accessor: "year" as keyof Stats },
  { header: "Team", accessor: "team" as keyof Stats },
  { header: "Wins", accessor: "wins" as keyof Stats },
  { header: "Losses", accessor: "loses" as keyof Stats },
  {
    header: "Win %",
    accessor: (row: Stats) => winPct(row.wins ?? 0, row.loses ?? 0),
  },
  { header: "Pts For", accessor: "ptsFor" as keyof Stats },
  { header: "Pts Against", accessor: "ptsAgst" as keyof Stats },
  { header: "Final Place", accessor: "finalPlace" as keyof Stats },
];

function averagesRow(stats: Stats[]) {
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
  const avg = (total: number) => (total / count).toFixed(1);

  return (
    <tr className="label-caps text-xs">
      <td>Average</td>
      <td></td>
      <td>{avg(totals.wins)}</td>
      <td>{avg(totals.loses)}</td>
      <td>{winPct(totals.wins, totals.loses)}</td>
      <td>{avg(totals.ptsFor)}</td>
      <td>{avg(totals.ptsAgst)}</td>
      <td>{avg(totals.finalPlace)}</td>
    </tr>
  );
}

export default function OwnerStats() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [stats, setStats] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(Boolean(ownerId));
  const [fetchError, setFetchError] = useState<string | null>(null);
  const error = ownerId ? fetchError : "Owner ID not found";

  useEffect(() => {
    if (!ownerId) return;

    Promise.all([getStatsByOwner(ownerId), getOwners()])
      .then(([statsData, ownersData]) => {
        setStats((statsData as Stats[]) ?? []);
        setOwner(ownersData?.find((o) => o.ownerId === ownerId) ?? null);
      })
      .catch((err) => {
        setFetchError("Failed to fetch data");
        console.error("Error fetching data:", err);
      })
      .finally(() => setLoading(false));
  }, [ownerId]);

  const seasons = stats.length;
  const record = stats.reduce(
    (acc, s) => ({
      wins: acc.wins + (s.wins ?? 0),
      loses: acc.loses + (s.loses ?? 0),
    }),
    { wins: 0, loses: 0 },
  );

  return (
    <Page
      title={owner?.name ?? "Owner"}
      kicker="Career Record"
      back={{ to: "/owners", label: "All owners" }}
    >
      {loading && <Notice>Loading stats…</Notice>}
      {error && <Notice>{error}</Notice>}

      {!loading && !error && (
        <>
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <img
              src={owner?.logoUrl || defaultAvatar}
              alt=""
              className="w-24 h-24 object-cover border-2 border-base-content"
            />
            <dl className="flex gap-8">
              <div>
                <dt className="label-caps text-[0.6rem] text-base-content/55">
                  Seasons
                </dt>
                <dd className="figures text-3xl">{seasons}</dd>
              </div>
              <div>
                <dt className="label-caps text-[0.6rem] text-base-content/55">
                  All-time
                </dt>
                <dd className="figures text-3xl">
                  {record.wins}&ndash;{record.loses}
                </dd>
              </div>
              <div>
                <dt className="label-caps text-[0.6rem] text-base-content/55">
                  Win %
                </dt>
                <dd className="figures text-3xl">
                  {winPct(record.wins, record.loses)}
                </dd>
              </div>
            </dl>
          </div>

          {seasons === 0 ? (
            <Notice>No stats available for this owner.</Notice>
          ) : (
            <Table
              data={stats}
              columns={columns}
              showIndex={false}
              footer={averagesRow(stats)}
            />
          )}
        </>
      )}
    </Page>
  );
}
