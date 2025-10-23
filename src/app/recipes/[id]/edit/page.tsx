"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/features/RecipeForm";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  loadingAtom,
  loginDialogSourceAtom,
  userIdAtom,
} from "@/lib/utils/atoms";
import { getRecipeById } from "@/lib/supabase";
import { Recipe } from "@/types";

export default function RecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const [isLoading, setIsLoading] = useAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const recipeId = Number(unwrapParams.id);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!isLoading && !userId) {
      setLoginDialogSource("edit");
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      const data = await getRecipeById(userId, recipeId);
      if (!data) {
        console.error("レシピの取得に失敗しました:");
      } else {
        setRecipeData(data);
      }
      setIsLoading(false);
    };
    fetchRecipe();
  }, [recipeId]);

  return (
    <>
      <Header title="レシピ編集" />
      {recipeData ? (
        <RecipeForm initialData={recipeData} isEditMode={true} />
      ) : (
        <div className="p-8 text-center text-red-500">
          レシピが見つかりませんでした。
        </div>
      )}
      <Footer pageName="edit" />
    </>
  );
}
