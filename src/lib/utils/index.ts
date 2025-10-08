import React from "react";
import { CardContent, CardItem, ingredientStageInfo } from "@/types";
import { StarIcon, LocalFloristIcon, RecommendIcon } from "@/icons";

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

// 離乳食段階表示に変換する関数（縦揃え対応）
export const getAgeStageDisplay = (stageInfo: ingredientStageInfo[]) => {
  const allStages = ["初期", "中期", "後期", "完了期"];

  // stageInfo からアクティブな stage を抽出
  const activeStages = stageInfo.filter((s) => s.suitable).map((s) => s.stage);

  return allStages.map((stage) => {
    const isActive =
      (stage === "初期" && activeStages.includes("初期")) ||
      (stage === "中期" && activeStages.includes("中期")) ||
      (stage === "後期" && activeStages.includes("後期")) ||
      (stage === "完了期" && activeStages.includes("完了期"));

    return { stage, isActive };
  });
};

export const getCardContents = ({
  popularRecipes,
  seasonalIngredients,
  recommendedRecipes,
}: {
  popularRecipes: CardItem[];
  seasonalIngredients: CardItem[];
  recommendedRecipes: CardItem[];
}): CardContent[] => {
  return [
    {
      id: "popular",
      title: "人気のレシピ",
      icon: React.createElement(StarIcon),
      color: "text-orange-300",
      bgColor: "bg-orange-100",
      cardItems: popularRecipes,
    },
    {
      id: "seasonal",
      title: "旬の食材",
      icon: React.createElement(LocalFloristIcon),
      color: "text-blue-300",
      bgColor: "bg-blue-100",
      cardItems: seasonalIngredients,
    },
    {
      id: "recommended",
      title: "おすすめのレシピ",
      icon: React.createElement(RecommendIcon),
      color: "text-pink-300",
      bgColor: "bg-pink-100",
      cardItems: recommendedRecipes,
    },
  ];
};
