"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DraftsIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { Recipe } from "@/types";
import { mockRecipes } from "@/mocks/recipes";

export default function DraftRecipes() {
  const setIsLoading = useSetAtom(loadingAtom);
  const [draftRecipes, setDraftRecipes] = useState<Recipe[]>([]);
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name, subtitle

  const sortedRecipes = [...draftRecipes].sort((a, b) => {
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

  useEffect(() => {
    // Simulate API call to fetch draft recipes
    setIsLoading(true);
    setTimeout(() => {
      setDraftRecipes(mockRecipes);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <>
      <Header title="下書きレシピ" />

      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {sortedRecipes.length > 0 ? (
          <ListCard cardItems={sortedRecipes} pageName={"drafts"} />
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <DraftsIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              下書きのレシピがありません
            </h3>
            <p className="text-stone-500 mb-6">
              レシピを作成中に保存すると、
              <br />
              こちらに下書きとして保存されます。
            </p>
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-6 py-3 bg-violet-500 text-white rounded-2xl hover:bg-violet-600 transition-colors font-medium"
            >
              新しいレシピを作成
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
