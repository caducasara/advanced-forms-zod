import { createClient } from "@supabase/supabase-js";

const URL = `${import.meta.env.VITE_SUPABASE_URL}`;
const SECRET = `${import.meta.env.VITE_SUPABASE_SECRET}`;

export const client = createClient(URL, SECRET);
