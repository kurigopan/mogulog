import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// SupabaseプロジェクトのURLとanonキーを環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されていない場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "SupabaseのURLとanonキーが.env.localファイルに設定されていません。"
  );
}

// Supabaseクライアントのインスタンスを作成
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
