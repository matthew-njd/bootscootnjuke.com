import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLeaderborderById } from "../services/database";
import type { Database } from "../types";
import Table from "../components/common/Table";

type Leaderboard = Database["public"]["Tables"]["leaderboards"]["Row"];

export default function LeaderboardDetails() {
  const { leaderboardId } = useParams<{ leaderboardId: string }>();
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!leaderboardId) {
        setError("Leaderboard ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getLeaderborderById(leaderboardId);
        if (data) {
          setLeaderboard(data[0]);
        } else {
          setError("Leaderboard not found");
        }
      } catch (err) {
        setError("Failed to fetch leaderboard");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard(); // This should be OUTSIDE the async function
  }, [leaderboardId]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <h1 className="text-6xl mb-6">Leaderboard Details</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4em"
          height="4em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M2 21V9h5.5v12zm7.25 0V3h5.5v18zm7.25 0V11H22v10z"
          />
        </svg>
      </div>
    </div>
  );
}
