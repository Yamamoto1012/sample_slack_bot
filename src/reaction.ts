import { App } from '@slack/bolt';
import { load } from 'ts-dotenv';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const env = load({
  SLACK_BOT_TOKEN: {
    type: String,
    default: process.env.SLACK_BOT_TOKEN || '',
  },
  SLACK_SIGNING_SECRET: {
    type: String,
    default: process.env.SLACK_SIGNING_SECRET || '',
  },
  PORT: {
    type: Number,
    default: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
});

// 環境変数が正しく設定されているかをチェック
if (!env.SLACK_BOT_TOKEN || !env.SLACK_SIGNING_SECRET) {
  console.error('Error: SLACK_BOT_TOKEN or SLACK_SIGNING_SECRET is missing.');
  process.exit(1); // 必須の環境変数がない場合はプロセスを終了
}

// SlackBotの初期化
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
});

// リアクションの数を計測
// リアクションの数をカウントするためのMapを用意
const reactionCounts = new Map<string, number>();

// リアクションが追加された時の処理
app.event('reaction_added', async ({ event, client }) => {
  const { reaction, user, item, event_ts } = event;
  const ts = item.ts;

  // リアクションのカウントを更新
  const count = reactionCounts.get(reaction) || 0;
  reactionCounts.set(reaction, count + 1);

  // リアクションを投稿した時間を人間が読める時間に変更
  const reactionTime = new Date(parseFloat(event_ts) * 1000).toLocaleString();

  // リアクションをした人に通知
  try {
    // アイテムがメッセージの場合にのみ処理
    if (item.type === 'message') {
      await client.chat.postMessage({
        channel: item.channel,
        text: `<@${user}> が ${reactionTime}に :${reaction}:した! 総数: ${reactionCounts.get(reaction)}`,
        thread_ts: item.ts,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

// アプリを起動
(async () => {
  await app.start(env.PORT);
  console.log(`Slack bot is running on port ${env.PORT}`);
})();

