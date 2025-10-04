import { supabase } from "@/lib/supabase/client";
import {
  FavoritesIngredients,
  FavoritesRecipes,
  Type,
  TableName,
} from "@/types/types";

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
