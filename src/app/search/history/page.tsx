"use client";

import { useState, useEffect } from "react";
import React from "react";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { HistoryIcon, DeleteIcon } from "@/icons";
import ListCard from "@/components/ui/listCard";
import { mockRecipes } from "@/mocks/recipes";
import { Recipe } from "@/types/types";

export default function RecentViewed() {
  const [recentItems, setRecentItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent"); // recent, oldest, name, subtitle
  const [filterType, setFilterType] = useState("all"); // all, recipe, ingredient

  useEffect(() => {
    // Simulate API call to fetch recent viewed items
    setLoading(true);
    setTimeout(() => {
      setRecentItems(mockRecipes);
      setLoading(false);
    }, 800);
  }, []);

  const handleClear = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("閲覧履歴をすべて削除しますか？この操作は取り消せません。")
    ) {
      setRecentItems([]);
    }
  };

  const filteredItems = recentItems.filter((item) => {
    if (filterType === "all") return true;
    return filterType === "recipe"
      ? item.category === "レシピ"
      : item.category === "食材";
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
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

  // ヘッダーコンテンツ
  const content = (
    <button
      onClick={(e) => handleClear(e)}
      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
    >
      <DeleteIcon />
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="最近見たもの" content={content} />

      <div className="p-4 space-y-6">
        {/* アイテム一覧 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : sortedItems.length > 0 ? (
          <ListCard listCardItems={sortedItems} pageName="history" />
        ) : recentItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <HistoryIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              閲覧履歴がありません
            </h3>
            <p className="text-stone-500 mb-6">
              レシピや食材を見ると、
              <br />
              こちらに履歴として記録されます。
            </p>
            <Link
              href="/home"
              className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              ホームに戻る
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <HistoryIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              該当する履歴がありません
            </h3>
            <p className="text-stone-500 mb-6">
              選択したフィルターに該当する履歴がありません。
              <br />
              フィルターを変更してみてください。
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
