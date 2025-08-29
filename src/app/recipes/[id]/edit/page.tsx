"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeForm from "@/components/recipeForm";
import { mockRecipes } from "@/mocks/recipes";

// レシピ編集ページのコンポーネント
export default function RecipeEditPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ編集" />
      {/* RecipeFormコンポーネントを呼び出し、既存データを渡します */}
      <RecipeForm initialData={mockRecipes[0]} isEditMode={true} />
      <Footer />
    </div>
  );
}
