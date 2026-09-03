import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface PageProps {
  title: string;
  kicker?: string;
  subtitle?: string;
  back?: { to: string; label: string };
  children: ReactNode;
}

export default function Page({
  title,
  kicker,
  subtitle,
  back,
  children,
}: PageProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {back && (
        <Link
          to={back.to}
          className="label-caps text-xs inline-block mb-6 border-b-2 border-primary hover:text-primary"
        >
          &larr; {back.label}
        </Link>
      )}

      <header className="mb-10">
        {kicker && (
          <p className="label-caps text-xs text-primary mb-2">{kicker}</p>
        )}
        <h1 className="wood-type text-4xl sm:text-6xl uppercase">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base-content/70">{subtitle}</p>
        )}
        <div className="rule-double text-base-content/40 mt-5" />
      </header>

      {children}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <p className="label-caps text-sm text-base-content/60 py-16 text-center">
      {children}
    </p>
  );
}
