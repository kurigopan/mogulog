import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { formatRecipeForSupabase } from "@/lib/utils";
import { Database } from "@/types/supabase";
import {
  rpcIngredientSchema,
  ingredientSchema,
  rpcRecipeSchema,
  recipeSchema,
  rpcIngredientCardSchema,
  ingredientCardSchema,
  recipeCardSchema,
  rpcRecipeCardSchema,
} from "@/types/schemas";
import { Child, ChildAllergens, Profile, Recipe } from "@/types/types";

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

// 現在のユーザーを取得する関数
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }

  return user;
}

// プロフィールデータを取得する関数
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
  return data;
}
// 子どものデータを取得する関数
export async function getChild(userId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch child:", error);
    return null;
  }
  return data;
}

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

// アレルゲンを考慮した食材検索
export async function searchIngredientsWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  userId: string,
  childId: number
) {
  const { data, error } = await supabase.rpc(
    "search_ingredients_with_allergens",
    {
      search_term: searchTerm,
      excluded_allergen_ids: excludedAllergenIds,
      parent_id_param: userId,
      child_id_param: childId,
    }
  );

  if (error) {
    console.error("Error fetching ingredients:", error);
    return null;
  }
  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcIngredientSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => ingredientSchema.parse(d));
}

// アレルゲンを考慮したレシピ検索
export async function searchRecipesWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  parentId: string
) {
  const { data, error } = await supabase.rpc("search_recipes_with_allergens", {
    search_term: searchTerm,
    excluded_allergen_ids: excludedAllergenIds,
    parent_id_param: parentId,
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

// ingredientsの型定義に含まれるeaten,ng,isFavoriteを補完するために、
// ユーザーと子どものIDに基づいて、食材リストとステータスを取得するカスタム関数を呼び出す
export async function getIngredientsWithStatus(
  userId: string,
  childId: number
) {
  const { data, error } = await supabase.rpc("get_ingredients_with_status", {
    parent_id_param: userId,
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
    parent_id_param: userId,
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
    parent_id_param: userId,
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

// お気に入り登録データを全て取得する関数
export async function getFavoriteRecipeLogs() {
  const { data, error } = await supabase
    .from("favorites_recipes")
    .select("recipe_id");

  if (error) {
    console.error("Failed to fetch favorite logs:", error);
    return [];
  }

  return data.map((item) => item.recipe_id);
}

// ユーザーごとの食材お気に入り登録データを取得する関数
export async function getFavoriteIngredients(userId: string) {
  const { data, error } = await supabase.rpc("get_favorite_ingredients", {
    user_id: userId,
  });

  if (error) {
    console.error("Failed to fetch favorite ingredients:", error);
    return [];
  }

  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcIngredientCardSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => ingredientCardSchema.parse(d));
}

// ユーザーごとのレシピお気に入り登録データを取得する関数
export async function getFavoriteRecipes(userId: string) {
  const { data, error } = await supabase.rpc("get_favorite_recipes", {
    user_id: userId,
  });

  if (error) {
    console.error("Failed to fetch favorite recipes:", error);
    return [];
  }

  // Zodスキーマを使ってデータをバリデーション
  const validatedData = z.array(rpcRecipeCardSchema).parse(data);

  // フロントエンドの型に変換
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

export async function createProfile(
  formData: { name: string; avatar_url: string | null },
  userId: string // supabase.auth.signUp 後の user.id
) {
  const profileData: Profile = {
    id: userId,
    name: formData.name,
    avatar_url: formData.avatar_url,
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(profileData)
    .select();

  if (error) {
    console.error("プロフィールの登録に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function createChild(
  formData: { childName: string; childBirthday: string },
  userId: string // supabase.auth.signUp 後の user.id
) {
  const childData: Omit<Child, "id"> = {
    parent_id: userId,
    name: formData.childName,
    birthday: formData.childBirthday,
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("children")
    .insert(childData)
    .select();

  if (error) {
    console.error("子どもの登録に失敗しました:", error);
    return { data: null, error };
  }

  return { data: data[0].id };
}

export async function createChildAllergens(
  formData: { allergens: number[] },
  childId: number,
  userId: string // supabase.auth.signUp 後の user.id
) {
  const allergenData: Omit<ChildAllergens, "id">[] = formData.allergens.map(
    (allergenId) => ({
      child_id: childId,
      allergen_id: allergenId,
      created_by: userId,
      updated_by: userId,
    })
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
  userId: string
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

/**
 * @param recipeData - 登録するレシピデータ
 */
export async function createRecipe(
  recipeData: Omit<Recipe, "id">,
  userId: string
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .insert([formattedData])
    .select();

  if (error) {
    console.error("レシピの登録に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: { name: string; avatar_url: string | null }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("プロフィールの更新に失敗しました:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function updateChild(
  childId: number,
  updates: { name: string; birthday: string }
) {
  const { data, error } = await supabase
    .from("children")
    .update(updates)
    .eq("id", childId)
    .select()
    .single();

  if (error) {
    console.error("子どものプロフィールの更新に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function upsertChildAllergens(
  childId: number,
  allergenIds: number[]
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
  }));

  // 3. 新しい情報を挿入
  const { error: insertError } = await supabase
    .from("child_allergens")
    .insert(newAllergens);

  return { error: insertError };
}

/**
 * @param id - 更新するレシピのID
 * @param recipeData - 更新するレシピデータ
 */
export async function updateRecipe(
  id: number,
  recipeData: Omit<Recipe, "id">,
  userId: string
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .update(formattedData)
    .eq("id", id)
    .select();

  if (error) {
    console.error("レシピの更新に失敗しました:", error);
    return { data: null, error };
  }

  return data;
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

/**
 * @param id - 削除するレシピのID
 */
export async function deleteRecipe(id: number) {
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) {
    console.error("レシピの削除に失敗しました:", error);
    return { error };
  }

  return { error: null };
}

export async function uploadAvatar(file: File, userId: string) {
  const bucketName = "avatars";
  const filePath = `${userId}/${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // 同名ファイルがあれば上書き
    });

  if (error) {
    console.error("アップロードエラー:", error.message);
    return null;
  }

  // 非公開URLを取得したい場合
  const signedUrlData = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60);

  if (signedUrlData.error) {
    console.error("署名付きURL取得エラー:", signedUrlData.error.message);
    return null;
  }
  return signedUrlData.data.signedUrl;
}
