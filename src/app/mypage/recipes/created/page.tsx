"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { CreateIcon } from "@/icons";
import ListCard from "@/components/ui/listCard";
import { Recipe } from "@/types/types";
import { mockRecipes } from "@/mocks/recipes";

export default function CreatedRecipes() {
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, subtitle

  useEffect(() => {
    // Simulate API call to fetch created recipes
    setLoading(true);
    setTimeout(() => {
      setCreatedRecipes(mockRecipes);
      setLoading(false);
    }, 800);
  }, []);

  const sortedRecipes = [...createdRecipes].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "startStage":
        return a.startStage?.localeCompare(b.startStage);
      default:
        return 0;
    }
  });

  // ソート選択
  const content = (
    <>
      {createdRecipes.length > 0 && (
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-sm text-stone-600 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
        >
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
          <option value="name">名前順</option>
          <option value="subtitle">離乳食段階順</option>
        </select>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="作成したレシピ" content={content} />

      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : sortedRecipes.length > 0 ? (
          <ListCard listCardItems={sortedRecipes} pageName={"created"} />
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <CreateIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              まだレシピを作成していません
            </h3>
            <p className="text-stone-500 mb-6">
              オリジナルのレシピを作成して、
              <br />
              他のママ・パパと共有してみませんか？
            </p>
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              新しいレシピを作成
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
