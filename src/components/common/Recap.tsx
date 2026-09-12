import { useEffect, useState, type ReactNode } from "react";
import { getLatestRecap, getRecapByWeek } from "../../services/database";

import type { Database } from "../../types";

type Recap = Database["public"]["Tables"]["recaps"]["Row"];

function RecapCard({
  title,
  body,
  footer,
}: {
  title: string;
  body: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="border-2 border-base-content bg-base-200 w-full max-w-4xl">
      <div className="p-6 sm:p-8">
        <h2 className="wood-type text-3xl sm:text-4xl uppercase">{title}</h2>
        <div className="text-lg mt-5 text-left leading-relaxed">{body}</div>
        {footer && (
          <div className="text-xs italic mt-5 text-base-content/55">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

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
      <RecapCard
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
    <RecapCard
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
