import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://lihcbyeukrglqtyxfchh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_SCLopsc7mvq3lbVRYVeZYQ_MEyrPGf1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
