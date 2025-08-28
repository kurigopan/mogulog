"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Card from "@/components/ui/card";
import AgeOptionsFilter from "@/components/ageOptionsFilter";
import {
  SearchIcon,
  ExpandLessIcon,
  ExpandMoreIcon,
  StarIcon,
  LocalFloristIcon,
  RecommendIcon,
  HistoryIcon,
  ChildCareIcon,
} from "@/icons";
import { mockRecipes } from "@/mocks/recipes";
import { mockIngredients } from "@/mocks/ingredients";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [childAge, setChildAge] = useState("");
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

  useEffect(() => {
    // localStorage is not supported in this environment, using mock data
    setChildAge("7-8");
  }, []);

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

  // 月齢に基づくおすすめレシピ
  const getRecommendedRecipes = () => {
    if (childAge === "5-6") {
      return mockRecipes.filter((recipe) => recipe.startStage === "初期");
    } else if (childAge === "7-8") {
      return mockRecipes.filter((recipe) => recipe.startStage === "中期");
    } else if (childAge === "9-11") {
      return mockRecipes.filter((recipe) => recipe.startStage === "後期");
    }

    return mockRecipes.filter((recipe) => recipe.startStage === "完了期");
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        icon={<ChildCareIcon />}
        title="もぐログ"
        content={<AgeOptionsFilter />}
      />
      <div className="p-4 space-y-6">
        {/* 統合検索窓 */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="レシピ・食材を検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all shadow-sm hover:shadow-md"
              style={{ borderRadius: "50px" }}
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

        {/* 人気のレシピ */}
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-purple-300 mr-2">
              <StarIcon />
            </div>
            人気のレシピ
          </h2>
          <Card cardItems={mockRecipes} className="bg-purple-100" />
        </section>

        {/* 旬の食材 */}
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-amber-300 mr-2">
              <LocalFloristIcon />
            </div>
            旬の食材
          </h2>
          <Card cardItems={mockIngredients} className="bg-amber-100" />
        </section>

        {/* おすすめのレシピ */}
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-pink-300 mr-2">
              <RecommendIcon />
            </div>
            おすすめのレシピ
          </h2>
          <Card cardItems={getRecommendedRecipes()} className="bg-pink-100" />
        </section>

        {/* 最近見たもの */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-700 flex items-center">
              <div className="text-stone-400 mr-2">
                <HistoryIcon />
              </div>
              最近見たもの
            </h2>
            <button className="text-sm text-purple-400 hover:text-purple-500 transition-colors">
              すべて見る
            </button>
          </div>
          <Card cardItems={mockRecipes} className="bg-stone-100" />
        </section>
      </div>
      <Footer />
    </div>
  );
}
