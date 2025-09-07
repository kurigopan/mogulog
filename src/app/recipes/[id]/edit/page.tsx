"use client";

import { use, useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/RecipeForm";
import { getRecipeById } from "@/lib/supabase";
import { Recipe } from "@/types/types";

export default function RecipeEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const recipeId = Number(unwrapParams.id);

  // 取得したレシピデータを保持するstate
  const [recipeData, setRecipeData] = useState<Recipe | null>(null);
  // ローディング状態を管理するstate
  const [isLoading, setIsLoading] = useState(true);

  // コンポーネントがマウントされた時にレシピデータをフェッチ
  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true);
      try {
        const data = await getRecipeById(
          "32836782-4f6d-4dc3-92ea-4faf03ed86a5",
          recipeId
        );
        if (!data) {
          console.error("レシピの取得に失敗しました:");
          // エラー処理（例：ユーザーに通知、トップページへリダイレクト）
        } else if (data) {
          setRecipeData(data[0]); // 1つ目が該当のデータのはず
        }
      } catch (e) {
        console.error("レシピの取得中にエラーが発生しました:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ編集" />
      {/* ローディング中はメッセージを表示、データ取得後はフォームを表示 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <CircularProgress color="secondary" />
        </div>
      ) : recipeData ? (
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
