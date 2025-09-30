export interface CardItem {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  category: Category;
  type: Type;
  startStage: Stage;
  date: Date;
}

export interface ListCardItem extends CardItem {
  isFavorite: boolean;
}

export interface Ingredient extends ListCardItem {
  eaten: boolean;
  ng: boolean;
  season: Season[];
  stageInfo: ingredientStageInfo[];
  nutrition: ingredientNutrition;
  tips: string[];
}

export interface Recipe extends ListCardItem {
  cookingTime: string | null;
  servings: string | null;
  ingredients: recipeIngredient[];
  steps: recipeStep[];
  tags: string[];
  isPrivate: boolean;
  author: string;
  isOwn: boolean;
  savedMemo: string | null;
  // status: Status;
}
interface ingredientStageInfo {
  stage: Stage;
  age: Age;
  suitable: boolean;
  amount: string;
  shape: string;
  cooking: string;
  description: string;
}
interface ingredientNutrition {
  calories: string;
  nutrients: string[];
}

interface recipeStep {
  step: number;
  description: string;
  image: string | null;
}

interface recipeIngredient {
  name: string;
  amount: string;
  note: string | null;
}

export interface Allergen {
  id: number;
  name: string;
  variants: string[];
}

export type Category =
  | "主食"
  | "主菜"
  | "副菜"
  | "汁物"
  | "おやつ"
  | "肉・魚"
  | "野菜・きのこ・海藻"
  | "果物"
  | "大豆・豆類"
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
export type Age = "5-6ヶ月" | "7-8ヶ月" | "9-11ヶ月" | "12-18ヶ月";
export type Season = "春" | "夏" | "秋" | "冬";
// export type Status = "draft" | "published";
type Type = "recipe" | "ingredient";

export interface User {
  id?: string;
  email: string;
  password: string;
}

// `profiles` テーブルに対応する型
export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_by: string;
  updated_by: string;
}

// `children` テーブルに対応する型
export interface Child {
  id?: number;
  parent_id: string;
  name: string;
  birthday: string;
  created_by: string;
  updated_by: string;
}

export interface ChildAllergens {
  id?: number;
  child_id: number;
  allergen_id: number;
  created_by: string;
  updated_by: string;
}

export interface FormData {
  name: Profile["name"];
  avatar_url: Profile["avatar_url"];
  childName: Child["name"];
  childBirthday: Child["birthday"];
  allergens: Child["allergens"];
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
  allergens: Child["allergens"];
}

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

export interface FavoritesRecipes {
  parent_id: string;
  recipe_id: number;
  created_by: string;
  updated_by: string;
}
export interface FavoritesIngredients {
  parent_id: string;
  ingredient_id: number;
  created_by: string;
  updated_by: string;
}

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

export type FavoriteUpdate = {
  itemId: number;
  itemType: string;
  isFavorited: boolean;
  timestamp: number;
} | null;

export interface CardContent {
  id: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  cardItems: CardItem[];
}
