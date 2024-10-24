import { useSlackBot } from "./hooks/useSlackBot";

// リアクションの数を計測

// リアクションの数をカウントするためのMapを用意
const reactionCounts = new Map<string, number>();
(async () => {
  const { slackBot, PORT } = useSlackBot();

  // リアクションが追加された時の処理
  slackBot.event("reaction_added", async ({ event, client }) => {
    const { reaction, user, item, event_ts } = event;

    // リアクションのカウントを更新
    const count = reactionCounts.get(reaction) || 0;
    reactionCounts.set(reaction, count + 1);

    // リアクションを投稿した時間を人間が読める時間に変更
    const reactionTime = new Date(parseFloat(event_ts) * 1000).toLocaleString();

    // リアクションをした人に通知
    try {
      // アイテムがメッセージの場合にのみ処理
      if (item.type === "message") {
        await client.chat.postMessage({
          channel: item.channel,
          text: `<@${user}> が ${reactionTime}に :${reaction}:した! 総数: ${reactionCounts.get(
            reaction
          )}`,
          thread_ts: item.ts,
        });
      }
    } catch (error) {
      console.error(error);
    }
  });

  // アプリを起動
  (async () => {
    await slackBot.start(PORT);
    console.log(`${PORT}ポートを立ち上げます`);
  })();
})();
