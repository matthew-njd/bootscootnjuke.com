import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types";

import { SUPABASE_URL } from "$env/static/private";
import { SUPABASE_ANON_KEY } from "$env/static/private";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
