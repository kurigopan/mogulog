"use client";

import { useState, useEffect, useRef } from "react";
import { ExpandLessIcon, ExpandMoreIcon, SearchIcon } from "@/icons";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ListCard from "@/components/ui/ListCard";
import { Allergen, CardItem } from "@/types/types";
import CircularProgress from "@mui/material/CircularProgress";
import { getAllergens, searchRecipesWithAllergens } from "@/lib/supabase";

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  // const [filter, setFilter] = useState("all"); // all, recipe, ingredient
  const [sortBy, setSortBy] = useState("relevance"); // relevance, name, age
  const [error, setError] = useState<string | null>(null);
  const [showAllergens, setShowAllergens] = useState(false);

  // Supabaseから取得したアレルゲンを保存する状態
  const [allergens, setAllergens] = useState<Allergen[]>([]);

  // アレルゲン除外設定の状態を動的に管理
  const [allergenExclusions, setAllergenExclusions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    const excludedAllergenIds = Object.keys(allergenExclusions)
      .filter((id) => allergenExclusions[id] === true)
      .map(Number);
    console.log("除外するアレルゲンID:", excludedAllergenIds);
  }, [allergenExclusions]);

  // 検索処理
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentQuery = inputRef.current?.value || "";

      if (!currentQuery.trim()) {
        setResults([]); // 検索結果を空にする
        setLoading(false); // ローディング状態を解除
        setSearchQuery("");
        return; // ここで処理を終了
      }
      setLoading(true); // 検索を開始するので「読み込み中」にする
      setError(null);

      // Enterが押されたタイミングで検索クエリをStateに設定
      setSearchQuery(currentQuery);

      const excludedAllergenIds = Object.keys(allergenExclusions)
        .filter((id) => allergenExclusions[id] === true)
        .map(Number);

      try {
        const data = await searchRecipesWithAllergens(
          currentQuery,
          excludedAllergenIds,
          "32836782-4f6d-4dc3-92ea-4faf03ed86a5"
        );
        if (data) {
          setResults(data);
        }
      } catch (error) {
        console.error("データの取得に失敗しました。", error);
        setError("データの取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleAllergen = (allergenId: number) => {
    setAllergenExclusions((prev) => ({
      ...prev,
      [allergenId]: !prev[allergenId],
    }));
  };

  // const filteredResults = results.filter((result) => {
  //   if (filter === "all") return true;
  //   return result.type === filter;
  // });

  const sortedResults = results.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "subtitle" && a.startStage && b.startStage) {
      return a.startStage.localeCompare(b.startStage);
    }
    return 0; // relevance (default order)
  });

  // ページロード時とアレルゲン項目がないときに実行
  useEffect(() => {
    inputRef.current?.focus();
    const fetchAllergens = async () => {
      if (allergens.length === 0) {
        const data = await getAllergens();
        if (data) {
          setAllergens(data);
          const initialExclusions: Record<string, boolean> = {};
          data.forEach((allergen) => {
            initialExclusions[allergen.id] = false;
          });
          setAllergenExclusions(initialExclusions);
        }
      }
    };
    fetchAllergens();
  }, []);

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
              placeholder="レシピ・食材を検索"
              onKeyDown={handleSearch}
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
                  {allergens.length === 0 && loading ? (
                    <CircularProgress color="secondary" size={24} />
                  ) : (
                    allergens.map((allergen) => (
                      <button
                        key={allergen.id}
                        onClick={() => toggleAllergen(allergen.id)}
                        className={`h-10 flex items-center justify-center p-1.5 rounded-full text-xs transition-all hover:scale-105 active:scale-95 ${
                          allergenExclusions[allergen.id]
                            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                            : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <div className="text-xs leading-tight">
                          {allergen.name}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 検索結果ヘッダー */}
        <div className="flex items-center justify-between">
          {searchQuery && (
            <p className="text-sm text-stone-500 mt-1">
              「
              <span className="font-medium text-stone-700">{searchQuery}</span>
              」の検索結果 {results.length}件
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
        ) : searchQuery ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-3xl">
              😔
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              検索結果が見つかりませんでした
            </h3>
            <p className="text-stone-500 mb-6">
              「{searchQuery}」に一致するレシピや食材が見つかりませんでした。
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
