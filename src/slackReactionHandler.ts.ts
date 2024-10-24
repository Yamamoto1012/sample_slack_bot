import { useSlackBot } from "./hooks/useSlackBot";
import { useSupabase } from "./hooks/useSupabase";

// リアクションをsupabaseに追加する
(async () => {
  const { slackBot, PORT } = useSlackBot();

  // リアクションが追加された時の処理
  slackBot.event("reaction_added", async ({ event, client }) => {
    const { reaction, user, item, event_ts } = event;
    const messageId = item.ts;
    const userId = user;
    const reactionId = `${messageId}-${reaction}-${userId}`;
    const createdAt = new Date(parseFloat(event_ts)*1000).toISOString();

    // リアクションデータの保存
    
  });

  //　アプリの起動
  (async () => {
    await slackBot.start(PORT || 3000);
    console.log(`${PORT}ポートを立ち上げます`);
  })
})();