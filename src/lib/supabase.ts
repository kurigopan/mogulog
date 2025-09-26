import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { formatRecipeForSupabase } from "@/types/schemas";
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
import {
  Child,
  ChildAllergens,
  FavoritesIngredients,
  FavoritesRecipes,
  Profile,
  Recipe,
  TableName,
  Type,
} from "@/types/types";

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

// ユーザー情報（メールアドレス）を取得する関数
export async function getUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Failed to fetch user:", error);
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

// アレルゲンを除外した食材検索
export async function searchIngredientsWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  userId: string | null = null,
  childId: number | null = null
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

  const validatedData = z.array(rpcIngredientSchema).parse(data);
  return validatedData.map((d) => ingredientSchema.parse(d));
}

// アレルゲンを除外したレシピ検索
export async function searchRecipesWithAllergens(
  searchTerm: string,
  excludedAllergenIds: number[],
  userId: string | null = null
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

  const validatedData = z.array(rpcRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

// 離乳食段階と食材名を考慮したレシピ検索
export async function searchRecipesByIngredient(
  userId: string | null = null,
  ingredientName: string,
  ageStage: string
) {
  const { data, error } = await supabase.rpc("search_recipes_by_ingredient", {
    parent_id_param: userId,
    ingredient_name_param: ingredientName,
    age_stage_param: ageStage,
  });

  if (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }

  const validatedData = z.array(rpcRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

// レシピ一覧を取得
export async function getRecipes(userId: string | null = null) {
  const { data, error } = await supabase.rpc("get_recipes", {
    parent_id_param: userId,
  });

  if (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }

  const validatedData = z.array(rpcRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

// 食材IDに基づいて食材情報を取得
export async function getIngredientById(
  userId: string | null = null,
  childId: number | null = null,
  ingredientId: number
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

  const validatedData = rpcIngredientSchema.parse(data[0]);
  return ingredientSchema.parse(validatedData);
}

// レシピIDに基づいてレシピ情報を取得
export async function getRecipeById(
  userId: string | null = null,
  recipeId: number
) {
  const { data, error } = await supabase.rpc("get_recipe_by_id", {
    parent_id_param: userId,
    recipe_id_param: recipeId,
  });

  if (error) {
    console.error("Failed to fetch recipe:", error);
    return null;
  }

  const validatedData = rpcRecipeSchema.parse(data[0]);
  return recipeSchema.parse(validatedData);
}

// 食材一覧と子どもの食べた履歴を取得
export async function getIngredientsWithStatus(
  userId: string | null = null,
  childId: number | null = null
) {
  const { data, error } = await supabase.rpc("get_ingredients_with_status", {
    parent_id_param: userId,
    child_id_param: childId,
  });

  if (error) {
    console.error("Failed to fetch ingredients with status:", error);
    return [];
  }

  const validatedData = z.array(rpcIngredientSchema).parse(data);
  return validatedData.map((d) => ingredientSchema.parse(d));
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
    parent_id_param: userId,
  });

  if (error) {
    console.error("お気に入り食材の取得に失敗しました:", error);
    return [];
  }

  const validatedData = z.array(rpcIngredientCardSchema).parse(data);
  return validatedData.map((d) => ingredientCardSchema.parse(d));
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

  const validatedData = z.array(rpcRecipeCardSchema).parse(data);
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
    return null;
  }

  return data[0].id;
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

export async function createRecipe(
  recipeData: Omit<Recipe, "id">,
  userId: string
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .insert([formattedData])
    .select()
    .single();

  if (error) {
    console.error("レシピの登録に失敗しました:", error);
    throw error;
  }

  const validatedData = rpcRecipeSchema.parse(data);
  return recipeSchema.parse(validatedData);
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

export async function updateRecipe(
  recipeId: number,
  recipeData: Omit<Recipe, "id">,
  userId: string
) {
  const formattedData = formatRecipeForSupabase(recipeData, userId);
  const { data, error } = await supabase
    .from("recipes")
    .update(formattedData)
    .eq("recipe_id", recipeId)
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

  const signedUrl = await getSignedUrl(filePath);

  return signedUrl;
}

export async function getSignedUrl(filePath: string) {
  const { data, error } = await supabase.storage
    .from("avatars")
    .createSignedUrl(filePath, 3600);

  if (error) {
    console.error("署名付きURL取得エラー:", error.message);
    return null;
  }
  if (data && data.signedUrl) {
    return data.signedUrl;
  }
  return null;
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

  const validatedData = z.array(rpcRecipeCardSchema).parse(data);
  return validatedData.map((d) => recipeCardSchema.parse(d));
}

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  return { data, error };
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("ログアウトに失敗しました:", error.message);
    return;
  }
}

export async function updateEmail(newEmail: string) {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    console.error("メールアドレスの更新に失敗しました:", error.message);
    return;
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("パスワードの更新に失敗しました:", error.message);
    return;
  }
}

// レシピのお気に入り登録・解除を切り替える関数
export async function toggleFavoriteItem(
  userId: string,
  itemId: number,
  itemType: Type,
  isFavorited: boolean
): Promise<boolean> {
  let tableName: TableName;
  let itemIdColumn: string;

  // ⭐️ itemTypeに基づいてテーブル名とカラム名を決定
  switch (itemType) {
    case "recipe":
      tableName = "favorites_recipes";
      itemIdColumn = "recipe_id";
      break;
    case "ingredient":
      tableName = "favorites_ingredients";
      itemIdColumn = "ingredient_id";
      break;
    default:
      console.error("不明なお気に入りタイプ:", itemType);
      return false;
  }

  if (isFavorited) {
    // 既に登録済み -> 解除（削除）
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("parent_id", userId)
      .eq(itemIdColumn, itemId);

    if (error) {
      console.error(`${itemType}お気に入り解除エラー:`, error);
      return false;
    }
    return true;
  } else {
    // 未登録 -> 登録（挿入）
    let insertData: FavoritesRecipes | FavoritesIngredients;
    if (itemType === "recipe") {
      insertData = {
        parent_id: userId,
        recipe_id: itemId,
        created_by: userId,
        updated_by: userId,
      };
    } else {
      insertData = {
        parent_id: userId,
        ingredient_id: itemId,
        created_by: userId,
        updated_by: userId,
      };
    }

    const { error } = await supabase.from(tableName).insert([insertData]);

    if (error) {
      // ユニーク制約エラーなどで登録失敗
      console.error(`${itemType}お気に入り登録エラー:`, error);
      return false;
    }
    return true;
  }
}

export async function upsertIngredientStatus(
  childId: number,
  ingredientId: number,
  status: string,
  userId: string
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
    }
  );

  if (error) {
    console.error("Error upserting ingredient status:", error.message);
    return null;
  }
  return data;
}

export async function deleteIngredientStatus(
  childId: number,
  ingredientId: number
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
