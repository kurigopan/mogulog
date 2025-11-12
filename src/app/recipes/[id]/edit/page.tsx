"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/features/RecipeForm";
import { useAtomValue, useSetAtom } from "jotai";
import {
  loadingAtom,
  loginDialogSourceAtom,
  userIdAtom,
} from "@/lib/utils/atoms";
import { getRecipeById } from "@/lib/supabase";
import type { Recipe } from "@/types";

export default function RecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const recipeId = Number(unwrapParams.id);
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    if (userId === null) {
      setLoginDialogSource("edit");
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const data = await getRecipeById(userId, recipeId);
        setRecipeData(data);
      } catch (error) {
        // TODO: エラーダイアログ
        alert("処理中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [recipeId]);

  return (
    <>
      <Header title="レシピ編集" />
      {recipeData ? (
        <RecipeForm initialData={recipeData} isEditMode={true} />
      ) : (
        <div className="p-8 text-center text-red-500">
          レシピが見つかりませんでした
        </div>
      )}
      <Footer />
    </>
  );
}
