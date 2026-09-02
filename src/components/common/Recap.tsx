import { useEffect, useState } from "react";
import Card from "./Card";
import { getLatestRecap, getRecapByWeek } from "../../services/database";
import type { Database } from "../../types";

type Recap = Database["public"]["Tables"]["recaps"]["Row"];

export default function Recap({ week }: { week?: number }) {
  const [recap, setRecap] = useState<Recap | null>(null);

  useEffect(() => {
    const load = week === undefined ? getLatestRecap() : getRecapByWeek(week);
    load
      .then(setRecap)
      .catch((err) => console.error("Error fetching recap:", err));
  }, [week]);

  if (!recap) return null;

  return (
    <Card
      title={`Week ${recap.week} Recap`}
      body={recap.body.split("\n\n").map((paragraph, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}
      footer={<p>Written by a robot who watched you lose</p>}
      className="card bg-base-200 w-full max-w-4xl"
      titleClassName="card-title text-3xl font-bold"
      bodyClassName="text-lg mt-4 text-left"
      footerClassName="card-footer text-xs italic mt-4"
    />
  );
}
