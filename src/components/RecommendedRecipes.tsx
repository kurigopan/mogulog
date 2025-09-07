"use client";

import { useEffect, useState } from "react";
import { RecommendIcon } from "@/icons";
import Card from "@/components/ui/Card";
import { Recipe } from "@/types/types";

type RecommendedRecipesProps = {
  allRecipes: Recipe[];
  childAgeStage: string;
};

export default function RecommendedRecipes({
  allRecipes,
  childAgeStage,
}: RecommendedRecipesProps) {
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    // 子どもの月齢でフィルター
    const filteredRecipes = allRecipes.filter(
      (recipe) => recipe.startStage === childAgeStage
    );
    // シャッフルして先頭5件を推薦レシピに設定
    const shuffled = [...filteredRecipes].sort(() => 0.5 - Math.random());
    setRecommendedRecipes(shuffled.slice(0, 5));
  }, [allRecipes, childAgeStage]);

  return (
    <>
      {recommendedRecipes.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-pink-300 mr-2">
              <RecommendIcon />
            </div>
            おすすめのレシピ
          </h2>
          <Card cardItems={recommendedRecipes} className="bg-pink-100" />
        </section>
      )}
    </>
  );
}
