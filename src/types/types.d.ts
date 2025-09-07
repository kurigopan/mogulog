export interface CardItem {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  category: Category;
  type: Type;
  startStage: Stage;
  isFavorite: boolean;
  date: Date;
}

export interface Ingredient extends CardItem {
  eaten: boolean;
  ng: boolean;
  season: Season[];
  stageInfo: ingredientStageInfo[];
  nutrition: ingredientNutrition;
  tips: string[];
}

export interface Recipe extends CardItem {
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
export type Stage = "初期" | "中期" | "後期" | "完了期";
export type Age = "5-6ヶ月" | "7-8ヶ月" | "9-11ヶ月" | "12-18ヶ月";
export type Season = "通年" | "春" | "夏" | "秋" | "冬";
// export type Status = "draft" | "published";
type Type = "recipe" | "ingredient";
