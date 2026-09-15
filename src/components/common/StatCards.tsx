import type { ReactNode } from "react";

export default function StatCards({
  stats,
  className = "",
}: {
  stats: { label: string; value: ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={`flex flex-wrap gap-8 ${className}`}>
      {stats.map(({ label, value }) => (
        <div key={label}>
          <dt className="label-caps text-[0.6rem] text-base-content/55">
            {label}
          </dt>
          <dd className="figures text-3xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
