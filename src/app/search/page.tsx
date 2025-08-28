"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ListCard from "@/components/ui/listCard";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { SearchIcon, ArrowBackIosIcon } from "@/icons";
import { ListCardItem } from "@/types/types";
import { mockListCardItems } from "@/mocks/listCardItems";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<ListCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, recipe, ingredient
  const [sortBy, setSortBy] = useState("relevance"); // relevance, name, age

  useEffect(() => {
    if (query) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const filtered = mockListCardItems.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 500);
    }
  }, [query]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const filteredResults = results.filter((result) => {
    if (filter === "all") return true;
    return result.type === filter;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "subtitle" && a.startStage && b.startStage) {
      return a.startStage.localeCompare(b.startStage);
    }
    return 0; // relevance (default order)
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <Header icon={<ArrowBackIosIcon />} title="検索結果" />
      <div className="p-4 space-y-6">
        {/* 検索窓 */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="レシピ・食材を検索"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all shadow-sm"
            autoFocus
          />
        </div>

        {/* 検索結果ヘッダー */}
        <div className="flex items-center justify-between">
          {query && (
            <p className="text-sm text-stone-500 mt-1">
              「<span className="font-medium text-stone-700">{query}</span>
              」の検索結果 {filteredResults.length}件
            </p>
          )}
        </div>

        {/* 検索結果一覧 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        ) : sortedResults.length > 0 ? (
          <ListCard listCardItems={sortedResults} pageName="search" />
        ) : query ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-3xl">
              😔
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              検索結果が見つかりませんでした
            </h3>
            <p className="text-stone-500 mb-6">
              「{query}」に一致するレシピや食材が見つかりませんでした。
              <br />
              別のキーワードで検索してみてください。
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-stone-600">
                検索のヒント:
              </p>
              <ul className="text-sm text-stone-500 space-y-1">
                <li>・ひらがな、カタカナで検索してみる</li>
                <li>・食材の名前で検索してみる</li>
                <li>・月齢に合った食材を探してみる</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <SearchIcon />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              何をお探しですか？
            </h3>
            <p className="text-stone-500">レシピや食材を検索してみてください</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
