"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/features/RecipeForm";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/atoms";
import { getRecipeById } from "@/lib/supabase/supabase";
import { Recipe } from "@/types/types";

export default function RecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const recipeId = Number(unwrapParams.id);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      const data = await getRecipeById(userId, recipeId);
      if (!data) {
        console.error("レシピの取得に失敗しました:");
        // エラー処理（例：ユーザーに通知、トップページへリダイレクト）
      } else if (data) {
        setRecipeData(data);
      }
      setIsLoading(false);
    };
    fetchRecipe();
  }, [recipeId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ編集" />
      {/* ローディング中はメッセージを表示、データ取得後はフォームを表示 */}
      {recipeData ? (
        <RecipeForm initialData={recipeData} isEditMode={true} />
      ) : (
        <div className="p-8 text-center text-red-500">
          レシピが見つかりませんでした。
        </div>
      )}
      <Footer pageName="edit" />
    </div>
  );
}
