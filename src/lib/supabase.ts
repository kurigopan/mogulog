import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { formatRecipeForSupabase } from "@/lib/utils";
import { Database } from "@/types/supabase";
import {
  rpcIngredientSchema,
  ingredientSchema,
  rpcRecipeSchema,
  recipeSchema,
} from "@/types/schemas";
import { Recipe } from "@/types/types";

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

/**
 * @param recipeData - 登録するレシピデータ
 */
export async function createRecipe(recipeData: Omit<Recipe, "id">) {
  // フロントエンドの型をデータベースの型に変換
  const formattedData = formatRecipeForSupabase(recipeData);
  const { data, error } = await supabase
    .from("recipes")
    .insert([formattedData])
    .select();

  if (error) {
    console.error("レシピの登録に失敗しました:", error);
    return { data: null, error };
  }

  // 成功時のデータとエラーを返却
  return { data, error: null };
}

/**
 * @param id - 更新するレシピのID
 * @param recipeData - 更新するレシピデータ
 */
export async function updateRecipe(id: number, recipeData: Omit<Recipe, "id">) {
  const formattedData = formatRecipeForSupabase(recipeData);
  const { data, error } = await supabase
    .from("recipes")
    .update(formattedData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("レシピの更新に失敗しました:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

// ingredientsの型定義に含まれるeaten,ng,isFavoriteを補完するために、
// ユーザーと子どものIDに基づいて、食材リストとステータスを取得するカスタム関数を呼び出す
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

// recipesの型定義に含まれるisFavoriteを補完するために、レシピリストを取得するカスタム関数を呼び出す
export async function getRecipes(userId: string) {
  const { data, error } = await supabase.rpc("get_recipes", {
    user_id_param: userId,
  });

  if (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }

  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcRecipeSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => recipeSchema.parse(d));
}

// 単一のレシピを取得する
export async function getRecipeById(userId: string, recipeId: number) {
  const { data, error } = await supabase.rpc("get_recipe_by_id", {
    user_id_param: userId,
    recipe_id_param: recipeId,
  });

  if (error) {
    console.error("Failed to fetch recipe:", error);
    return [];
  }

  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcRecipeSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => recipeSchema.parse(d));
}

// お気に入り登録データを全て取得する関数
export async function getFavoriteRecipeLogs() {
  const { data, error } = await supabase
    .from("favorites_recipes")
    .select("recipe_id");

  if (error) {
    console.error("Failed to fetch favorite logs:", error);
    return [];
  }

  return data.map((row) => row.recipe_id);
}
