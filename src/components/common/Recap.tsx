import { useEffect, useState } from "react";
import Card from "./Card";
import { getLatestRecap, getRecapByWeek } from "../../services/database";

import type { Database } from "../../types";

type Recap = Database["public"]["Tables"]["recaps"]["Row"];

const cardClasses = {
  className: "border-2 border-base-content bg-base-200 w-full max-w-4xl",
  cardBodyClassName: "p-6 sm:p-8",
  titleClassName: "wood-type text-3xl sm:text-4xl uppercase",
  bodyClassName: "text-lg mt-5 text-left leading-relaxed",
  footerClassName: "text-xs italic mt-5 text-base-content/55",
};

export default function Recap({ week }: { week?: number }) {
  // undefined while loading, null once we know there is no recap to show
  const [recap, setRecap] = useState<Recap | null | undefined>(undefined);

  useEffect(() => {
    const load = week === undefined ? getLatestRecap() : getRecapByWeek(week);
    load.then(setRecap).catch((err) => {
      console.error("Error fetching recap:", err);
      setRecap(null);
    });
  }, [week]);

  if (recap === undefined) return null;

  if (!recap)
    return (
      <Card
        {...cardClasses}
        title={week === undefined ? "Weekly Recap" : `Week ${week} Recap`}
        body={
          <p className="text-base-content/60">
            Nothing to report yet. Recaps post Tuesday mornings, once the week's
            matchups are final.
          </p>
        }
      />
    );

  return (
    <Card
      {...cardClasses}
      title={`Week ${recap.week} Recap`}
      body={recap.body.split("\n\n").map((paragraph, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}
      footer={<p>This Club D'Agostino team is really good</p>}
    />
  );
}
