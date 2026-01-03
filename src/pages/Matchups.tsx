import { useEffect } from "react";
import { getLeagueMatchups } from "../services/sleeper";

const week: number = 1;

function Matchups() {
  useEffect(() => {
    getLeagueMatchups(week)
      .then((data) => {
        console.log("League matchups:", data);
      })
      .catch((err) => {
        console.error("Error fetching matchups:", err);
      });
  }, []);

  return <div>{/* Your matchups content */}</div>;
}

export default Matchups;
