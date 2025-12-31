import { useEffect, useState } from "react";
import { getOwners } from "../services/database";
import type { Database } from "../types";

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
  }, []); // Empty dependency array means this runs once when component mounts

  if (loading) {
    return <div>Loading owners...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Owners</h1>
      <ul>
        {owners
          .filter((owner) => owner.active)
          .map((owner) => (
            <li key={owner.ownerId}>
              <div>
                {owner.logoUrl && (
                  <img src={owner.logoUrl} alt={owner.name || "Owner"} />
                )}
                <h2>{owner.name}</h2>
                {owner.bio && <p>{owner.bio}</p>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
