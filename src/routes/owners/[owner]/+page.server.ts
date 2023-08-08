import { getOwners, getSeasons } from "$lib/db";
import { error } from "@sveltejs/kit";

// Returns object and array of object based on url params
export async function load({ params }) {
  const owners = await getOwners();
  const owner = owners?.find((owner) => owner.ownerId === params.owner);
  const team_stats = await getSeasons(params.owner);

  if (!owner) throw error(404);
  if (!team_stats) throw error(404);

  return {
    owner,
    team_stats,
  };
}
