"use client";

import { useState, useEffect, useRef } from "react";
import {
  ExpandLessIcon,
  ExpandMoreIcon,
  SearchIcon,
  SearchOffIcon,
} from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import { useAtomValue, useSetAtom } from "jotai";
import { childIdAtom, loadingAtom, userIdAtom } from "@/lib/atoms";
import {
  getAllergens,
  searchIngredientsWithAllergens,
  searchRecipesWithAllergens,
} from "@/lib/supabase";
import { Allergen, ListCardItem } from "@/types";

export default function SearchResults() {
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const childId = useAtomValue(childIdAtom);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [allergenExclusions, setAllergenExclusions] = useState<
    Record<string, boolean>
  >({});
  const [showAllergens, setShowAllergens] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<ListCardItem[]>([]);
  const [sortBy, setSortBy] = useState("relevance"); // relevance, name, age
  // const [filter, setFilter] = useState("all"); // all, recipe, ingredient

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const currentQuery = inputRef.current?.value || "";

      if (!currentQuery.trim()) {
        setResults([]);
        setSearchQuery("");
        return;
      }
      setIsLoading(true);

      // Enterが押されたタイミングで検索クエリをStateに設定
      setSearchQuery(currentQuery);

      const excludedAllergenIds = Object.keys(allergenExclusions)
        .filter((id) => allergenExclusions[id] === true)
        .map(Number);

      let ingredientsData: ListCardItem[] | null = [];
      let recipesData: ListCardItem[] | null = [];
      // Promise.allを使ってレシピと食材の検索を同時に実行
      if (userId) {
        [ingredientsData, recipesData] = await Promise.all([
          searchIngredientsWithAllergens(
            currentQuery,
            excludedAllergenIds,
            userId,
            childId
          ),
          searchRecipesWithAllergens(currentQuery, excludedAllergenIds, userId),
        ]);
      } else {
        [ingredientsData, recipesData] = await Promise.all([
          searchIngredientsWithAllergens(
            currentQuery,
            excludedAllergenIds,
            null,
            null
          ),
          searchRecipesWithAllergens(currentQuery, excludedAllergenIds, null),
        ]);
      }

      // 結果を結合し、食材を上に、レシピを下に配置
      const combinedResults: ListCardItem[] = [];
      if (ingredientsData) {
        combinedResults.push(...ingredientsData);
      }
      if (recipesData) {
        combinedResults.push(...recipesData);
      }
      setResults(combinedResults);
      setIsLoading(false);
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

  // const sortedResults = results.sort((a, b) => {
  //   if (sortBy === "name") {
  //     return a.name.localeCompare(b.name);
  //   }
  //   if (sortBy === "subtitle" && a.startStage && b.startStage) {
  //     return a.startStage.localeCompare(b.startStage);
  //   }
  //   return 0; // relevance (default order)
  // });

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
    <>
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
              placeholder="食材レシピを検索"
              onKeyDown={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all shadow-sm"
              autoFocus
            />
          </div>
          {/* アレルゲン除外設定 */}
          <div className="bg-white rounded-3xl shadow-sm">
            <button
              onClick={() => setShowAllergens(!showAllergens)}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 rounded-2xl transition-colors"
            >
              <div className="flex items-center">
                <span className="text-sm text-stone-600">
                  アレルゲン除外設定
                </span>
                <span className="ml-2 text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full">
                  {Object.values(allergenExclusions).filter(Boolean).length}
                  件除外中
                </span>
              </div>
              {showAllergens ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>

            {showAllergens && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 pt-2 border-t border-stone-100">
                  {allergens.map((allergen) => (
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
                  ))}
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
        {results.length > 0 ? (
          <ListCard cardItems={results} pageName="search" />
        ) : searchQuery ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center">
              <SearchOffIcon className="text-violet-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4">
              検索結果が見つかりませんでした
            </h3>
            <p className="text-stone-500 mb-6">
              「{searchQuery}」に一致するレシピや食材が見つかりませんでした
              <br />
              別のキーワードで検索してみてください
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center">
              <SearchIcon className="text-violet-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4">
              何をお探しですか？
            </h3>
            <p className="text-stone-500">レシピや食材を検索してみてください</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
