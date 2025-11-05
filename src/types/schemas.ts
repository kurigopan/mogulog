import { z } from "zod";
import { convertUtcToJst } from "@/lib/utils";
import type { Recipe, Season, ingredientNutrition } from "@/types";

export const emailSchema = z.object({
  email: z.email({
    message: "有効なメールアドレスを入力してください",
  }),
});
export const passwordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "パスワードは6文字以上で設定してください" }),
});
export const registerSchema = emailSchema.and(passwordSchema);

export const parentSchema = z.object({
  name: z
    .string()
    .min(2, { message: "ユーザー名は２文字以上で設定してください" }),
  avatar_url: z.url().nullable(),
});

export const childCreateSchema = z.object({
  childName: z
    .string()
    .min(2, { message: "お子様の名前は２文字以上で設定してください" }),
  childBirthday: z.string().min(1, { message: "誕生日を入力してください" }),
  allergens: z.array(z.number()),
});

export const childUpdateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "お子様の名前は２文字以上で設定してください" }),
  birthday: z.string().min(1, { message: "誕生日を入力してください" }),
  allergens: z.array(z.number()),
});

export type EmailForm = z.infer<typeof emailSchema>;
export type PasswordForm = z.infer<typeof passwordSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ParentForm = z.infer<typeof parentSchema>;
export type ChildCreateForm = z.infer<typeof childCreateSchema>;
export type ChildUpdateForm = z.infer<typeof childUpdateSchema>;

export const recipeIngredientSchema = z.object({
  name: z.string().min(1, "材料名を入力してください"),
  amount: z.string().min(1, "分量を入力してください"),
  note: z.string().nullable(),
});

export const recipeStepSchema = z.object({
  step: z.number().min(1),
  description: z.string().min(1, "作り方を入力してください"),
});

export const recipeFormSchema = z.object({
  name: z.string().min(1, "レシピ名を入力してください"),
  image: z.string().optional(),
  startStage: z
    .enum(["初期", "中期", "後期", "完了期"])
    .refine((val) => !!val, { message: "時期を選択してください" }),
  category: z
    .enum(["主食", "主菜", "副菜", "汁物", "おやつ"])
    .refine((val) => !!val, { message: "カテゴリーを選択してください" }),
  cookingTime: z.string().optional(),
  servings: z.string().optional(),
  description: z
    .string()
    .max(500, "説明は500文字以内で入力してください")
    .optional(),
  ingredients: z
    .array(recipeIngredientSchema)
    .min(1, "少なくとも1つの材料を入力してください"),
  steps: z
    .array(recipeStepSchema)
    .min(1, "少なくとも1つの作り方を入力してください"),
  tags: z.array(z.string()).optional(),
  isPrivate: z.boolean().optional(),
  savedMemo: z.string().optional(),
});

export type RecipeForm = z.infer<typeof recipeFormSchema>;

// ユニオン型に対応するスキーマ
export const seasonSchema = z.enum(["通年", "春", "夏", "秋", "冬"]);
export const stageSchema = z.enum(["初期", "中期", "後期", "完了期"]);
export const categorySchema = z.enum([
  "主食",
  "主菜",
  "副菜",
  "汁物",
  "おやつ",
  "肉",
  "魚",
  "野菜",
  "きのこ",
  "海藻",
  "果物",
  "豆類",
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
export const dbIngredientCardSchema = z.object({
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
export const rpcIngredientListCardSchema = dbIngredientCardSchema.extend({
  is_favorite: z.boolean().nullable(),
});
export const rpcIngredientDetailSchema = dbIngredientCardSchema.extend({
  is_favorite: z.boolean().nullable(),
  eaten: z.boolean().nullable(),
  ng: z.boolean().nullable(),
});

// 2. rpcIngredientSchemaを使い、.transform()でフロントエンドの型に変換
const ingredientSchema = (dbData: z.infer<typeof dbIngredientCardSchema>) => ({
  // --- プロパティ名のマッピング ---
  image: dbData.image_url,
  startStage: dbData.start_stage,
  season: dbData.seasons as Season[],

  // --- 値の変換 ---
  date: new Date(dbData.updated_at),

  // --- 固定値やデフォルト値の追加 ---
  type: "ingredient" as const, // フロントで必要な固定値

  // --- そのまま渡すプロパティ ---
  id: dbData.id,
  name: dbData.name,
  description: dbData.description,
  category: dbData.category,
  stageInfo: dbData.stage_info,
  nutrition: dbData.nutrition as ingredientNutrition,
  tips: dbData.tips,
});
export const ingredientCardSchema =
  dbIngredientCardSchema.transform(ingredientSchema);
export const ingredientListCardSchema = rpcIngredientListCardSchema.transform(
  (dbData) => ({
    ...ingredientSchema(dbData),
    isFavorite: dbData.is_favorite ?? false,
  }),
);
export const ingredientDetailSchema = rpcIngredientDetailSchema.transform(
  (dbData) => ({
    ...ingredientSchema(dbData),
    isFavorite: dbData.is_favorite ?? false,
    eaten: dbData.eaten ?? false,
    ng: dbData.ng ?? false,
  }),
);

// ingredientsテーブルからのレスポンス全体（配列）のスキーマ
// export const ingredientsResponseSchema = z.array(dbIngredientCardSchema);

// スキーマからTypeScriptの型を推論
// export type SupabaseSeason = z.infer<typeof seasonSchema>;
// export type Ingredient = z.infer<typeof ingredientSchema>;
// export type IngredientNutrition = z.infer<typeof ingredientNutritionSchema>;
// export type IngredientStageInfo = z.infer<typeof ingredientStageInfoSchema>;

// 1.データベースから直接取得するレシピデータのスキーマを定義
export const dbRecipeCardSchema = z.object({
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
  created_at: z.string(),
  created_by: z.string(),
  updated_at: z.string(),
  updated_by: z.string(),
});
// カスタム関数が返すデータのZodスキーマを定義
export const rpcRecipeListCardSchema = dbRecipeCardSchema.extend({
  is_favorite: z.boolean().nullable(),
});
export const rpcRecipeDetailSchema = dbRecipeCardSchema.extend({
  is_favorite: z.boolean().nullable(),
  is_own: z.boolean().nullable(),
  author: z.string(),
});

// 2.rpcRecipeSchemaを使い、.transform()でフロントエンドの型に変換
const recipeSchema = (dbData: z.infer<typeof dbRecipeCardSchema>) => ({
  // --- プロパティ名のマッピング ---
  image: dbData.image_url,
  startStage: dbData.start_stage,
  cookingTime: dbData.cooking_time,
  isPrivate: dbData.is_private,
  savedMemo: dbData.memo,

  // --- 値の変換 ---
  date: convertUtcToJst(dbData.updated_at),

  // --- 固定値やデフォルト値の追加 ---
  type: "recipe" as const,

  // --- そのまま渡すプロパティ ---
  id: dbData.id,
  name: dbData.name,
  description: dbData.description,
  category: dbData.category,
  servings: dbData.servings,
  tags: dbData.tags,
  ingredients: dbData.ingredients,
  steps: dbData.steps,
});
export const recipeCardSchema = dbRecipeCardSchema.transform(recipeSchema);
export const recipeListCardSchema = rpcRecipeListCardSchema.transform(
  (dbData) => ({
    ...recipeSchema(dbData),
    isFavorite: dbData.is_favorite ?? false,
  }),
);
export const recipeDetailSchema = rpcRecipeDetailSchema.transform((dbData) => ({
  ...recipeSchema(dbData),
  isFavorite: dbData.is_favorite ?? false,
  isOwn: dbData.is_own ?? false,
  author: dbData.author,
}));

export function formatRecipeForSupabase(
  recipe: Omit<Recipe, "id">,
  userId: string,
) {
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
      JSON.parse(JSON.stringify(ing)),
    ),
    steps: recipe.steps.map((step) => JSON.parse(JSON.stringify(step))),
    created_by: userId,
    updated_by: userId,
  };
}
