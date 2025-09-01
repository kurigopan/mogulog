"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  FilterListIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  CheckCircleIcon,
  CancelIcon,
  RadioButtonUncheckedIcon,
  HelpOutlineIcon,
} from "@/icons";
import { Tooltip, IconButton } from "@mui/material";
import { Ingredient, ingredientStageInfo } from "@/types/types";
import { getIngredients } from "@/lib/supabase";
import type { Tables } from "@/types/supabase";

// `getIngredients`の返り値の型を定義
// `Tables`は `npx supabase gen types` で生成した型からインポートします
// type Ingredient = Tables<"ingredients">;

export default function IngredientsList() {
  const [childAge, setChildAge] = useState("7-8");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStageFilter, setSelectedStageFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const data = await getIngredients();
        if (data) {
          setIngredients(data);
        }
      } catch (err) {
        setError("データの取得に失敗しました。");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  //   setIngredients(mockIngredients);
  // }, []);

  const categories = [
    { value: "all", label: "すべて" },
    { value: "穀類", label: "穀類" },
    { value: "野菜", label: "野菜" },
    { value: "果物", label: "果物" },
    { value: "たんぱく質", label: "たんぱく質" },
    { value: "乳製品", label: "乳製品" },
  ];

  const stageFilters = [
    { value: "all", label: "すべて" },
    { value: "5-6", label: "初期（5-6ヶ月）" },
    { value: "7-8", label: "中期（7-8ヶ月）" },
    { value: "9-11", label: "後期（9-11ヶ月）" },
    { value: "12-18", label: "完了期（12-18ヶ月）" },
  ];

  const statusFilters = [
    { value: "all", label: "すべて" },
    { value: "eaten", label: "食べた" },
    { value: "not-eaten", label: "未経験" },
    { value: "ng", label: "NG" },
  ];

  const toggleEaten = (id: number) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              eaten: !ingredient.eaten,
              ng: ingredient.eaten ? ingredient.ng : false,
            }
          : ingredient
      )
    );
  };

  const toggleNG = (id: number) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id
          ? {
              ...ingredient,
              ng: !ingredient.ng,
              eaten: ingredient.ng ? ingredient.eaten : false,
            }
          : ingredient
      )
    );
  };

  const filteredIngredients = ingredients.filter((ingredient) => {
    // カテゴリフィルター
    if (
      selectedCategory !== "all" &&
      ingredient.category !== selectedCategory
    ) {
      return false;
    }

    // 離乳食段階フィルター
    if (
      selectedStageFilter !== "all" &&
      !ingredient.startStage.includes(selectedStageFilter)
    ) {
      return false;
    }

    // ステータスフィルター
    if (selectedStatusFilter === "eaten" && !ingredient.eaten) {
      return false;
    }
    if (
      selectedStatusFilter === "not-eaten" &&
      (ingredient.eaten || ingredient.ng)
    ) {
      return false;
    }
    if (selectedStatusFilter === "ng" && !ingredient.ng) {
      return false;
    }

    return true;
  });

  // 月齢を段階表示に変換する関数（縦揃え対応）
  const getAgeStageDisplay = (stageInfo: ingredientStageInfo[]) => {
    const allStages = ["初", "中", "後", "完"];

    // stageInfo からアクティブな stage を抽出
    const activeStages = stageInfo
      .filter((s) => s.suitable)
      .map((s) => s.stage);

    return allStages.map((stage) => {
      const isActive =
        (stage === "初" && activeStages.includes("初期")) ||
        (stage === "中" && activeStages.includes("中期")) ||
        (stage === "後" && activeStages.includes("後期")) ||
        (stage === "完" && activeStages.includes("完了期"));

      return { stage, isActive };
    });
  };

  // 現在の月齢段階を取得
  const getCurrentStage = () => {
    if (childAge === "5-6") return "初";
    if (childAge === "7-8") return "中";
    if (childAge === "9-11") return "後";
    if (childAge === "12-18") return "完";
    return "初";
  };

  const currentStage = getCurrentStage();

  // ヘルプテキスト
  const helpText =
    "初：初期（5-6ヶ月）、中：中期（7-8ヶ月）、後：後期（9-11ヶ月）、完：完了期（12-18ヶ月）";

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="食材一覧" />
      <div className="p-4 space-y-6">
        {/* フィルターボックス */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <FilterListIcon />
            <span className="text-sm font-medium">フィルター</span>
            {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>
        </div>

        {/* フィルター */}
        {showFilters && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
            {/* カテゴリフィルター */}
            <div>
              <h3 className="text-sm font-medium text-stone-700 mb-4">
                食材カテゴリ
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-2 py-1 rounded-full text-sm transition-all ${
                      selectedCategory === category.value
                        ? "bg-purple-100 text-purple-600 border border-purple-200"
                        : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 離乳食段階フィルター */}
            <div>
              <h3 className="text-sm font-medium text-stone-700 mb-4">
                離乳食段階
              </h3>
              <div className="flex flex-wrap gap-2">
                {stageFilters.map((stageFilter) => (
                  <button
                    key={stageFilter.value}
                    onClick={() => setSelectedStageFilter(stageFilter.value)}
                    className={`px-2 py-1 rounded-full text-sm transition-all ${
                      selectedStageFilter === stageFilter.value
                        ? "bg-amber-100 text-amber-600 border border-amber-200"
                        : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {stageFilter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ステータスフィルター */}
            <div>
              <h3 className="text-sm font-medium text-stone-700 mb-4">
                食べた記録
              </h3>
              <div className="flex flex-wrap gap-2">
                {statusFilters.map((statusFilter) => (
                  <button
                    key={statusFilter.value}
                    onClick={() => setSelectedStatusFilter(statusFilter.value)}
                    className={`px-2 py-1 rounded-full text-sm transition-all ${
                      selectedStatusFilter === statusFilter.value
                        ? "bg-blue-100 text-blue-600 border border-blue-200"
                        : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {statusFilter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 食材一覧（テーブル表示） */}
        <section>
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-200">
            {filteredIngredients.length > 0 ? (
              <div className="overflow-x-auto">
                {/* テーブルヘッダー */}
                <div className="border-b-2 border-stone-200">
                  <div className="px-4 py-4 flex items-center text-sm font-semibold text-stone-700">
                    <div className="flex-1 min-w-0 px-3">食材名</div>
                    <div className="w-32 text-center px-2 flex items-center justify-center gap-1">
                      <span>離乳食段階</span>
                      <Tooltip
                        title={helpText}
                        placement="top"
                        arrow
                        componentsProps={{
                          tooltip: {
                            sx: {
                              bgcolor: "rgba(0, 0, 0, 0.8)",
                              fontSize: "12px",
                              maxWidth: 280,
                            },
                          },
                        }}
                      >
                        <IconButton
                          size="small"
                          sx={{
                            padding: 0.5,
                            marginLeft: 0.5,
                            color: "rgba(120, 113, 108, 0.7)",
                            "&:hover": {
                              color: "rgba(120, 113, 108, 1)",
                              backgroundColor: "rgba(147, 51, 234, 0.1)",
                            },
                          }}
                        >
                          <HelpOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                    <div className="w-16 text-center px-1">食べた</div>
                    <div className="w-12 text-center px-1">NG</div>
                  </div>
                </div>

                {/* テーブルボディ */}
                <div className="divide-y divide-stone-100">
                  {filteredIngredients.map((ingredient) => {
                    const stageDisplay = getAgeStageDisplay(
                      ingredient.stageInfo
                    );
                    return (
                      <div
                        key={ingredient.id}
                        className="px-4 py-4 hover:bg-purple-25 transition-colors"
                      >
                        <div className="flex items-center">
                          {/* 食材名 */}
                          <div className="flex-1 min-w-0 px-3">
                            <Link
                              href={`/ingredients/${ingredient.id}`}
                              className="group"
                            >
                              <h3 className="font-medium text-stone-700 text-base group-hover:text-purple-600 transition-colors">
                                {ingredient.name}
                              </h3>
                            </Link>
                          </div>

                          {/* 離乳食段階 */}
                          <div className="w-32 text-center px-2 mr-6">
                            <div className="flex justify-center items-center space-x-1">
                              {stageDisplay.map(({ stage, isActive }) => (
                                <span
                                  key={stage}
                                  className={`text-sm w-7 h-7 flex items-center justify-center rounded-full font-medium border-1 transition-all ${
                                    isActive
                                      ? stage === currentStage
                                        ? "bg-purple-200 text-purple-800 border-purple-400 font-bold shadow-sm"
                                        : "bg-purple-100 text-purple-700 border-purple-300"
                                      : "bg-stone-50 text-stone-400 border-stone-200"
                                  }`}
                                >
                                  {isActive ? stage : "・"}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 食べた・NGチェック */}
                          <div className="flex items-center gap-3">
                            {/* 食べたチェック */}
                            <div className="w-12 text-center">
                              <button
                                onClick={() => toggleEaten(ingredient.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                                  ingredient.eaten
                                    ? "text-green-600 hover:text-green-700"
                                    : "text-stone-400 hover:text-green-500"
                                }`}
                              >
                                {ingredient.eaten ? (
                                  <CheckCircleIcon />
                                ) : (
                                  <RadioButtonUncheckedIcon />
                                )}
                              </button>
                            </div>

                            {/* NGチェック */}
                            <div className="w-10 text-center">
                              <button
                                onClick={() => toggleNG(ingredient.id)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                                  ingredient.ng
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-stone-400 hover:text-red-500"
                                }`}
                              >
                                {ingredient.ng ? (
                                  <CancelIcon />
                                ) : (
                                  <RadioButtonUncheckedIcon />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center text-3xl">
                  🤷‍♀️
                </div>
                <h3 className="text-lg font-semibold text-stone-700 mb-2">
                  条件に合う食材が見つかりませんでした
                </h3>
                <p className="text-stone-500 mb-4">
                  フィルター条件を変更して再度お試しください
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedStageFilter("all");
                    setSelectedStatusFilter("all");
                  }}
                  className="px-6 py-2 bg-purple-100 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                >
                  フィルターをリセット
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
