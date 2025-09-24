import { CardItem, Ingredient, Season } from "@/types/types";
import { getFavoriteRecipeLogs } from "./supabase";

/**
 * UTCの日時をJST（日本標準時）の'YYYY-MM-DD HH:mm:ss'形式の文字列に変換します。
 * @param {Date | string | number} utcDate - 変換したいUTCの日時（Dateオブジェクト、ISO文字列、タイムスタンプなど）。
 * @returns {string} - JSTに変換された日時文字列。
 */
export const convertUtcToJst = (utcDate: string) => {
  // Dateオブジェクトに変換
  const date = new Date(utcDate);

  // 日本のロケールとタイムゾーンを指定してフォーマット
  // hour12: false で24時間表記に
  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // YYYY/MM/DD HH:mm:ss 形式で取得されるので、/ を - に置換
  return new Date(formatter.format(date).replace(/\//g, "-"));
};

// 月齢を計算
export const calculateAgeInMonths = (birthday: string): number | null => {
  const birthDate = new Date(birthday);
  const today = new Date();
  const years = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  const totalMonths = years * 12 + months;
  return totalMonths >= 0 ? totalMonths : null;
};

// 月齢から離乳食の段階を取得
export const getAgeStage = (months: number | null): string => {
  if (months === null) return "未設定";

  if (months <= 4) return "離乳食開始前";
  if (months <= 6) return "初期";
  if (months <= 8) return "中期";
  if (months <= 11) return "後期";
  if (months <= 18) return "完了期";
  return "離乳食終了";
};

// 旬の食材 (月齢と季節を考慮)
export const getSeasonalIngredients = (
  childAgeStage: string,
  allIngredients: Ingredient[]
) => {
  const stages = ["初期", "中期", "後期", "完了期"];
  const currentStageIndex = stages.indexOf(childAgeStage);
  const stagesToInclude = stages.slice(0, currentStageIndex + 1);

  const currentMonth = new Date().getMonth() + 1;
  let season: Season;
  if (currentMonth >= 3 && currentMonth <= 5) season = "春";
  else if (currentMonth >= 6 && currentMonth <= 8) season = "夏";
  else if (currentMonth >= 9 && currentMonth <= 11) season = "秋";
  else season = "冬";

  return allIngredients.filter(
    (ingredient) =>
      stagesToInclude.includes(ingredient.startStage) &&
      ingredient.season.includes(season)
  );
};

// 人気のレシピを計算
export const getPopularRecipes = async (
  allRecipes: CardItem[],
  childAgeStage: string
) => {
  const favoriteRecipeLogs = await getFavoriteRecipeLogs();

  const favoriteCounts = favoriteRecipeLogs.reduce((acc, recipeId) => {
    acc[recipeId] = (acc[recipeId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const sortedRecipeIds = Object.entries(favoriteCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([id]) => parseInt(id, 10));

  return allRecipes
    .filter((recipe) => recipe.startStage === childAgeStage)
    .sort(
      (a, b) => sortedRecipeIds.indexOf(a.id) - sortedRecipeIds.indexOf(b.id)
    )
    .slice(0, 5);
};
