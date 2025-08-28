"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeForm from "@/components/recipeForm";
import { ArrowBackIosIcon } from "@/icons";

// レシピ作成ページのコンポーネント
export default function RecipeCreatePage() {
  const content = (
    <div className="flex items-center space-x-2">
      {/* 画面右側にボタンなどを配置する場合はここに記述します */}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        icon={<ArrowBackIosIcon />}
        title="レシピ作成"
        content={content}
      />
      {/* RecipeFormコンポーネントを呼び出し、初期データはnullで渡します */}
      <RecipeForm initialData={null} isEditMode={false} />
      <Footer />
    </div>
  );
}
