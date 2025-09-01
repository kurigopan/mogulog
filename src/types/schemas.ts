import { z } from "zod";
import { Season, ingredientNutrition } from "./types";

// IngredientNutrition に対応するスキーマ
export const ingredientNutritionSchema = z.object({
  calories: z.string(),
  nutrients: z.array(z.string()),
});

// IngredientStageInfo に対応するスキーマ
export const ingredientStageInfoSchema = z.object({
  stage: z.enum(["初期", "中期", "後期", "完了期"]),
  age: z.enum(["5-6ヶ月", "7-8ヶ月", "9-11ヶ月", "12-18ヶ月"]),
  suitable: z.boolean(),
  amount: z.string(),
  shape: z.string(),
  cooking: z.string(),
  description: z.string(),
});

// Seasonのユニオン型に対応するスキーマ
export const seasonSchema = z.enum(["通年", "春", "夏", "秋", "冬"]);
export const stageSchema = z.enum(["初期", "中期", "後期", "完了期"]);

// 1. データベースから直接取得するデータのスキーマを定義
// APIレスポンスに status情報が含まれるため、rpcIngredientSchemaにリネーム
const dbIngredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().nullable(), // DBのカラム名
  category: z.string(),
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

// 2. dbIngredientSchemaを使い、.transform()でフロントエンドの型に変換
export const ingredientSchema = rpcIngredientSchema.transform((dbData) => {
  return {
    // --- プロパティ名のマッピング ---
    image: dbData.image_url,
    startStage: dbData.start_stage,
    season: dbData.seasons as Season[],

    // --- 値の変換 ---
    date: new Date(dbData.created_at),

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
