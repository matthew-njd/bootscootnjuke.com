import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwners } from "../services/database";
import type { Database } from "../types";
import Page, { Notice } from "../components/layout/Page";
import defaultAvatar from "../assets/images/default_avatar.png";

type Owner = Database["public"]["Tables"]["owners"]["Row"];

function OwnerCard({ owner, retired }: { owner: Owner; retired?: boolean }) {
  return (
    <article className="border-2 border-base-content bg-base-100 flex flex-col sm:flex-row">
      <div className="flex flex-col items-center justify-center text-center gap-3 p-4 shrink-0 bg-base-200 border-b-2 sm:border-b-0 sm:border-e-2 border-base-content sm:w-56">
        <img
          src={owner.logoUrl || defaultAvatar}
          alt=""
          className={`object-cover border-2 border-base-content shrink-0 ${
            retired ? "w-16 h-16" : "w-24 h-24"
          }`}
        />
        <div className="min-w-0 w-full">
          <h3
            className={`wood-type uppercase leading-tight ${
              retired ? "text-lg" : "text-xl"
            }`}
          >
            {owner.name}
          </h3>
          {retired && (
            <p className="label-caps text-[0.6rem] text-base-content/50 mt-1">
              Retired
            </p>
          )}
        </div>
      </div>

      <p className="p-4 text-sm leading-relaxed grow">
        {owner.bio || "No bio available."}
      </p>

      <Link
        to={`/owners/${owner.ownerId}/stats`}
        className="label-caps shrink-0 flex items-center justify-center px-5 py-3 text-xs border-t-2 sm:border-t-0 sm:border-s-2 border-base-content hover:bg-primary hover:text-primary-content transition-colors"
      >
        Stats &rarr;
      </Link>
    </article>
  );
}

export default function Owners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOwners()
      .then((data) => setOwners(data ?? []))
      .catch((err) => {
        setError("Failed to fetch owners");
        console.error("Error fetching owners:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const active = owners.filter((owner) => owner.active);
  const retired = owners.filter((owner) => !owner.active);

  return (
    <Page
      title="Owners"
      kicker="The League"
      subtitle="Everyone who has ever held a roster, current and departed (RIP)."
    >
      {loading && <Notice>Loading owners…</Notice>}
      {error && <Notice>{error}</Notice>}

      {!loading && !error && (
        <>
          <div className="flex flex-col gap-4">
            {active.map((owner) => (
              <OwnerCard key={owner.ownerId} owner={owner} />
            ))}
          </div>

          {retired.length > 0 && (
            <>
              <h2 className="wood-type text-2xl uppercase mt-16 mb-2">
                Retired Owners
              </h2>
              <div className="rule-double text-base-content/40 mb-6" />
              <div className="flex flex-col gap-4">
                {retired.map((owner) => (
                  <OwnerCard key={owner.ownerId} owner={owner} retired />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </Page>
  );
}
