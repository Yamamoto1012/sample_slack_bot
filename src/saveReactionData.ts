import { useSupabase } from "./hooks/useSupabase";

async function saveReactionData(userId: string, messageId: string, reactionId: string, emojiName: string, createdAt: string) {
  const { supabase } = useSupabase();

  // userテーブルの更新
  let { data: user, error: userError } = await supabase
  .from('user')
  .upsert({ id: userId }, { onConflict: 'id' });
  
  if (userError) {
    console.error(userError);
    return;
  }

  // messageテーブルの更新
  
}