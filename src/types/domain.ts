import { ListCardItem } from "@/types/ui";

export interface ingredientStageInfo {
  stage: string;
  age: string;
  suitable: boolean;
  amount: string;
  shape: string;
  cooking: string;
  description: string;
}

export interface ingredientNutrition {
  calories: string;
  nutrients: string[];
}

export interface recipeStep {
  step: number;
  description: string;
}

export interface recipeIngredient {
  name: string;
  amount: string;
  note: string | null;
}

export interface Allergen {
  id: number;
  name: string;
  variants: string[];
}

export interface Ingredient extends ListCardItem {
  eaten: boolean;
  ng: boolean;
  season: string[];
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
}
