"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, Tab, Box } from "@mui/material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFoundPage from "@/components/common/NotFound";
import Card from "@/components/ui/Card";
import ShareButton from "@/components/ui/ShareButton";
import FavoriteButton from "@/components/ui/FavoriteButton";
import IngredientStatusButtons from "@/components/ui/IngredientStatusButtons";
import { useAtomValue } from "jotai";
import { childIdAtom, childInfoAtom, userIdAtom } from "@/lib/utils/atoms";
import { getIngredientById, searchRecipesByIngredient } from "@/lib/supabase";
import { savedBrowsingHistory } from "@/lib/utils/localstorage";
import type { CardItem, Ingredient } from "@/types";

export default function IngredientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const id = Number(unwrapParams.id);
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [relatedRecipes, setRelatedRecipes] = useState<CardItem[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const userId = useAtomValue(userIdAtom);
  const childId = useAtomValue(childIdAtom);
  const childInfo = useAtomValue(childInfoAtom);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (userId && childId) {
        const ingredientData = await getIngredientById(userId, childId, id);
        if (ingredientData) {
          setIngredient(ingredientData);
          const recipeData = await searchRecipesByIngredient(
            userId,
            ingredientData.name,
            childInfo.ageStage,
          );
          if (recipeData) {
            setRelatedRecipes(recipeData);
          }
        }
      } else {
        const ingredientData = await getIngredientById(null, null, id);
        if (ingredientData) {
          setIngredient(ingredientData);
          const recipeData = await searchRecipesByIngredient(
            null,
            ingredientData.name,
            "",
          );
          if (recipeData) {
            setRelatedRecipes(recipeData);
          }
        }
      }
    };
    fetchData();
  }, [userId, childId, id, childInfo?.ageStage]);

  // 閲覧履歴ローカルストレージに保存
  useEffect(() => {
    if (ingredient) {
      savedBrowsingHistory(ingredient);
    }
  }, [ingredient]);

  let tools;
  if (ingredient) {
    tools = (
      <div className="flex items-center space-x-2">
        <ShareButton title={ingredient.name} />
        <FavoriteButton
          itemId={id}
          itemType="ingredient"
          initialIsFavorited={ingredient.isFavorite}
        />
      </div>
    );
  } else {
    tools = <></>;
  }

  return (
    <>
      <Header title="食材詳細" tools={tools} />
      <div className="p-4 space-y-6">
        {ingredient ? (
          <>
            {/* 食材概要 */}
            <section>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="text-center mb-4">
                  {/* 画像があれば表示する */}
                  {ingredient.image && (
                    <Image
                      src={ingredient.image}
                      alt={`${ingredient.name}の画像`}
                      width={150}
                      height={150}
                      className="rounded-3xl mb-4 mx-auto"
                      unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                      priority
                    />
                  )}
                  <h2 className="text-2xl font-bold text-stone-700 mb-4">
                    {ingredient.name}
                  </h2>
                  {ingredient.season.map((s) => {
                    return (
                      <div
                        key={s}
                        className="inline-flex items-center px-3 py-2 rounded-full bg-green-50 text-green-600 text-sm mr-2"
                      >
                        {s}
                      </div>
                    );
                  })}
                  <div className="inline-flex items-center px-3 py-2 rounded-full bg-amber-50 text-amber-600 text-sm">
                    {ingredient.category}
                  </div>
                </div>
                <p className="text-stone-600 text-center leading-relaxed">
                  {ingredient.description}
                </p>

                {/* 食べたNGボタン */}
                <IngredientStatusButtons ingredient={ingredient} />
              </div>
            </section>

            {/* 離乳食段階別の食べ方 */}
            <section>
              <h3 className="text-lg font-bold text-stone-700 mb-4">
                離乳食段階別の食べ方
              </h3>
              {/* 離乳食段階タブ */}
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <Box sx={{ borderBottom: 1, borderColor: "divider", px: 0 }}>
                  <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{
                      "& .MuiTab-root": {
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        textTransform: "none",
                        minHeight: "48px",
                        color: "#78716c",
                        "&.Mui-selected": {
                          color: "#a855f7",
                        },
                      },
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#a855f7",
                        height: "3px",
                        borderRadius: "3px 3px 0 0",
                      },
                    }}
                  >
                    {ingredient.stageInfo.map((info, index) => (
                      <Tab key={index} label={`${info.stage}`} />
                    ))}
                  </Tabs>
                </Box>

                {/* 離乳食段階別内容 */}
                <div className="p-6">
                  {ingredient.stageInfo.map((info, index) => (
                    <div
                      key={index}
                      className={`${
                        selectedTab === index ? "block" : "hidden"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-stone-700">
                          離乳食{info.stage}
                        </h4>
                        <span className="bg-violet-50 text-violet-600 px-3 py-2 rounded-full text-sm font-medium">
                          {info.age}
                        </span>
                      </div>

                      <p className="text-stone-600 mb-4 leading-relaxed">
                        {info.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-stone-50 rounded-3xl p-4 flex flex-col space-y-3">
                          <span className="text-stone-700 font-semibold ml-2">
                            目安量
                          </span>
                          <p className="text-stone-600 text-sm ml-1">
                            {info.amount}
                          </p>
                        </div>

                        <div className="bg-stone-50 rounded-3xl p-4 flex flex-col space-y-3">
                          <span className="text-stone-700 font-semibold ml-2">
                            形状・大きさ
                          </span>
                          <p className="text-stone-600 text-sm ml-1">
                            {info.shape}
                          </p>
                        </div>

                        <div className="bg-stone-50 rounded-3xl p-4 flex flex-col space-y-3">
                          <span className="text-stone-700 font-semibold ml-2">
                            調理方法
                          </span>
                          <p className="text-stone-600 text-sm ml-1">
                            {info.cooking}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 栄養情報 */}
            <section>
              <h3 className="text-lg font-bold text-stone-700 mb-4">
                栄養情報
              </h3>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between w-full mb-4">
                  <span className="font-medium text-stone-700">カロリー</span>
                  <span className="text-stone-600">
                    {ingredient.nutrition.calories}
                  </span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="font-medium text-stone-700 flex-shrink-0">
                    主な栄養素
                  </span>
                  <div className="flex flex-wrap gap-2 ml-2">
                    {ingredient.nutrition.nutrients.map((nutrient, index) => (
                      <span
                        key={index}
                        className="text-xs bg-amber-50 text-amber-600 px-3 py-2 rounded-full whitespace-nowrap"
                      >
                        {nutrient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 調理のコツ */}
            <section>
              <h3 className="text-lg font-bold text-stone-700 mb-4">
                調理のコツ
              </h3>
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <ul className="list-disc list-inside space-y-2 text-stone-600 text-sm">
                  {ingredient.tips.map((tip, index) => (
                    <li key={index} className="flex items-center">
                      ・{tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* 関連レシピ */}
            {relatedRecipes.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-stone-700 mb-4">
                  関連レシピ
                </h3>
                <Card cardItems={relatedRecipes} className="bg-violet-100" />
              </section>
            )}
          </>
        ) : (
          <NotFoundPage />
        )}
      </div>
      <Footer />
    </>
  );
}
