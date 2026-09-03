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
      footer={<p>This Club D'Agostino team is really good</p>}
      className="border-2 border-base-content bg-base-200 w-full max-w-4xl"
      cardBodyClassName="p-6 sm:p-8"
      titleClassName="wood-type text-3xl sm:text-4xl uppercase"
      bodyClassName="text-lg mt-5 text-left leading-relaxed"
      footerClassName="text-xs italic mt-5 text-base-content/55"
    />
  );
}
