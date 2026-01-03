import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOwners } from "../services/database";
import type { Database } from "../types";
import Card from "../components/common/Card";
import defaultAvatar from "../assets/images/default_avatar.png";

type Owner = Database["public"]["Tables"]["owners"]["Row"];

export default function Owners() {
  const navigate = useNavigate();
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
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <h1 className="text-6xl mb-6">Owners</h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="4em"
          height="4em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"
          ></path>
        </svg>
      </div>
      <div className="flex flex-col gap-4">
        {owners
          .filter((owner) => owner.active)
          .map((owner) => (
            <Card
              key={owner.ownerId}
              title={
                <>
                  <img
                    src={owner.logoUrl || defaultAvatar}
                    alt={owner.name || "Owner"}
                    className="w-12 h-12 rounded"
                  />
                  {owner.name}
                </>
              }
              body={owner.bio || "No bio available"}
              footer={
                <>
                  <button
                    type="button"
                    className="btn btn-accent"
                    onClick={() => navigate(`/owners/${owner.ownerId}/stats`)}
                  >
                    Stats
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="m14 18l-1.4-1.45L16.15 13H4v-2h12.15L12.6 7.45L14 6l6 6z"
                      />
                    </svg>
                  </button>
                </>
              }
              className="card bg-primary text-primary-content w-full"
              titleClassName="card-title text-xl font-bold"
              bodyClassName="text-left text-lg"
            />
          ))}
      </div>
    </div>
  );
}
