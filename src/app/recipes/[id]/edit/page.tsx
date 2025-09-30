"use client";

import { use, useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/RecipeForm";
import { getRecipeById } from "@/lib/supabase";
import { Recipe } from "@/types/types";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/atoms";

export default function RecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const recipeId = Number(unwrapParams.id);
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  const setLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      const data = await getRecipeById(userId, recipeId);
      if (!data) {
        console.error("レシピの取得に失敗しました:");
        // エラー処理（例：ユーザーに通知、トップページへリダイレクト）
      } else if (data) {
        setRecipeData(data);
      }
      setLoading(false);
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
