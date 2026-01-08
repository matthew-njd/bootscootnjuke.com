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
import { Link } from "react-router-dom";

export default function Leaderboards() {
  const [champs, setChamps] = useState<Champion[]>([]);
  const [highestWeekTotal, setHighestWeekTotal] = useState<HighestWeekTotal[]>(
    []
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
          HighestSeasonalTotal[]
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
            stat: (
              <div className="flex items-center">
                {champs[0]?.titlewins || 0}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256.156 21.625c-45.605 0-86.876 2.852-117.22 7.563c-15.17 2.355-27.554 5.11-36.874 8.53c-4.66 1.71-8.568 3.515-11.968 6.094c-3.238 2.457-6.65 6.36-6.97 11.75h-.75c0 10.08.362 20.022 1.064 29.813H57.53c-.12-7.952.003-15.922.376-23.875l-26.812-6.28C22.55 161.892 64.1 265.716 140.564 339.655l15.655-29.594a251 251 0 0 1-12.157-10.75a143.5 143.5 0 0 1 19.28-16.843c13.468 13.172 28.182 23.565 43.813 30.655c22.114 17.744 8.053 29.368-23.5 36.25c58.863 10.6 38.948 62.267-14.125 92.313c-2.14.27-4.256.523-6.28.812c-12.047 1.718-21.876 3.71-29.406 6.25c-3.765 1.27-6.958 2.6-9.906 4.656c-2.95 2.055-6.626 5.705-6.626 11.406s3.677 9.32 6.626 11.375c2.948 2.055 6.14 3.387 9.906 4.657c7.53 2.54 17.36 4.532 29.406 6.25c24.094 3.436 56.784 5.53 92.906 5.53s68.812-2.094 92.906-5.53c12.048-1.718 21.877-3.71 29.407-6.25c3.764-1.27 6.957-2.602 9.905-4.656c2.948-2.055 6.625-5.674 6.625-11.375c0-5.702-3.677-9.352-6.625-11.407s-6.14-3.387-9.906-4.656c-7.53-2.54-17.36-4.532-29.408-6.25c-2.013-.287-4.12-.544-6.25-.813c-53.076-30.045-72.99-81.71-14.125-92.312c-31.568-6.886-45.63-18.522-23.468-36.28c15.74-7.15 30.547-17.655 44.092-30.97c6.648 4.773 12.84 10.038 18.47 15.72a301 301 0 0 1-12.72 12.217l16.188 29.594c79.118-71.955 116.195-179.53 110.03-285l-27.342 7.97c.45 7.61.64 15.19.562 22.75h-25.594a417 417 0 0 0 1.063-29.814h-.75c-.323-5.39-3.763-9.293-7-11.75c-3.402-2.58-7.31-4.383-11.97-6.093c-9.32-3.422-21.704-6.177-36.875-8.532c-30.342-4.71-71.613-7.563-117.22-7.563zm0 18.688c44.822 0 85.426 2.854 114.344 7.343c14.46 2.245 26.06 4.932 33.313 7.594c1.04.382 1.775.75 2.625 1.125c-.85.375-1.58.742-2.625 1.125c-7.252 2.662-18.854 5.38-33.313 7.625c-28.918 4.49-69.522 7.344-114.344 7.344c-44.82 0-85.425-2.855-114.344-7.345c-14.46-2.245-26.06-4.963-33.312-7.625c-1.05-.386-1.77-.748-2.625-1.125c.853-.376 1.577-.74 2.625-1.125c7.252-2.662 18.853-5.35 33.313-7.594c28.918-4.49 69.522-7.343 114.343-7.343zm-197.25 71.874H86.25c8.057 57.878 28.23 108.83 56.188 146.25c-6.974 5.74-13.407 11.968-19.188 18.688c-38.648-46.456-59.042-104.647-64.344-164.938m367.188 0h27C447.51 171.82 425.336 228.34 388.03 275a158.5 158.5 0 0 0-17.842-16.97c27.81-37.38 47.873-88.175 55.906-145.842z"
                  />
                </svg>
              </div>
            ),
            details: champs[0]?.name || "TBD",
          }}
          secondPlace={{
            stat: (
              <div className="flex items-center">
                {champs[1]?.titlewins || 0}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256.156 21.625c-45.605 0-86.876 2.852-117.22 7.563c-15.17 2.355-27.554 5.11-36.874 8.53c-4.66 1.71-8.568 3.515-11.968 6.094c-3.238 2.457-6.65 6.36-6.97 11.75h-.75c0 10.08.362 20.022 1.064 29.813H57.53c-.12-7.952.003-15.922.376-23.875l-26.812-6.28C22.55 161.892 64.1 265.716 140.564 339.655l15.655-29.594a251 251 0 0 1-12.157-10.75a143.5 143.5 0 0 1 19.28-16.843c13.468 13.172 28.182 23.565 43.813 30.655c22.114 17.744 8.053 29.368-23.5 36.25c58.863 10.6 38.948 62.267-14.125 92.313c-2.14.27-4.256.523-6.28.812c-12.047 1.718-21.876 3.71-29.406 6.25c-3.765 1.27-6.958 2.6-9.906 4.656c-2.95 2.055-6.626 5.705-6.626 11.406s3.677 9.32 6.626 11.375c2.948 2.055 6.14 3.387 9.906 4.657c7.53 2.54 17.36 4.532 29.406 6.25c24.094 3.436 56.784 5.53 92.906 5.53s68.812-2.094 92.906-5.53c12.048-1.718 21.877-3.71 29.407-6.25c3.764-1.27 6.957-2.602 9.905-4.656c2.948-2.055 6.625-5.674 6.625-11.375c0-5.702-3.677-9.352-6.625-11.407s-6.14-3.387-9.906-4.656c-7.53-2.54-17.36-4.532-29.408-6.25c-2.013-.287-4.12-.544-6.25-.813c-53.076-30.045-72.99-81.71-14.125-92.312c-31.568-6.886-45.63-18.522-23.468-36.28c15.74-7.15 30.547-17.655 44.092-30.97c6.648 4.773 12.84 10.038 18.47 15.72a301 301 0 0 1-12.72 12.217l16.188 29.594c79.118-71.955 116.195-179.53 110.03-285l-27.342 7.97c.45 7.61.64 15.19.562 22.75h-25.594a417 417 0 0 0 1.063-29.814h-.75c-.323-5.39-3.763-9.293-7-11.75c-3.402-2.58-7.31-4.383-11.97-6.093c-9.32-3.422-21.704-6.177-36.875-8.532c-30.342-4.71-71.613-7.563-117.22-7.563zm0 18.688c44.822 0 85.426 2.854 114.344 7.343c14.46 2.245 26.06 4.932 33.313 7.594c1.04.382 1.775.75 2.625 1.125c-.85.375-1.58.742-2.625 1.125c-7.252 2.662-18.854 5.38-33.313 7.625c-28.918 4.49-69.522 7.344-114.344 7.344c-44.82 0-85.425-2.855-114.344-7.345c-14.46-2.245-26.06-4.963-33.312-7.625c-1.05-.386-1.77-.748-2.625-1.125c.853-.376 1.577-.74 2.625-1.125c7.252-2.662 18.853-5.35 33.313-7.594c28.918-4.49 69.522-7.343 114.343-7.343zm-197.25 71.874H86.25c8.057 57.878 28.23 108.83 56.188 146.25c-6.974 5.74-13.407 11.968-19.188 18.688c-38.648-46.456-59.042-104.647-64.344-164.938m367.188 0h27C447.51 171.82 425.336 228.34 388.03 275a158.5 158.5 0 0 0-17.842-16.97c27.81-37.38 47.873-88.175 55.906-145.842z"
                  />
                </svg>
              </div>
            ),
            details: champs[1]?.name || "TBD",
          }}
          thirdPlace={{
            stat: (
              <div className="flex items-center">
                {champs[2]?.titlewins || 0}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256.156 21.625c-45.605 0-86.876 2.852-117.22 7.563c-15.17 2.355-27.554 5.11-36.874 8.53c-4.66 1.71-8.568 3.515-11.968 6.094c-3.238 2.457-6.65 6.36-6.97 11.75h-.75c0 10.08.362 20.022 1.064 29.813H57.53c-.12-7.952.003-15.922.376-23.875l-26.812-6.28C22.55 161.892 64.1 265.716 140.564 339.655l15.655-29.594a251 251 0 0 1-12.157-10.75a143.5 143.5 0 0 1 19.28-16.843c13.468 13.172 28.182 23.565 43.813 30.655c22.114 17.744 8.053 29.368-23.5 36.25c58.863 10.6 38.948 62.267-14.125 92.313c-2.14.27-4.256.523-6.28.812c-12.047 1.718-21.876 3.71-29.406 6.25c-3.765 1.27-6.958 2.6-9.906 4.656c-2.95 2.055-6.626 5.705-6.626 11.406s3.677 9.32 6.626 11.375c2.948 2.055 6.14 3.387 9.906 4.657c7.53 2.54 17.36 4.532 29.406 6.25c24.094 3.436 56.784 5.53 92.906 5.53s68.812-2.094 92.906-5.53c12.048-1.718 21.877-3.71 29.407-6.25c3.764-1.27 6.957-2.602 9.905-4.656c2.948-2.055 6.625-5.674 6.625-11.375c0-5.702-3.677-9.352-6.625-11.407s-6.14-3.387-9.906-4.656c-7.53-2.54-17.36-4.532-29.408-6.25c-2.013-.287-4.12-.544-6.25-.813c-53.076-30.045-72.99-81.71-14.125-92.312c-31.568-6.886-45.63-18.522-23.468-36.28c15.74-7.15 30.547-17.655 44.092-30.97c6.648 4.773 12.84 10.038 18.47 15.72a301 301 0 0 1-12.72 12.217l16.188 29.594c79.118-71.955 116.195-179.53 110.03-285l-27.342 7.97c.45 7.61.64 15.19.562 22.75h-25.594a417 417 0 0 0 1.063-29.814h-.75c-.323-5.39-3.763-9.293-7-11.75c-3.402-2.58-7.31-4.383-11.97-6.093c-9.32-3.422-21.704-6.177-36.875-8.532c-30.342-4.71-71.613-7.563-117.22-7.563zm0 18.688c44.822 0 85.426 2.854 114.344 7.343c14.46 2.245 26.06 4.932 33.313 7.594c1.04.382 1.775.75 2.625 1.125c-.85.375-1.58.742-2.625 1.125c-7.252 2.662-18.854 5.38-33.313 7.625c-28.918 4.49-69.522 7.344-114.344 7.344c-44.82 0-85.425-2.855-114.344-7.345c-14.46-2.245-26.06-4.963-33.312-7.625c-1.05-.386-1.77-.748-2.625-1.125c.853-.376 1.577-.74 2.625-1.125c7.252-2.662 18.853-5.35 33.313-7.594c28.918-4.49 69.522-7.343 114.343-7.343zm-197.25 71.874H86.25c8.057 57.878 28.23 108.83 56.188 146.25c-6.974 5.74-13.407 11.968-19.188 18.688c-38.648-46.456-59.042-104.647-64.344-164.938m367.188 0h27C447.51 171.82 425.336 228.34 388.03 275a158.5 158.5 0 0 0-17.842-16.97c27.81-37.38 47.873-88.175 55.906-145.842z"
                  />
                </svg>
              </div>
            ),
            details: champs[2]?.name || "TBD",
          }}
          seeMoreButton={<button>See More</button>}
        />
      </div>

      <div className="mt-24">
        <Podium
          title={<h1>Highest Weekly Total</h1>}
          firstPlace={{
            stat: highestWeekTotal[0].points || 0,
            details: (
              <>
                Team: {highestWeekTotal[0].team || "TBD"}
                <br />
                Owner: {highestWeekTotal[0].owner || "TBD"}
                <br />
                Year: {highestWeekTotal[0].year || 0}
                <br />
                Week: {highestWeekTotal[0].week || 0}
              </>
            ),
          }}
          secondPlace={{
            stat: highestWeekTotal[1].points || 0,
            details: (
              <>
                Team: {highestWeekTotal[1].team || "TBD"}
                <br />
                Owner: {highestWeekTotal[1].owner || "TBD"}
                <br />
                Year: {highestWeekTotal[1].year || 0}
                <br />
                Week: {highestWeekTotal[1].week || 0}
              </>
            ),
          }}
          thirdPlace={{
            stat: highestWeekTotal[2].points || 0,
            details: (
              <>
                Team: {highestWeekTotal[2].team || "TBD"}
                <br />
                Owner: {highestWeekTotal[2].owner || "TBD"}
                <br />
                Year: {highestWeekTotal[2].year || 0}
                <br />
                Week: {highestWeekTotal[2].week || 0}
              </>
            ),
          }}
          seeMoreButton={
            <Link
              to={`/leaderboards/${highestWeekTotal[0].leaderboardId}/details`}
            >
              See More
            </Link>
          }
        />
      </div>

      <div className="mt-24">
        <Podium
          title={<h1>Highest Player Total</h1>}
          firstPlace={{
            stat: `${highestPlayerTotal[0].points || 0}, ${
              highestPlayerTotal[0].player || "TBD"
            }`,
            details: (
              <>
                Team: {highestPlayerTotal[0].team || "TBD"}
                <br />
                Owner: {highestPlayerTotal[0].owner || "TBD"}
                <br />
                Year: {highestPlayerTotal[0].year || 0}
              </>
            ),
          }}
          secondPlace={{
            stat: `${highestPlayerTotal[1].points || 0}, ${
              highestPlayerTotal[1].player || "TBD"
            }`,
            details: (
              <>
                Team: {highestPlayerTotal[1].team || "TBD"}
                <br />
                Owner: {highestPlayerTotal[1].owner || "TBD"}
                <br />
                Year: {highestPlayerTotal[1].year || 0}
              </>
            ),
          }}
          thirdPlace={{
            stat: `${highestPlayerTotal[2].points || 0}, ${
              highestPlayerTotal[2].player || "TBD"
            }`,
            details: (
              <>
                Team: {highestPlayerTotal[2].team || "TBD"}
                <br />
                Owner: {highestPlayerTotal[2].owner || "TBD"}
                <br />
                Year: {highestPlayerTotal[2].year || 0}
              </>
            ),
          }}
          seeMoreButton={
            <Link
              to={`/leaderboards/${highestPlayerTotal[0].leaderboardId}/details`}
            >
              See More
            </Link>
          }
        />
      </div>

      <div className="mt-24">
        <Podium
          title={<h1>Highest Season Total</h1>}
          firstPlace={{
            stat: `${highestSeasonTotal[0].points || 0}`,
            details: (
              <>
                Team: {highestSeasonTotal[0].team || "TBD"}
                <br />
                Owner: {highestSeasonTotal[0].owner || "TBD"}
                <br />
                Year: {highestSeasonTotal[0].year || 0}
              </>
            ),
          }}
          secondPlace={{
            stat: `${highestSeasonTotal[1].points || 0}`,
            details: (
              <>
                Team: {highestSeasonTotal[1].team || "TBD"}
                <br />
                Owner: {highestSeasonTotal[1].owner || "TBD"}
                <br />
                Year: {highestSeasonTotal[1].year || 0}
              </>
            ),
          }}
          thirdPlace={{
            stat: `${highestSeasonTotal[2].points || 0}`,
            details: (
              <>
                Team: {highestSeasonTotal[2].team || "TBD"}
                <br />
                Owner: {highestSeasonTotal[2].owner || "TBD"}
                <br />
                Year: {highestSeasonTotal[2].year || 0}
              </>
            ),
          }}
          seeMoreButton={
            <Link
              to={`/leaderboards/${highestSeasonTotal[0].leaderboardId}/details`}
            >
              See More
            </Link>
          }
        />
      </div>
    </div>
  );
}
