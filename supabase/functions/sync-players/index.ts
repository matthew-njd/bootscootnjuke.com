import { createClient } from "npm:@supabase/supabase-js@2";

// Only positions used in standard fantasy lineups. Keeps the table small.
const POSITIONS = new Set(["QB", "RB", "WR", "TE", "K", "DEF"]);
const BATCH_SIZE = 1000;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type SleeperPlayer = {
  full_name?: string;
  first_name?: string;
  last_name?: string;
  position?: string | null;
  team?: string | null;
};

Deno.serve(async (req) => {
  // Only allow callers using the key stored in the CRON_KEY secret (i.e. the cron job).
  const expectedKey = Deno.env.get("CRON_KEY");
  const callerKey =
    req.headers.get("apikey") ??
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!expectedKey || !callerKey || callerKey !== expectedKey) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch("https://api.sleeper.app/v1/players/nfl");
    if (!res.ok) throw new Error(`Sleeper /players/nfl returned ${res.status}`);
    const all = (await res.json()) as Record<string, SleeperPlayer>;

    const now = new Date().toISOString();
    const rows = Object.entries(all)
      .filter(([, p]) => p.position && POSITIONS.has(p.position))
      .map(([id, p]) => ({
        id,
        // Team defenses have no full_name; first + last gives e.g. "Buffalo Bills".
        name:
          p.full_name ||
          [p.first_name, p.last_name].filter(Boolean).join(" ") ||
          id,
        position: p.position ?? null,
        team: p.team ?? null,
        updated_at: now,
      }));

    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const { error } = await supabase
        .from("players")
        .upsert(rows.slice(i, i + BATCH_SIZE), { onConflict: "id" });
      if (error) throw error;
    }

    console.log(`Synced ${rows.length} players`);
    return Response.json({ synced: rows.length });
  } catch (err) {
    console.error("sync-players failed:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
});
