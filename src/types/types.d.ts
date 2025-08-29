export interface CardItem {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
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
  date: Date;
  isFavorite: boolean;
  cookingTime: string;
  servings: string;
  ingredients: recipeIngredient[];
  steps: recipeStep[];
  tags: string[];
  isPrivate: boolean;
  author: string;
  isOwn: boolean;
  savedMemo: string;
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
  title: string;
  description: string;
  time: string;
  image?: string;
}

interface recipeIngredient {
  name: string;
  amount: string;
  note: string;
}

type Type = "recipe" | "ingredient";
type Stage = "初期" | "中期" | "後期" | "完了期";
type Age = "5-6ヶ月" | "7-8ヶ月" | "9-11ヶ月" | "12-18ヶ月";
type Season = "通年" | "春" | "夏" | "秋" | "冬";
