import { createClient } from "@supabase/supabase-js";

//Get environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_ANON_KEY;

console.log(SUPABASE_URL, SUPABASE_KEY);

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY!);
