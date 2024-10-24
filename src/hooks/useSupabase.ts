import { createClient } from "@supabase/supabase-js"
import { Database } from "../../supabaseTypes"
import { load } from "ts-dotenv";

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const env = load({
  
})

export const useSupabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Supabaseの環境変数に問題があります')
  }

  // 環境変数や型ファイルを適用したクライアントを作成
  const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });

  return { supabase }
}