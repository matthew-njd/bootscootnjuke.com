import { useEffect, useState } from "react";
import { getOwners } from "../services/database";
import type { Database } from "../types";
import Card from "../components/common/Card";

type Owner = Database["public"]["Tables"]["owners"]["Row"];

export default function Owners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setLoading(true);
        const data = await getOwners();
        if (data) {
          setOwners(data);
        }
      } catch (err) {
        setError("Failed to fetch owners");
        console.error("Error fetching owners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  if (loading) {
    return <div>Loading owners...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1 className="text-4xl mb-6">Owners</h1>
      <div className="flex flex-col gap-4">
        {owners
          .filter((owner) => owner.active)
          .map((owner) => (
            <Card
              key={owner.ownerId}
              title={
                <>
                  {owner.logoUrl && (
                    <img
                      src={owner.logoUrl}
                      alt={owner.name || "Owner"}
                      className="w-12 h-12 rounded"
                    />
                  )}
                  {owner.name}
                </>
              }
              body={owner.bio || "No bio available"}
              className="card bg-primary text-primary-content w-full"
              titleClassName="card-title text-xl font-bold"
              bodyClassName="text-left text-lg"
            />
          ))}
      </div>
    </div>
  );
}
