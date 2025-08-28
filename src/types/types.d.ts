// export interface Ingredient {
//   id: number;
//   name: string;
//   image: string;
//   category: string;
//   suitableAges: string[];
//   description: string;
//   eaten: boolean;
//   ng: boolean;
// }
// export interface Ingredient1 {
//   type: Type[];
//   id: number;
//   name: string;
//   image: string;
//   category: string;
//   stages: Stage[];
//   description: string;
//   eaten: boolean;
//   ng: boolean;
//   season: Season[];
//   ageInfo: ingredientAgeInfo[];
//   nutrition: ingredientNutrition[];
//   tips: string[];
// }

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

// export interface CardItem {
//   id: number;
//   name: string;
//   image: string;
//   subtitle: string;
//   description: string;
// }

// export interface Base {
//   id: number;
//   name: string;
//   image: string;
//   subtitle: string;
//   description: string;
//   category: string;
// }

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

// export interface Recipe extends Base {
//   date: Date;
//   isFavorite: boolean;
//   stage: Stage[];
//   cookingTime: string;
//   servings: string;
//   ingredients: recipeIngredient[];
//   steps: recipeStep[];
//   tags: string[];
//   isPrivate: boolean;
//   author: string;
//   isOwn: boolean;
//   savedMemo: string;
// }

// export interface ListCardItem extends Base {
//   date?: Date;
//   type?: "recipe" | "ingredient";
//   isFavorite: boolean;
// }

export interface CardItem {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  type: Type;
  startStage: Stage;
  isFavorite: boolean;
}

export interface ListCardItem extends CardItem {
  date?: Date;
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
