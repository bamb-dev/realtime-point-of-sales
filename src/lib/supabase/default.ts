import { environment } from "@/configs/environment";
import { createClient } from "@supabase/supabase-js";

export const createClientSupabase = () => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = environment;
  return createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
};
