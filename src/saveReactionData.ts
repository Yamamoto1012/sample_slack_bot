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
  let { data: message, error: messageError } = await supabase
  .from('message')
  .upsert({ id: messageId }, { onConflict: 'id' });

  if (messageError) {
    console.error(messageError);
    return;
  }

  // reactionテーブルの更新
  let { data: reaction, error: reactionError } = await supabase
  .from('reaction')
  .upsert(
    { id: reactionId, emoji_name: emojiName, created_at: userId },
    { onConflict: 'id' })

  if (reactionError) {
    console.error(reactionError);
    return;
  }

  // message_reactionテーブルの更新
  let {error: massageReactionError} = await supabase
  .from('messagereaction')
  .insert(
    { message_id: messageId, user_id: userId, reaction_id: reactionId, created_at: createdAt }
  )

  if (massageReactionError) {
    console.error(massageReactionError);
    return;
  }
  console.log('リアクションデータを保存しました');
}