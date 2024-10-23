import { App } from '@slack/bolt';
import { load } from 'ts-dotenv';

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// ② 環境変数の読み込みと検証
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

// ③ SlackBotの初期化
const app = new App({
  token: env.SLACK_BOT_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
});

// ④ SlackBotにメッセージを送信する
app.message('', async ({ message, say }) => {
  if (!message.subtype) {
    await say(`${message.text}`);
  }
});

(async () => {
  // ⑤ SlackBotを起動する
  await app.start(env.PORT); // env.PORTを使用

  console.log('⚡️ Bolt app is running!');
})();
