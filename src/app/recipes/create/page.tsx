"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/RecipeForm";

// レシピ作成ページのコンポーネント
export default function RecipeCreatePage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ作成" />
      {/* RecipeFormコンポーネントを呼び出し、初期データはnullで渡します */}
      <RecipeForm initialData={null} isEditMode={false} />
      <Footer pageName="create" />
    </div>
  );
}
