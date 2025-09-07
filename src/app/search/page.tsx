"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ExpandLessIcon, ExpandMoreIcon, SearchIcon } from "@/icons";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ListCard from "@/components/ui/ListCard";
import { CardItem } from "@/types/types";
import { mockListCardItems } from "@/mocks/listCardItems";
import CircularProgress from "@mui/material/CircularProgress";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, recipe, ingredient
  const [sortBy, setSortBy] = useState("relevance"); // relevance, name, age
  const [showAllergens, setShowAllergens] = useState(false);
  const [allergenExclusions, setAllergenExclusions] = useState({
    egg: true,
    milk: true,
    wheat: true,
    shrimp: true,
    crab: true,
    soba: true,
    peanut: true,
    walnut: true,
    almond: true,
    abalone: true,
    squid: true,
    ikura: true,
    orange: true,
    cashew: true,
    kiwi: true,
    beef: true,
    sesame: true,
    salmon: true,
    mackerel: true,
    soy: true,
    chicken: true,
    banana: true,
    pork: true,
    macadamia: true,
    peach: true,
    yam: true,
    apple: true,
    gelatin: true,
  });

  const toggleAllergen = (allergen: keyof typeof allergenExclusions) => {
    setAllergenExclusions((prev) => ({
      ...prev,
      [allergen]: !prev[allergen],
    }));
  };

  const allergenList = [
    { key: "egg", label: "卵" },
    { key: "milk", label: "乳" },
    { key: "wheat", label: "小麦" },
    { key: "shrimp", label: "エビ" },
    { key: "crab", label: "カニ" },
    { key: "soba", label: "そば" },
    { key: "peanut", label: "落花生" },
    { key: "walnut", label: "くるみ" },
    { key: "almond", label: "アーモンド" },
    { key: "abalone", label: "あわび" },
    { key: "squid", label: "いか" },
    { key: "ikura", label: "いくら" },
    { key: "orange", label: "オレンジ" },
    { key: "cashew", label: "カシューナッツ" },
    { key: "kiwi", label: "キウイフルーツ" },
    { key: "beef", label: "牛肉" },
    { key: "sesame", label: "ごま" },
    { key: "salmon", label: "さけ" },
    { key: "mackerel", label: "さば" },
    { key: "soy", label: "大豆" },
    { key: "chicken", label: "鶏肉" },
    { key: "banana", label: "バナナ" },
    { key: "pork", label: "豚肉" },
    { key: "macadamia", label: "マカダミアナッツ" },
    { key: "peach", label: "もも" },
    { key: "yam", label: "やまいも" },
    { key: "apple", label: "りんご" },
    { key: "gelatin", label: "ゼラチン" },
  ];

  useEffect(() => {
    inputRef.current?.focus();
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
      <Header title="検索結果" />
      <div className="p-4 space-y-6">
        {/* 検索窓 */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="レシピ・食材を検索（ ひらがな or カタカナ ）"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all shadow-sm"
              autoFocus
            />
          </div>
          {/* アレルゲン除外設定 */}
          <div className="bg-white rounded-2xl shadow-sm">
            <button
              onClick={() => setShowAllergens(!showAllergens)}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center">
                <span className="text-sm text-stone-600">
                  アレルゲン除外設定
                </span>
                <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {Object.values(allergenExclusions).filter(Boolean).length}
                  件除外中
                </span>
              </div>
              {showAllergens ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>

            {showAllergens && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 pt-2 border-t border-stone-100">
                  {allergenList.map((allergen) => (
                    <button
                      key={allergen.key}
                      onClick={() =>
                        toggleAllergen(
                          allergen.key as keyof typeof allergenExclusions
                        )
                      }
                      className={`h-10 flex items-center justify-center p-1.5 rounded-xl text-xs transition-all hover:scale-105 active:scale-95 ${
                        allergenExclusions[
                          allergen.key as keyof typeof allergenExclusions
                        ]
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                          : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                      }`}
                    >
                      <div className="text-xs leading-tight">
                        {allergen.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            <CircularProgress color="secondary" />
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
