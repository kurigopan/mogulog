"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { ArrowBackIosIcon, HistoryIcon } from "@/icons";
import ListCard from "@/components/ui/listCard";
import { Recipe } from "@/types/types";
import { mockRecipes } from "@/mocks/recipes";

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

  const handleClearHistory = () => {
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

  // const formatViewDate = (date: Date) => {
  //   const now = new Date();
  //   const diffMs = now.getTime() - date.getTime();
  //   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  //   const diffDays = Math.floor(diffHours / 24);

  //   if (diffHours < 1) {
  //     const diffMinutes = Math.floor(diffMs / (1000 * 60));
  //     return `${diffMinutes}分前`;
  //   } else if (diffHours < 24) {
  //     return `${diffHours}時間前`;
  //   } else if (diffDays === 1) {
  //     return "昨日";
  //   } else {
  //     return `${diffDays}日前`;
  //   }
  // };

  // ヘッダーコンテンツ
  const content = (
    <div className="flex items-center space-x-2">
      {recentItems.length > 0 && (
        <>
          {/* フィルター選択 */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm text-stone-600 bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
          >
            <option value="all">すべて</option>
            <option value="recipe">レシピ</option>
            <option value="ingredient">食材</option>
          </select>

          {/* ソート選択 */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm text-stone-600 bg-white border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
          >
            <option value="recent">最近見た順</option>
            <option value="oldest">古い順</option>
            <option value="name">名前順</option>
            <option value="subtitle">段階/月齢順</option>
          </select>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header icon={<ArrowBackIosIcon />} title="最近見た" content={content} />

      <div className="p-4 space-y-6">
        {/* 履歴クリアボタン */}
        {recentItems.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-stone-500">
              {filteredItems.length}件の履歴があります
            </p>
            <button
              onClick={handleClearHistory}
              className="text-sm text-red-500 hover:text-red-600 transition-colors underline"
            >
              履歴をクリア
            </button>
          </div>
        )}

        {/* アイテム一覧 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : sortedItems.length > 0 ? (
          <ListCard listCardItems={sortedItems} pageName="search" />
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
