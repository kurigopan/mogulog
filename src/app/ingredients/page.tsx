"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tooltip, IconButton } from "@mui/material";
import {
  CheckCircleIcon,
  CancelIcon,
  RadioButtonUncheckedIcon,
  HelpOutlineIcon,
} from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import IngredientsFilter from "@/components/ui/IngredientsFilter";
import {
  deleteIngredientStatus,
  getIngredientsWithStatus,
  upsertIngredientStatus,
} from "@/lib/supabase";
import { useAtomValue, useSetAtom } from "jotai";
import {
  childIdAtom,
  childInfoAtom,
  loadingAtom,
  loginDialogSourceAtom,
  userIdAtom,
} from "@/lib/atoms";
import { getAgeStageDisplay } from "@/lib/utils";
import { Ingredient } from "@/types";

export default function IngredientsList() {
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const childId = useAtomValue(childIdAtom);
  const childInfo = useAtomValue(childInfoAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStageFilter, setSelectedStageFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const toggleEaten = async (ingredient: Ingredient) => {
    if (!userId || !childId) {
      setLoginDialogSource("ingredientStatusToggle");
      return;
    }

    // 1. **必要なステータスを事前に計算し、ローカル変数に確定させる**
    const originalEatenStatus = ingredient.eaten;
    const originalNgStatus = ingredient.ng;
    const newEatenStatus = !originalEatenStatus;
    // 2. **UIを即時更新（楽観的更新）**
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== ingredient.id) return ing;
        return {
          ...ing,
          eaten: newEatenStatus,
          ng: newEatenStatus ? false : ing.ng,
        };
      })
    );
    // 3. **DB操作を実行**
    try {
      if (newEatenStatus) {
        // true: 食べたとして登録/更新
        await upsertIngredientStatus(childId, ingredient.id, "eaten", userId!);
      } else {
        // false: 未経験としてDBから削除
        await deleteIngredientStatus(childId, ingredient.id);
      }
    } catch (error) {
      console.error("DB更新エラー (eaten):", error);

      // 4. **DB操作失敗** -> 状態を元の値にロールバック
      setIngredients((prev) =>
        prev.map((ing) => {
          if (ing.id !== ingredient.id) return ing;
          return {
            ...ing,
            eaten: originalEatenStatus,
            ng: originalNgStatus,
          };
        })
      );
    }
  };

  const toggleNG = async (ingredient: Ingredient) => {
    if (!userId || !childId) {
      setLoginDialogSource("ingredientStatusToggle");
      return;
    }
    // 1. **必要なステータスを事前に計算し、ローカル変数に確定させる**
    const originalEatenStatus = ingredient.eaten;
    const originalNgStatus = ingredient.ng;
    const newNgStatus = !originalNgStatus;
    // 2. **UIを即時更新（楽観的更新）**
    setIngredients((prev) =>
      prev.map((ing) => {
        if (ing.id !== ingredient.id) return ing;
        return {
          ...ing,
          eaten: newNgStatus ? false : ing.eaten,
          ng: newNgStatus,
        };
      })
    );
    // 3. **DB操作を実行**
    try {
      if (newNgStatus) {
        // true -> 'ng'として登録/更新
        await upsertIngredientStatus(childId, ingredient.id, "ng", userId!);
      } else {
        // false -> 未経験としてDBから削除
        await deleteIngredientStatus(childId, ingredient.id);
      }
    } catch (error) {
      console.error("DB更新エラー (ng):", error);
      // 4. **DB操作失敗** -> 状態を元の値にロールバック
      setIngredients((prev) =>
        prev.map((ing) => {
          if (ing.id !== ingredient.id) return ing;
          return {
            ...ing,
            eaten: originalEatenStatus,
            ng: originalNgStatus,
          };
        })
      );
    }
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
    if (
      selectedStatusFilter === "not-eaten" &&
      (ingredient.eaten || ingredient.ng)
    ) {
      return false;
    }
    if (selectedStatusFilter === "eaten" && !ingredient.eaten) {
      return false;
    }
    if (selectedStatusFilter === "ng" && !ingredient.ng) {
      return false;
    }

    return true;
  });

  // ヘルプテキスト
  const helpText =
    "初：初期（5-6ヶ月）、中：中期（7-8ヶ月）、後：後期（9-11ヶ月）、完：完了期（12-18ヶ月）";

  useEffect(() => {
    setIsLoading(true);
    const fetchIngredients = async () => {
      let ingredientsData;
      if (userId && childId) {
        ingredientsData = await getIngredientsWithStatus(userId, childId);
      } else {
        ingredientsData = await getIngredientsWithStatus();
      }
      if (ingredientsData) {
        setIngredients(ingredientsData);
      }
    };
    fetchIngredients();
    setIsLoading(false);
  }, [userId, childId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="食材一覧" />
      <div className="p-4 space-y-6">
        {/* フィルターボックス */}
        <IngredientsFilter
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStageFilter={selectedStageFilter}
          setSelectedStageFilter={setSelectedStageFilter}
          selectedStatusFilter={selectedStatusFilter}
          setSelectedStatusFilter={setSelectedStatusFilter}
        />

        {/* 食材一覧（テーブル表示） */}
        <section>
          {filteredIngredients.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-200">
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
                        className="px-4 py-4 hover:bg-violet-25 transition-colors"
                      >
                        <div className="flex items-center">
                          {/* 食材名 */}
                          <div className="flex-1 min-w-0 px-3">
                            <Link
                              href={`/ingredients/${ingredient.id}`}
                              className="group"
                            >
                              <h3 className="font-medium text-stone-700 text-base group-hover:text-violet-600 transition-colors">
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
                                      ? stage === childInfo.ageStage
                                        ? "bg-violet-200 text-violet-800 border-violet-400 font-bold shadow-sm"
                                        : "bg-violet-100 text-violet-700 border-violet-300"
                                      : "bg-stone-50 text-stone-400 border-stone-200"
                                  }`}
                                >
                                  {isActive ? stage.charAt(0) : "・"}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* 食べた・NGチェック */}
                          <div className="flex items-center gap-3">
                            {/* 食べたチェック */}
                            <div className="w-12 text-center">
                              <button
                                onClick={() => toggleEaten(ingredient)}
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
                                onClick={() => toggleNG(ingredient)}
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
                className="px-6 py-2 bg-violet-100 text-violet-600 rounded-full text-sm font-medium hover:bg-violet-200 transition-colors"
              >
                フィルターをリセット
              </button>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
