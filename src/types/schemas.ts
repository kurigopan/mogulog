import { z } from "zod";
import { Season, ingredientNutrition } from "./types";
import { convertUtcToJst } from "@/utils/date";

export const signupSchema = z.object({
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で設定してください" }),
});

export const step1Schema = z.object({
  name: z
    .string()
    .min(2, { message: "ユーザー名は２文字以上で設定してください" }),
  avatar_url: z.url().nullable(),
});

export const step2Schema = z.object({
  childName: z
    .string()
    .min(2, { message: "お子様の名前は２文字以上で設定してください" }),
  childBirthday: z.string().min(1, { message: "誕生日を入力してください" }),
  allergens: z.array(z.string()),
});

// ユニオン型に対応するスキーマ
export const seasonSchema = z.enum(["通年", "春", "夏", "秋", "冬"]);
export const stageSchema = z.enum(["初期", "中期", "後期", "完了期"]);
export const statusSchema = z.enum(["draft", "published"]);
export const categorySchema = z.enum([
  "主食",
  "主菜",
  "副菜",
  "汁物",
  "おやつ",
  "肉・魚",
  "野菜・きのこ・海藻",
  "果物",
  "大豆・豆類",
  "乳製品",
  "卵",
  "その他",
]);

// IngredientNutrition に対応するスキーマ
export const ingredientNutritionSchema = z.object({
  calories: z.string(),
  nutrients: z.array(z.string()),
});

// IngredientStageInfo に対応するスキーマ
export const ingredientStageInfoSchema = z.object({
  stage: stageSchema,
  age: z.enum(["5-6ヶ月", "7-8ヶ月", "9-11ヶ月", "12-18ヶ月"]),
  suitable: z.boolean(),
  amount: z.string(),
  shape: z.string(),
  cooking: z.string(),
  description: z.string(),
});

// 1. データベースから直接取得するデータのスキーマを定義
// APIレスポンスに status情報が含まれるため、rpcIngredientSchemaにリネーム
const dbIngredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(), // DBのカラム名
  category: categorySchema, // DBのカラム名
  start_stage: stageSchema, // DBのカラム名
  seasons: z.array(seasonSchema), // z.enum() を使用
  stage_info: z.array(ingredientStageInfoSchema),
  nutrition: ingredientNutritionSchema,
  tips: z.array(z.string()),
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
});
// カスタム関数が返すデータのZodスキーマを定義
// is_favorite, eaten, ngがBooleanとして含まれる
export const rpcIngredientSchema = dbIngredientSchema.extend({
  is_favorite: z.boolean().nullable(),
  eaten: z.boolean().nullable(),
  ng: z.boolean().nullable(),
});

// 2. rpcIngredientSchemaを使い、.transform()でフロントエンドの型に変換
export const ingredientSchema = rpcIngredientSchema.transform((dbData) => {
  return {
    // --- プロパティ名のマッピング ---
    image: dbData.image_url,
    startStage: dbData.start_stage,
    season: dbData.seasons as Season[],

    // --- 値の変換 ---
    date: new Date(dbData.updated_at),

    // --- 固定値やデフォルト値の追加 ---
    type: "ingredient" as const, // フロントで必要な固定値

    // --- isFavorite, eaten, ngはnullの場合falseに変換 ---
    isFavorite: dbData.is_favorite ?? false,
    eaten: dbData.eaten ?? false,
    ng: dbData.ng ?? false,

    // --- そのまま渡すプロパティ ---
    id: dbData.id,
    name: dbData.name,
    description: dbData.description,
    category: dbData.category,
    stageInfo: dbData.stage_info,
    nutrition: dbData.nutrition as ingredientNutrition,
    tips: dbData.tips,
  };
});

// ingredientsテーブルからのレスポンス全体（配列）のスキーマ
export const ingredientsResponseSchema = z.array(dbIngredientSchema);

// スキーマからTypeScriptの型を推論
export type SupabaseSeason = z.infer<typeof seasonSchema>;
export type Ingredient = z.infer<typeof ingredientSchema>;
export type IngredientNutrition = z.infer<typeof ingredientNutritionSchema>;
export type IngredientStageInfo = z.infer<typeof ingredientStageInfoSchema>;

// RecipeIngredient に対応するスキーマ
export const recipeIngredientSchema = z.object({
  name: z.string(),
  amount: z.string(),
  note: z.string().nullable(),
});

// RecipeStep に対応するスキーマ
export const recipeStepSchema = z.object({
  step: z.number(),
  description: z.string(),
  image: z.string().nullable(),
});

// 1.データベースから直接取得するレシピデータのスキーマを定義
// APIレスポンスに status情報が含まれるため、rpcIngredientSchemaにリネーム
export const dbRecipeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(),
  cooking_time: z.string().nullable(),
  is_private: z.boolean(),
  category: categorySchema,
  servings: z.string().nullable(),
  memo: z.string().nullable(),
  tags: z.array(z.string()),
  ingredients: z.array(recipeIngredientSchema),
  steps: z.array(recipeStepSchema),
  start_stage: stageSchema,
  // status: statusSchema,
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
});
// カスタム関数が返すデータのZodスキーマを定義
// is_favoriteがBooleanとして含まれる
export const rpcRecipeSchema = dbRecipeSchema.extend({
  is_favorite: z.boolean().nullable(),
  is_own: z.boolean(),
});

// 2.rpcRecipeSchemaを使い、.transform()でフロントエンドの型に変換
export const recipeSchema = rpcRecipeSchema.transform((dbData) => {
  return {
    // --- プロパティ名のマッピング ---
    image: dbData.image_url,
    startStage: dbData.start_stage,
    cookingTime: dbData.cooking_time,
    isPrivate: dbData.is_private,
    author: dbData.created_by,
    savedMemo: dbData.memo,

    // --- 値の変換 ---
    date: convertUtcToJst(dbData.updated_at),

    // --- 固定値やデフォルト値の追加 ---
    type: "recipe" as const, // フロントで必要な固定値

    // --- isFavoriteはnullの場合falseに変換 ---
    isFavorite: dbData.is_favorite ?? false,
    isOwn: dbData.is_own ?? false,

    // --- そのまま渡すプロパティ ---
    id: dbData.id,
    name: dbData.name,
    description: dbData.description,
    category: dbData.category,
    servings: dbData.servings,
    tags: dbData.tags,
    ingredients: dbData.ingredients,
    steps: dbData.steps,
    // status: dbData.status,
  };
});
