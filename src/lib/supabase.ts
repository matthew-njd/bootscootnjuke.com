import { createClient } from "@supabase/supabase-js";
import type { Database } from "$lib/types/index";

export const supabase = createClient<Database>(
  "https://kfgycginbwcwzvruujeh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmZ3ljZ2luYndjd3p2cnV1amVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEyNDc0OTAsImV4cCI6MjAwNjgyMzQ5MH0.md00_T7wqJqPwrOHFzN6fi21UMa_aBsCg9kljqVXUvc"
);
