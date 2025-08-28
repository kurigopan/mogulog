"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeForm from "@/components/recipeForm";
import { ArrowBackIosIcon } from "@/icons";
import { mockRecipes } from "@/mocks/recipes";

// レシピ編集ページのコンポーネント
export default function RecipeEditPage() {
  const content = (
    <div className="flex items-center space-x-2">
      {/* 画面右側にボタンなどを配置する場合はここに記述します */}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        icon={<ArrowBackIosIcon />}
        title="レシピ編集"
        content={content}
      />
      {/* RecipeFormコンポーネントを呼び出し、既存データを渡します */}
      <RecipeForm initialData={mockRecipes[0]} isEditMode={true} />
      <Footer />
    </div>
  );
}
