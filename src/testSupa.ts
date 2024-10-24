import { useSupabase } from "./hooks/useSupabase";

(async () => {
  const { supabase } = useSupabase();

  const { data, error } = await supabase.from("message").select("content");
  console.log(data, error);
})();