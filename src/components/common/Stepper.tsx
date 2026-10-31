// Steps a number between min and max, like the week on Matchups.
export default function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  className = "basis-full lg:basis-auto text-center lg:text-start",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  // Triangles match the table's sort glyphs; arrows mean "navigate" elsewhere.
  const arrow =
    "figures text-lg leading-none px-2 py-1 text-base-content/45 hover:text-primary disabled:opacity-25 disabled:hover:text-base-content/45 transition-colors";

  return (
    <div className={`shrink-0 ${className}`}>
      <p className="label-caps text-xs text-base-content/80">{label}</p>
      <div className="flex items-center justify-center lg:justify-start gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value === min}
          aria-label={`Previous ${label.toLowerCase()}`}
          className={arrow}
        >
          ◀
        </button>
        <span className="figures text-3xl min-w-10 text-center">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value === max}
          aria-label={`Next ${label.toLowerCase()}`}
          className={arrow}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
