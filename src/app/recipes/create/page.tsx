"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/features/RecipeForm";

// レシピ作成ページのコンポーネント
export default function RecipeCreatePage() {
  return (
    <>
      <Header title="レシピ作成" />
      {/* RecipeFormコンポーネントを呼び出し、初期データはnullで渡します */}
      <RecipeForm initialData={null} isEditMode={false} />
      <Footer pageName="create" />
    </>
  );
}
