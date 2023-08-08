import { getOwners, getSeasons, getSeasonsSupa } from "$lib/db";
import { error } from "@sveltejs/kit";

// Returns object and array of object based on url params
export async function load({ params }) {
  // // firebase
  // const owners = await getOwners();
  // // Gets a specific owner
  // const owner = owners?.find((owner) => owner.id === params.owner);
  // // Get seasons based on the owner
  // const seasons = await getSeasons(params.owner);

  // supabase
  const owners = await getOwners();
  const owner = owners?.find((owner) => owner.ownerId === params.owner);
  const seasons = await getSeasonsSupa(params.owner);

  if (!owner) throw error(404);
  if (!seasons) throw error(404);

  return {
    owner,
    seasons,
  };
}
