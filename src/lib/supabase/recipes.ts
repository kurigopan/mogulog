import { supabase } from "@/lib/supabase/client";
import { z } from "zod";
import {
  dbRecipeCardSchema,
  formatRecipeForSupabase,
  recipeCardSchema,
  recipeDetailSchema,
  recipeListCardSchema,
  rpcRecipeDetailSchema,
  rpcRecipeListCardSchema,
} from "@/types";
import type { Recipe } from "@/types";

// アレルゲンを除外したレシピ検索
export async function searchRecipesWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  userId: string | null = null,
) {
  const { data, error } = await supabase.rpc("search_recipes_with_allergens", {
    search_term: searchTerm,
    excluded_allergen_ids: excludedAllergenIds,
    parent_id_param: userId,
  });

  if (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }

  const validatedData = z.array(rpcRecipeListCardSchema).parse(data);
  return validatedData.map((d) => recipeListCardSchema.parse(d));
}

// 離乳食段階と食材名を考慮したレシピ　5件取得
export async function searchRecipesByIngredient(
  userId: string | null = null,
  ingredientName: string,
  ageStage: string,
) {
  const { data, error } = await supabase.rpc("search_recipes_by_ingredient", {
    parent_id_param: userId,
    ingredient_name_param: ingredientName,
    age_stage_param: ageStage,
    limit_count: 5,
  });

  if (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }

  const validatedData = z.array(dbRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

// レシピIDに基づいてレシピ情報を取得
export async function getRecipeById(
  userId: string | null = null,
  recipeId: number,
) {
  const { data, error } = await supabase.rpc("get_recipe_by_id", {
    parent_id_param: userId,
    recipe_id_param: recipeId,
  });

  if (error) {
    console.error("Failed to fetch recipe:", error);
    return null;
  }

  const validatedData = rpcRecipeDetailSchema.parse(data[0]);
  return recipeDetailSchema.parse(validatedData);
}

// ユーザーごとのレシピお気に入り登録データを取得する関数
export async function getFavoriteRecipes(userId: string) {
  const { data, error } = await supabase.rpc("get_favorite_recipes", {
    parent_id_param: userId,
  });

  if (error) {
    console.error("お気に入りレシピの取得に失敗しました:", error);
    return [];
  }

  const validatedData = z.array(rpcRecipeListCardSchema).parse(data);
  return validatedData.map((d) => recipeListCardSchema.parse(d));
}

export async function createRecipe(
  recipeData: Omit<Recipe, "id">,
  userId: string,
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .insert([formattedData])
    .select("id")
    .single();

  if (error) {
    console.error("レシピの登録に失敗しました:", error);
    throw error;
  }
  return data.id;
}

export async function updateRecipe(
  recipeId: number,
  recipeData: Omit<Recipe, "id">,
  userId: string,
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .update(formattedData)
    .eq("id", recipeId)
    .select();

  if (error) {
    console.error("レシピの更新に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function deleteRecipe(id: number) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("レシピの削除に失敗しました:", error);
    return { error };
  }

  return { error: null };
}

// ユーザーが作成したレシピを取得
export async function getRecipesCreatedByUser(userId: string) {
  const { data, error } = await supabase.rpc("get_recipes_created_by_user", {
    parent_id_param: userId,
  });

  if (error) {
    console.error("レシピの取得に失敗しました:", error);
    return [];
  }

  const validatedData = z.array(rpcRecipeListCardSchema).parse(data);
  return validatedData.map((d) => recipeListCardSchema.parse(d));
}

// おすすめレシピを５件取得
export async function getRecommendedRecipes(childAgeStage: string) {
  const { data, error } = await supabase.rpc("get_recommended_recipes", {
    stage: childAgeStage,
    limit_count: 5,
  });

  if (error) {
    console.error("Error fetching recommended recipes:", error.message);
    return [];
  }
  const validatedData = z.array(dbRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

// 人気のレシピを５件取得
export async function getPopularRecipes(childAgeStage: string) {
  const { data, error } = await supabase.rpc("get_popular_recipes", {
    stage: childAgeStage,
    limit_count: 5,
  });

  if (error) {
    console.error("Error fetching popular recipes:", error.message);
    return [];
  }
  const validatedData = z.array(dbRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}
