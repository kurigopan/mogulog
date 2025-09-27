"use client";

import { useEffect, useState } from "react";
import { RecommendIcon } from "@/icons";
import Card from "@/components/ui/Card";
import { CardItem } from "@/types/types";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { getRecommendedRecipes } from "@/lib/supabase";

type RecommendedRecipesProps = {
  childAgeStage: string;
};

export default function RecommendedRecipes({
  childAgeStage,
}: RecommendedRecipesProps) {
  const [recommendedRecipes, setRecommendedRecipes] = useState<CardItem[]>([]);
  const setLoading = useSetAtom(loadingAtom);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const recipes = await getRecommendedRecipes(childAgeStage);
        if (recipes) {
          setRecommendedRecipes(recipes);
        }
      } catch {
        setError("予期せぬエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [childAgeStage]);

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
