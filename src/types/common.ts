import { Profile, Child } from "@/types";
import { ListCardItem } from "@/types";

export interface User {
  id?: string;
  email: string;
  password: string;
}

export type Category =
  | "主食"
  | "主菜"
  | "副菜"
  | "汁物"
  | "おやつ"
  | "穀類"
  | "肉"
  | "魚"
  | "野菜"
  | "きのこ"
  | "海藻"
  | "果物"
  | "豆類"
  | "乳製品"
  | "卵"
  | "その他";

export type Stage =
  | "離乳食開始前"
  | "初期"
  | "中期"
  | "後期"
  | "完了期"
  | "離乳食終了";

export type Season = "春" | "夏" | "秋" | "冬";

export type Type = "recipe" | "ingredient";

export type TableName =
  | "recipes"
  | "ingredients"
  | "favorites"
  | "profiles"
  | "children"
  | "child_allergens"
  | "allergens"
  | "favorites_recipes"
  | "favorites_ingredients";

export type PageName =
  | "home"
  | "ingredientDetail"
  | "recipeDetail"
  | "favorites"
  | "drafts"
  | "created"
  | "edit"
  | "history"
  | "search"
  | "ingredientsList";

export interface FormData {
  name: Profile["name"];
  avatar_url: Profile["avatar_url"];
  childName: Child["name"];
  childBirthday: Child["birthday"];
  allergens: number[];
}

export interface ParentInfo {
  id: Profile["id"];
  name: Profile["name"];
  avatar_url: Profile["avatar_url"];
  email: User["email"];
  joinDate: Profile["created_at"];
}

export interface ChildInfo {
  id: Child["id"];
  name: Child["name"];
  birthday: Child["birthday"];
  age: string;
  ageStage: string;
  allergens: number[];
}

export type FavoriteUpdate = {
  itemId: number;
  itemType: string;
  isFavorited: boolean;
  timestamp: number;
} | null;

export type SearchState = {
  query: string;
  results: ListCardItem[];
  allergenExclusions: Record<string, boolean>;
};
