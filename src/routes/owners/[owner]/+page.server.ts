import { getOwners } from "$lib/db";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  const owners = await getOwners();

  const owner = owners.find((owner) => owner.id === params.owner);

  if (!owner) throw error(404);

  return {
    owner,
  };
}
