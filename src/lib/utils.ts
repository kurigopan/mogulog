import { Recipe } from "@/types/types";

/**
 * フロントエンドのレシピデータをSupabaseのデータベースの形式に変換する
 * @param recipe - 変換するレシピデータ（IDを除く）
 * @returns Supabaseのrecipesテーブルに挿入可能なデータ
 */
export function formatRecipeForSupabase(recipe: Omit<Recipe, "id">) {
  // フロントエンドのcamelCaseキーをデータベースのsnake_caseキーにマッピング
  // ingredientsとstepsはJSONBカラムなので、JSON.stringifyで文字列に変換
  return {
    name: recipe.name,
    image_url: recipe.image,
    description: recipe.description,
    category: recipe.category,
    start_stage: recipe.startStage,
    cooking_time: recipe.cookingTime,
    servings: recipe.servings,
    tags: recipe.tags,
    is_private: recipe.isPrivate,
    memo: recipe.savedMemo,
    // status: recipe.status,
    ingredients: recipe.ingredients.map((ing) =>
      JSON.parse(JSON.stringify(ing))
    ),
    steps: recipe.steps.map((step) => JSON.parse(JSON.stringify(step))),
    // created_byとupdated_byはSupabaseのAuthから取得するか、データベースのトリガーで自動設定されることが一般的です
    // 今回は例としてハードコードしておきます。
    created_by: "32836782-4f6d-4dc3-92ea-4faf03ed86a5",
    updated_by: "32836782-4f6d-4dc3-92ea-4faf03ed86a5",
  };
}
