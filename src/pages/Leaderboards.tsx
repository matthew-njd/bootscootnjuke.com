import { useState, useEffect } from "react";
import { getChampionshipWinners, getHighestWeekTotals } from "../services/database";
import Podium from "../components/common/Podium";
import type { Champion, HighestWeekTotal } from '../types';

export default function Leaderboards() {
  const [champs, setChamps] = useState<Champion[]>([]);
  const [highestWeekTotal, setHighestWeekTotal] = useState<HighestWeekTotal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [champsData, hwtData] = (await Promise.all([
          getChampionshipWinners(),
          getHighestWeekTotals(),
        ])) as [Champion[], HighestWeekTotal[]];

        if (champsData) {
          setChamps(champsData);
        }

        if (hwtData) {
          setHighestWeekTotal(hwtData);
        }

      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
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
          name: champs[0]?.name || "TBD",
          stat: `${champs[0]?.titlewins || 0} titles`,
        }}
        secondPlace={{
          name: champs[1]?.name || "TBD",
          stat: `${champs[1]?.titlewins || 0} titles`,
        }}
        thirdPlace={{
          name: champs[2]?.name || "TBD",
          stat: `${champs[2]?.titlewins || 0} titles`,
        }}
        seeMoreButton={<button>See More</button>}
      />

      <Podium
        title={<h1>Highest Weekly Total</h1>}
        firstPlace={{
          name: highestWeekTotal[0].points || 0,
          stat: `Team: ${highestWeekTotal[0].team || "TBD"}, Owner: ${highestWeekTotal[0].owner || "TBD"}, Year: ${highestWeekTotal[0].year || 0}, Week: ${highestWeekTotal[0].week || 0}`,
        }}
        secondPlace={{
          name: highestWeekTotal[1].points || 0,
          stat: `Team: ${highestWeekTotal[1].team || "TBD"}, Owner: ${highestWeekTotal[1].owner || "TBD"}, Year: ${highestWeekTotal[1].year || 0}, Week: ${highestWeekTotal[1].week || 0}`,
        }}
        thirdPlace={{
          name: highestWeekTotal[2].points || 0,
          stat: `Team: ${highestWeekTotal[2].team || "TBD"}, Owner: ${highestWeekTotal[2].owner || "TBD"}, Year: ${highestWeekTotal[2].year || 0}, Week: ${highestWeekTotal[2].week || 0}`,
        }}
        seeMoreButton={<button>See More</button>}
      />
    </div>

    
  );
}
