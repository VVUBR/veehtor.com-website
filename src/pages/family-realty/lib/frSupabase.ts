import { createClient } from "@supabase/supabase-js";

// External Supabase project used ONLY by the /family-realty dashboard.
// Isolated from the rest of the site (custom storageKey), read-only usage.
const FR_SUPABASE_URL = "https://yklcfwhpkvtrjbqxhiln.supabase.co";
const FR_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbGNmd2hwa3Z0cmpicXhoaWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MTkxMjcsImV4cCI6MjA5ODQ5NTEyN30.2ma2xsQhcO3cTaeAY3zYHvvKH6z_bg1j6PPJu4JChQ4";

export const frSupabase = createClient(FR_SUPABASE_URL, FR_SUPABASE_ANON_KEY, {
  auth: {
    storageKey: "fr-auth",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
