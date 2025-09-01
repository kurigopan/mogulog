import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { ingredientsResponseSchema } from '@/types/schemas';

// SupabaseプロジェクトのURLとanonキーを環境変数から取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 環境変数が設定されていない場合のエラーハンドリング
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'SupabaseのURLとanonキーが.env.localファイルに設定されていません。'
  );
}

// Supabaseクライアントのインスタンスを作成
// createClient<Database>() と型を指定することで、RPCやテーブル操作で型補完が効くようになります。
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * ingredientsテーブルからすべてのデータを取得し、Zodスキーマで安全にパースします。
 */
export const getIngredients = async () => {
  const { data, error } = await supabase.from('ingredients').select('*');

  if (error) {
    console.error('Error fetching ingredients:', error.message);
    throw error;
  }

  // Zodスキーマでデータをパースします。
  // これにより、jsonb型も自動的に検証・型付けされます。
  // .parse()はデータがスキーマに一致しない場合、エラーをスローします。
  const parsedData = ingredientsResponseSchema.parse(data);

  return parsedData;
};
