import { supabase } from "@/lib/supabase/client";
import { ChildAllergens } from "@/types";

// 子どものアレルゲンデータを取得する関数
export async function getChildAllergens(childId: number) {
  const { data, error } = await supabase
    .from("child_allergens")
    .select("allergen_id")
    .eq("child_id", childId);

  if (error) {
    console.error("Failed to fetch child allergens:", error);
    return null;
  }
  return data.map((item) => item.allergen_id);
}

// アレルゲン登録データを全て取得する関数
export async function getAllergens() {
  const { data, error } = await supabase
    .from("allergens")
    .select("id, name, variants");

  if (error) {
    console.error("Failed to fetch allergens:", error);
    return [];
  }

  return data;
}

// レシピIDに基づいてアレルゲンのIDと名前を取得
export async function getRecipeAllergens(recipeId: number) {
  const { data, error } = await supabase.rpc("get_recipe_allergens", {
    recipe_id_param: recipeId,
  });

  if (error) {
    console.error("Failed to fetch recipe allergens:", error);
    return [];
  }

  return data;
}

// レシピIDに基づいてアレルゲンIDを取得
export async function getRecipeAllergensById(recipeId: number) {
  const { data, error } = await supabase
    .from("recipe_allergens")
    .select("allergen_id")
    .eq("recipe_id", recipeId);

  if (error) {
    console.error("Error fetching recipe allergens by ID:", error);
    return null;
  }
  // allergen_idの配列に変換して返す
  return data.map((item) => item.allergen_id);
}

export async function createChildAllergens(
  formData: { allergens: number[] },
  childId: number,
  userId: string, // supabase.auth.signUp 後の user.id
) {
  const allergenData: Omit<ChildAllergens, "id">[] = formData.allergens.map(
    (allergenId) => ({
      child_id: childId,
      allergen_id: allergenId,
      created_by: userId,
      updated_by: userId,
    }),
  );

  const { data, error } = await supabase
    .from("child_allergens")
    .insert(allergenData)
    .select();

  if (error) {
    console.error("アレルゲンの登録に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function createRecipeAllergens(
  recipeId: number,
  allergenIds: number[],
  userId: string,
) {
  // 挿入するデータの配列を生成
  const dataToInsert = allergenIds.map((allergenId) => ({
    recipe_id: recipeId,
    allergen_id: allergenId,
    created_by: userId,
    updated_by: userId,
  }));

  // データがなければ何もしない
  if (dataToInsert.length === 0) {
    return { data: null, error: null };
  }

  // 複数の行を一度に挿入
  const { data, error } = await supabase
    .from("recipe_allergens")
    .insert(dataToInsert)
    .select();

  if (error) {
    console.error("Error creating recipe allergens:", error);
    return { data: null, error };
  }

  return data;
}

export async function upsertChildAllergens(
  childId: number,
  allergenIds: number[],
  userId: string,
) {
  // 1. 既存のアレルギー情報を削除
  const { error: deleteError } = await supabase
    .from("child_allergens")
    .delete()
    .eq("child_id", childId);

  if (deleteError) {
    return { error: deleteError };
  }

  // 2. 新しいアレルギー情報を作成
  const newAllergens = allergenIds.map((allergenId) => ({
    child_id: childId,
    allergen_id: allergenId,
    created_by: userId,
    updated_by: userId,
  }));

  // 3. 新しい情報を挿入
  const { error: insertError } = await supabase
    .from("child_allergens")
    .insert(newAllergens);

  return { error: insertError };
}

export async function deleteRecipeAllergens(recipeId: number) {
  const { error } = await supabase
    .from("recipe_allergens")
    .delete()
    .eq("recipe_id", recipeId);

  if (error) {
    console.error("Error deleting recipe allergens:", error);
    return { error };
  }

  return { error: null };
}
