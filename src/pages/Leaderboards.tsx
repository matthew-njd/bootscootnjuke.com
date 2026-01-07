import { useState, useEffect } from "react";
import {
  getChampionshipWinners,
  getHighestWeekTotals,
  getHighestPlayerTotals,
  getHighestSeasonTotals,
} from "../services/database";
import Podium from "../components/common/Podium";
import type {
  Champion,
  HighestWeekTotal,
  HighestPlayerTotal,
  HighestSeasonalTotal,
} from "../types";

export default function Leaderboards() {
  const [champs, setChamps] = useState<Champion[]>([]);
  const [highestWeekTotal, setHighestWeekTotal] = useState<HighestWeekTotal[]>(
    [],
  );
  const [highestPlayerTotal, setHighestPlayerTotal] = useState<
    HighestPlayerTotal[]
  >([]);
  const [highestSeasonTotal, setHighestSeasonTotal] = useState<
    HighestSeasonalTotal[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [champsData, hwtData, hptData, hstData] = (await Promise.all([
          getChampionshipWinners(),
          getHighestWeekTotals(),
          getHighestPlayerTotals(),
          getHighestSeasonTotals(),
        ])) as [
          Champion[],
          HighestWeekTotal[],
          HighestPlayerTotal[],
          HighestSeasonalTotal[],
        ];

        if (champsData) {
          setChamps(champsData);
        }

        if (hwtData) {
          setHighestWeekTotal(hwtData);
        }

        if (hptData) {
          setHighestPlayerTotal(hptData);
        }

        if (hstData) {
          setHighestSeasonTotal(hstData);
        }
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

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
        <h1 className="text-6xl">Leaderboards</h1>
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

      <div className="mt-24">
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
      </div>

      <div className="mt-24">
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

      <div className="mt-24">
        <Podium
          title={<h1>Highest Player Total</h1>}
          firstPlace={{
            name: `${highestPlayerTotal[0].points || 0}, ${highestPlayerTotal[0].player || "TBD"}`,
            stat: `Team: ${highestPlayerTotal[0].team || "TBD"}, Owner: ${highestPlayerTotal[0].owner || "TBD"}, Year: ${highestPlayerTotal[0].year || 0}`,
          }}
          secondPlace={{
            name: `${highestPlayerTotal[1].points || 0}, ${highestPlayerTotal[1].player || "TBD"}`,
            stat: `Team: ${highestPlayerTotal[1].team || "TBD"}, Owner: ${highestPlayerTotal[1].owner || "TBD"}, Year: ${highestPlayerTotal[1].year || 0}`,
          }}
          thirdPlace={{
            name: `${highestPlayerTotal[2].points || 0}, ${highestPlayerTotal[2].player || "TBD"}`,
            stat: `Team: ${highestPlayerTotal[2].team || "TBD"}, Owner: ${highestPlayerTotal[2].owner || "TBD"}, Year: ${highestPlayerTotal[2].year || 0}`,
          }}
          seeMoreButton={<button>See More</button>}
        />
      </div>

      <div className="mt-24">
        <Podium
          title={<h1>Highest Season Total</h1>}
          firstPlace={{
            name: `${highestSeasonTotal[0].points || 0}`,
            stat: `Team: ${highestSeasonTotal[0].team || "TBD"}, Owner: ${highestSeasonTotal[0].owner || "TBD"}, Year: ${highestSeasonTotal[0].year || 0}`,
          }}
          secondPlace={{
            name: `${highestSeasonTotal[1].points || 0}`,
            stat: `Team: ${highestSeasonTotal[1].team || "TBD"}, Owner: ${highestSeasonTotal[1].owner || "TBD"}, Year: ${highestSeasonTotal[1].year || 0}`,
          }}
          thirdPlace={{
            name: `${highestSeasonTotal[2].points || 0}`,
            stat: `Team: ${highestSeasonTotal[2].team || "TBD"}, Owner: ${highestSeasonTotal[2].owner || "TBD"}, Year: ${highestSeasonTotal[2].year || 0}`,
          }}
          seeMoreButton={<button>See More</button>}
        />
      </div>
    </div>
  );
}
