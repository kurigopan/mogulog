import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import { z } from "zod";
import {
  // ingredientsResponseSchema,
  rpcIngredientSchema,
  ingredientSchema,
} from "@/types/schemas";

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
// createClient<Database>() と型を指定することで、RPCやテーブル操作で型補完が効くようになります。
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * ユーザーと子どものIDに基づいて、食材リストとステータスを取得するカスタム関数を呼び出す
 */
export async function getIngredientsWithStatus(
  userId: string,
  childId: number
) {
  const { data, error } = await supabase.rpc("get_ingredients_with_status", {
    user_id_param: userId,
    child_id_param: childId,
  });

  if (error) {
    console.error("Failed to fetch ingredients with status:", error);
    return [];
  }

  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcIngredientSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => ingredientSchema.parse(d));
}
