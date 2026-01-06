import { useState, useEffect } from "react";
import { getChampionshipWinners } from "../services/database";
import Podium from "../components/common/Podium";
import type { Leaderboards } from "../types";
import type { Champion } from '../types';

export default function Leaderboards() {
  const [champs, setChamps] = useState<Champion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChamps = async () => {
      try {
        setLoading(true);
        const data = await getChampionshipWinners();
        if (data) {
          setChamps(data);
          console.log("Champions fetched:", data);
        }
      } catch (error) {
        setError("Failed to fetch champions");
        console.error("Error fetching champions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChamps();
  }, []);

  if (loading) {
    return <div>Loading Leaderboards...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <h1 className="text-6xl mb-6">Leaderboards</h1>
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

      <Podium
        title={<h1>Most Z10s</h1>}
        firstPlace={{
          name: "Alice",
          stat: "1000 points",
        }}
        secondPlace={{
          name: "Bob",
          stat: "850 points",
        }}
        thirdPlace={{
          name: "Charlie",
          stat: "700 points",
        }}
        seeMoreButton={<button>See More</button>}
      />
    </div>
  );
}
