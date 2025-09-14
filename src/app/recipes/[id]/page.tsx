"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import {
  EditIcon,
  ScheduleIcon,
  PeopleIcon,
  // InfoOutlineIcon,
  DeleteIcon,
} from "@/icons";
// import { Tooltip, IconButton } from "@mui/material";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NotFoundPage from "./notFound";
import { getRecipeAllergens, getRecipeById } from "@/lib/supabase";
import { Allergen, Recipe } from "@/types/types";
import { saveRecentlyViewedItem } from "@/lib/localstorage";
import ShareButton from "@/components/ui/ShareButton";
import FavoriteButton from "@/components/ui/FavoriteButton";

const userId = "32836782-4f6d-4dc3-92ea-4faf03ed86a5";

export default function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const id = Number(unwrapParams.id);
  const [displayRecipe, setDisplayRecipe] = useState<Recipe | null>(null);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [memo, setMemo] = useState("");

  // const infoText = "自分専用なので他の人は見れません";

  // const handleMemoSave = () => {
  //   console.log("メモを保存:", memo);
  // };

  useEffect(() => {
    const fetchData = async () => {
      const [recipeData, allergensData] = await Promise.all([
        getRecipeById(userId, id),
        getRecipeAllergens(id),
      ]);

      const foundRecipe = recipeData.length > 0 ? recipeData[0] : null;

      if (foundRecipe) {
        setDisplayRecipe(foundRecipe);
        saveRecentlyViewedItem(foundRecipe);
      }

      if (allergensData) {
        setAllergens(allergensData);
      } else {
        setAllergens([]);
      }
    };
    fetchData();
  }, [id, userId]);

  // レシピが見つからない場合は404ページを表示
  if (!displayRecipe) {
    return <NotFoundPage />;
  }

  const content = (
    <div className="flex items-center space-x-2">
      <ShareButton title={displayRecipe.name} />
      <FavoriteButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ詳細" content={content} />
      <div className="p-4 space-y-6">
        {/* レシピ基本情報 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm text-center mb-4">
          {/* 画像があれば表示する */}
          <div className="w-[300px] h-[300px] overflow-hidden mx-auto mb-4">
            {displayRecipe.image && (
              <Image
                src={displayRecipe.image}
                alt={`${displayRecipe.name}の画像`}
                width={300}
                height={300}
                className="object-contain rounded-2xl"
                unoptimized // 画像がsvgの場合ブロックされてしまうため設定
              />
            )}
          </div>
          <h2 className="text-2xl font-bold text-stone-700 mb-4">
            {displayRecipe.name}
          </h2>
          <p className="text-sm text-stone-500 mb-4">
            by {displayRecipe.author}
          </p>

          {/* 離乳食段階・カテゴリータグ */}
          <div className="flex justify-center space-x-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
              {displayRecipe.startStage}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium">
              {displayRecipe.category}
            </span>
          </div>

          {/* レシピ情報 */}
          <div className="flex justify-center space-x-6 text-sm text-stone-600 mb-4">
            <div className="flex items-center">
              <ScheduleIcon />
              <span className="ml-1">{displayRecipe.cookingTime}</span>
            </div>
            <div className="flex items-center">
              <PeopleIcon />
              <span className="ml-1">{displayRecipe.servings}</span>
            </div>
          </div>

          {/* レシピ説明 */}
          <p className="text-stone-600 text-center leading-relaxed mb-4">
            {displayRecipe.description}
          </p>

          {/* アクションボタン(自作レシピの場合のみ表示) */}
          {displayRecipe.isOwn && (
            <div className="flex items-center justify-center gap-4">
              <button className=" py-2 px-3 rounded-full font-medium bg-stone-100 text-stone-600-600 hover:bg-purple-200 transition-colors">
                <EditIcon />
                <span className="ml-2">編集</span>
              </button>
              <button className="py-2 px-3 rounded-full font-medium bg-stone-100 text-stone-600 hover:bg-purple-200 transition-colors">
                <DeleteIcon />
                <span className="ml-2">削除</span>
              </button>
            </div>
          )}
        </section>

        {/* 材料 */}
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            材料
          </h3>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="space-y-3">
              {displayRecipe.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-stone-100 last:border-b-0"
                >
                  <div>
                    <span className="font-medium text-stone-700">
                      {ingredient.name}
                    </span>
                    {ingredient.note && (
                      <p className="text-xs text-stone-500 mt-1">
                        {ingredient.note}
                      </p>
                    )}
                  </div>
                  <span className="text-stone-600 font-medium">
                    {ingredient.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 作り方 */}
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            作り方
          </h3>
          <div className="space-y-4">
            {displayRecipe.steps.map((step, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <p className="text-stone-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {/* 画像があれば表示する */}
                {/* {step.image && (
                  <Image
                    src={step.image}
                    alt={`${step.step}の画像`}
                    width={400}
                    height={300}
                    className="w-full rounded-2xl shadow-sm"
                    unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                  />
                )} */}
              </div>
            ))}
          </div>
        </section>

        {/* タグ */}
        {displayRecipe.tags.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
              タグ
            </h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {displayRecipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* アレルゲン */}
        {allergens.length > 0 && (
          <section>
            <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
              アレルゲン
            </h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen) => (
                  <span
                    key={allergen.id}
                    className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium"
                  >
                    {allergen.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* メモ */}
        {/* <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-stone-700">マイメモ</h3>
            <Tooltip
              title={infoText}
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
                <InfoOutlineIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            {displayRecipe.savedMemo && (
              <div className="mb-4 p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600 leading-relaxed">
                  <span className="font-medium text-stone-700">
                    前回のメモ:{" "}
                  </span>
                  {displayRecipe.savedMemo}
                </p>
              </div>
            )}
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="アレンジ方法や感想を記録しましょう..."
              className="w-full p-3 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleMemoSave}
                className="px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
              >
                メモを保存
              </button>
            </div>
          </div>
        </section> */}
      </div>
      <Footer />
    </div>
  );
}
