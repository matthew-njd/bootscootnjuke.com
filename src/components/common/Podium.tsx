import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import defaultAvatar from "../../assets/images/default_avatar.png";

export interface Place {
  stat: ReactNode;
  details: ReactNode;
  avatar?: string | null;
}

interface PodiumProps {
  title: ReactNode;
  subtitle?: ReactNode;
  // 1st, 2nd, 3rd.
  places: Place[];
  // Header band background and text classes.
  band: string;
  // Stage background and text classes. Defaults to the green field.
  stage?: string;
  // Full table link. Without one, the steps stand on the card's bottom border.
  to?: string;
}

// Gold, silver, bronze. From sm up, 2nd and 3rd flank a taller 1st.
const STEPS = [
  {
    color: "bg-gold",
    height: "sm:h-32",
    order: "sm:order-2",
    avatar: "w-20 h-20",
    stat: "text-4xl",
  },
  {
    color: "bg-silver",
    height: "sm:h-20",
    order: "sm:order-1",
    avatar: "w-16 h-16",
    stat: "text-3xl",
  },
  {
    color: "bg-bronze",
    height: "sm:h-12",
    order: "sm:order-3",
    avatar: "w-14 h-14",
    stat: "text-2xl",
  },
];

export default function Podium({
  title,
  subtitle,
  places,
  band,
  stage = "bg-secondary text-secondary-content",
  to,
}: PodiumProps) {
  return (
    <section className="border-2 border-base-content bg-base-100">
      <div
        className={`flex items-baseline justify-between gap-3 px-3 sm:px-4 py-2 border-b-2 border-base-content ${band}`}
      >
        <h2 className="wood-type text-xl sm:text-2xl uppercase shrink-0">
          {title}
        </h2>
        {subtitle && (
          <span className="label-caps text-[0.6rem] opacity-75 min-w-0 text-end">
            {subtitle}
          </span>
        )}
      </div>

      {/* The steps stand on the footer's top border from sm up. */}
      <div className={`relative overflow-hidden ${stage}`}>
        <div className="absolute inset-0 yardlines opacity-30" aria-hidden />
        <ol className="relative flex flex-col sm:flex-row sm:items-end justify-center gap-6 sm:gap-3 px-4 sm:px-8 pt-8 pb-6 sm:pb-0">
          {STEPS.map((step, i) => (
            <li
              key={i}
              className={`flex flex-col items-center sm:w-56 ${step.order}`}
            >
              <img
                src={places[i]?.avatar || defaultAvatar}
                alt=""
                className={`${step.avatar} object-cover border-2 border-base-content bg-base-100`}
              />
              <div className={`figures ${step.stat} mt-2 leading-tight`}>
                {places[i]?.stat}
              </div>
              <div className="mt-2 w-full border-2 border-base-content bg-base-100 text-base-content px-3 py-1">
                {places[i]?.details}
              </div>
              <div
                className={`mt-3 w-full h-12 ${step.height} ${step.color} border-2 sm:border-b-0 border-base-content text-medal-content flex justify-center pt-1`}
              >
                <span className="wood-type text-3xl">{i + 1}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {to && (
        <Link
          to={to}
          className="label-caps block px-4 py-3 text-xs text-center border-t-2 border-base-content hover:bg-primary hover:text-primary-content transition-colors"
        >
          Full table &rarr;
        </Link>
      )}
    </section>
  );
}
