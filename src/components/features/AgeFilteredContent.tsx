"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import {
  getPopularRecipes,
  getRecommendedRecipes,
  getSeasonalIngredients,
} from "@/lib/supabase";
import { getCardContents } from "@/lib/utils";
import { CardContent } from "@/types/types";

type AgeFilteredContentProps = {
  currentActiveAgeStage: string;
  initialCardContents: CardContent[];
};

export default function AgeFilteredContent({
  currentActiveAgeStage,
  initialCardContents,
}: AgeFilteredContentProps) {
  const setIsLoading = useSetAtom(loadingAtom);
  const [cardContents, setCardContents] =
    useState<CardContent[]>(initialCardContents);

  // currentActiveAgeStageの変更を監視し、データフェッチを行う
  useEffect(() => {
    // 初回レンダリング時、または月齢が変更された場合にデータをフェッチ
    // initialCardContentsが空の場合もフェッチ
    if (
      initialCardContents.length === 0 ||
      currentActiveAgeStage !== cardContents[0]?.id.split("-")[0]
    ) {
      fetchFilteredData(currentActiveAgeStage);
    }
  }, [currentActiveAgeStage]);

  // クライアントサイドでデータをフェッチする関数
  const fetchFilteredData = async (age: string) => {
    setIsLoading(true);
    try {
      const [popularRecipes, seasonalIngredients, recommendedRecipes] =
        await Promise.all([
          getPopularRecipes(age),
          getSeasonalIngredients(age),
          getRecommendedRecipes(age),
        ]);
      const cardContents = getCardContents({
        popularRecipes: popularRecipes,
        seasonalIngredients: seasonalIngredients,
        recommendedRecipes: recommendedRecipes,
      });
      setCardContents(cardContents);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    } finally {
      setIsLoading(false);
    }
  }; // 依存配列は空でOK、あるいは必要な場合は追加

  return (
    <section>
      <div className="space-y-4">
        {cardContents.map((content) => (
          <div key={content.id}>
            <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
              <div className={`mr-2 ${content.color}`}>{content.icon}</div>
              {content.title}
            </h2>
            <Card cardItems={content.cardItems} className={content.bgColor} />
          </div>
        ))}
      </div>
    </section>
  );
}
