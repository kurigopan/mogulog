"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { useAtomValue, useSetAtom } from "jotai";
import { childAgeStageAtom, loadingAtom } from "@/lib/utils/atoms";
import {
  getPopularRecipes,
  getRecommendedRecipes,
  getSeasonalIngredients,
} from "@/lib/supabase";
import { getCardContents } from "@/lib/utils";
import type { CardContent } from "@/types";

type AgeFilteredContentProps = {
  initialCardContents: CardContent[];
};

export default function AgeFilteredContent({
  initialCardContents,
}: AgeFilteredContentProps) {
  const setIsLoading = useSetAtom(loadingAtom);
  const currentActiveAgeStage = useAtomValue(childAgeStageAtom);
  const [cardContents, setCardContents] =
    useState<CardContent[]>(initialCardContents);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!currentActiveAgeStage) {
        return;
      }

      if (
        initialCardContents.length === 0 ||
        currentActiveAgeStage !== cardContents[0]?.id.split("-")[0]
      ) {
        setIsLoading(true);
        const age = currentActiveAgeStage;

        try {
          const [popularRecipes, seasonalIngredients, recommendedRecipes] =
            await Promise.all([
              getPopularRecipes(age),
              getSeasonalIngredients(age),
              getRecommendedRecipes(age),
            ]);

          if (isMounted) {
            const newCardContents = getCardContents({
              popularRecipes: popularRecipes,
              seasonalIngredients: seasonalIngredients,
              recommendedRecipes: recommendedRecipes,
            });
            setCardContents(newCardContents);
          }
        } catch (error) {
          if (isMounted) {
            console.error("Error fetching filtered data:", error);
          }
          // TODO: エラーダイアログ
          alert("処理中にエラーが発生しました。");
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [currentActiveAgeStage]);

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
