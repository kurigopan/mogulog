import { supabase } from "@/lib/supabase/client";
import { z } from "zod";
import {
  dbIngredientCardSchema,
  ingredientCardSchema,
  ingredientDetailSchema,
  ingredientListCardSchema,
  rpcIngredientDetailSchema,
  rpcIngredientListCardSchema,
} from "@/types";

// アレルゲンを除外した食材検索
export async function searchIngredientsWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  userId: string | null = null,
  childId: number | null = null,
) {
  const { data, error } = await supabase.rpc(
    "search_ingredients_with_allergens",
    {
      search_term: searchTerm,
      excluded_allergen_ids: excludedAllergenIds,
      parent_id_param: userId,
      child_id_param: childId,
    },
  );

  if (error) {
    console.error("Error fetching ingredients:", error);
    return null;
  }

  const validatedData = z.array(rpcIngredientListCardSchema).parse(data);
  return validatedData.map((d) => ingredientListCardSchema.parse(d));
}

// 食材IDに基づいて食材情報を取得
export async function getIngredientById(
  userId: string | null = null,
  childId: number | null = null,
  ingredientId: number,
) {
  const { data, error } = await supabase.rpc("get_ingredient_by_id", {
    parent_id_param: userId,
    child_id_param: childId,
    ingredient_id_param: ingredientId,
  });

  if (error) {
    console.error("Failed to fetch ingredient:", error);
    return null;
  }

  const validatedData = rpcIngredientDetailSchema.parse(data[0]);
  return ingredientDetailSchema.parse(validatedData);
}

// 食材一覧と子どもの食べた履歴を取得
export async function getIngredientsWithStatus(
  userId: string | null = null,
  childId: number | null = null,
) {
  const { data, error } = await supabase.rpc("get_ingredients_with_status", {
    parent_id_param: userId,
    child_id_param: childId,
  });

  if (error) {
    console.error("Failed to fetch ingredients with status:", error);
    return [];
  }

  const validatedData = z.array(rpcIngredientDetailSchema).parse(data);
  return validatedData.map((d) => ingredientDetailSchema.parse(d));
}

// ユーザーごとの食材お気に入り登録データを取得する関数
export async function getFavoriteIngredients(userId: string) {
  const { data, error } = await supabase.rpc("get_favorite_ingredients", {
    parent_id_param: userId,
  });

  if (error) {
    console.error("お気に入り食材の取得に失敗しました:", error);
    return [];
  }

  const validatedData = z.array(rpcIngredientListCardSchema).parse(data);
  return validatedData.map((d) => ingredientListCardSchema.parse(d));
}

export async function upsertIngredientStatus(
  childId: number,
  ingredientId: number,
  status: string,
  userId: string,
) {
  const { data, error } = await supabase.from("child_ingredient_logs").upsert(
    {
      child_id: childId,
      ingredient_id: ingredientId,
      status: status,
      created_by: userId,
      updated_by: userId,
      updated_at: new Date().toISOString(),
      // 既存レコードがあれば created_at はそのまま保持
    },
    {
      onConflict: "child_id, ingredient_id", // このユニーク制約を想定
      ignoreDuplicates: false,
    },
  );

  if (error) {
    console.error("Error upserting ingredient status:", error.message);
    return null;
  }
  return data;
}

export async function deleteIngredientStatus(
  childId: number,
  ingredientId: number,
) {
  const { error } = await supabase
    .from("child_ingredient_logs")
    .delete()
    .match({ child_id: childId, ingredient_id: ingredientId });

  if (error) {
    console.error("Error deleting ingredient status:", error.message);
    return false;
  }
  return true;
}

// 旬の食材 (月齢と季節を考慮)を５件取得
export async function getSeasonalIngredients(childStageAge: string) {
  const { data, error } = await supabase.rpc("get_seasonal_ingredients", {
    stage: childStageAge,
    limit_count: 5,
  });

  if (error) {
    console.error("Error fetching seasonal ingredients:", error);
    return [];
  }

  const validatedData = z.array(dbIngredientCardSchema).parse(data);
  return validatedData.map((d) => ingredientCardSchema.parse(d));
}
