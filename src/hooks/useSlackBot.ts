import { load } from "ts-dotenv";
import { App } from "@slack/bolt";

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

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

export const useSlackBot = () => {
  if (!env.SLACK_BOT_TOKEN || !env.SLACK_SIGNING_SECRET) {
    throw new Error('slackBotの環境変数に問題があります')
  }

  // 環境変数や型ファイルを適用したクライアントを作成
  const slackBot = new App({
    token: env.SLACK_BOT_TOKEN,
    signingSecret: env.SLACK_SIGNING_SECRET,
  });
  
  const PORT = env.PORT;

  return { slackBot, PORT }
}