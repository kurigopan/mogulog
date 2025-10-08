"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import NotFoundPage from "@/components/common/NotFound";
import ShareButton from "@/components/ui/ShareButton";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { useAtomValue } from "jotai";
import { userIdAtom } from "@/lib/atoms";
import { savedBrowsingHistory } from "@/lib/utils/localstorage";
import {
  deleteRecipe,
  getRecipeAllergens,
  getRecipeById,
} from "@/lib/supabase";
import { Allergen, Recipe } from "@/types";

export default function RecipeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const id = Number(unwrapParams.id);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const userId = useAtomValue(userIdAtom);
  const router = useRouter();
  // const [memo, setMemo] = useState("");

  // const infoText = "自分専用なので他の人は見れません";

  // const handleMemoSave = () => {
  //   console.log("メモを保存:", memo);
  // };

  // const handleEdit = () => {
  //   router.push({ pathname: "/recipes/[id]/edit", query: { id } });
  // };

  const handleDelete = async () => {
    if (!recipe) return;

    const confirmDelete = window.confirm(
      "本当にこのレシピを削除しますか？この操作は元に戻せません。"
    );
    if (!confirmDelete) return;

    try {
      // レシピの削除
      const response = await deleteRecipe(id);

      if (response.error) {
        alert("レシピを削除しました。");
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("レシピの削除中にエラーが発生しました。");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const allergensData = await getRecipeAllergens(id);
      if (allergensData) {
        setAllergens(allergensData);
      }
      if (userId) {
        const recipeData = await getRecipeById(userId, id);
        if (recipeData) {
          setRecipe(recipeData);
        }
      } else {
        const recipeData = await getRecipeById(null, id);
        if (recipeData) {
          setRecipe(recipeData);
        }
      }
    };
    fetchData();
  }, [id, userId]);

  // コンポーネントがマウントされた時に、ローカルストレージに保存
  useEffect(() => {
    if (recipe) {
      savedBrowsingHistory(recipe);
    }
  }, [recipe]);

  let tools;
  if (recipe) {
    tools = (
      <div className="flex items-center space-x-2">
        <ShareButton title={recipe.name} />
        <FavoriteButton
          itemId={id}
          itemType="recipe"
          initialIsFavorited={recipe.isFavorite}
        />
      </div>
    );
  } else {
    tools = <></>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="レシピ詳細" tools={tools} />
      <div className="p-4 space-y-6">
        {recipe ? (
          <>
            {/* レシピ基本情報 */}
            <section className="bg-white rounded-3xl p-6 shadow-sm text-center mb-4">
              {/* 画像があれば表示する */}
              <div className="w-[300px] h-[300px] overflow-hidden mx-auto mb-4">
                {recipe.image && (
                  <Image
                    src={recipe.image}
                    alt={`${recipe.name}の画像`}
                    width={300}
                    height={300}
                    className="object-contain rounded-2xl"
                    unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                    priority
                  />
                )}
              </div>
              <h2 className="text-2xl font-bold text-stone-700 mb-4">
                {recipe.name}
              </h2>
              <p className="text-sm text-stone-500 mb-4">by {recipe.author}</p>

              {/* 離乳食段階・カテゴリータグ */}
              <div className="flex justify-center space-x-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-sm font-medium">
                  {recipe.startStage}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-sm font-medium">
                  {recipe.category}
                </span>
              </div>

              {/* レシピ情報 */}
              <div className="flex justify-center space-x-6 text-sm text-stone-600 mb-4">
                <div className="flex items-center">
                  <ScheduleIcon />
                  <span className="ml-1">{recipe.cookingTime}</span>
                </div>
                <div className="flex items-center">
                  <PeopleIcon />
                  <span className="ml-1">{recipe.servings}</span>
                </div>
              </div>

              {/* レシピ説明 */}
              <p className="text-stone-600 text-center leading-relaxed mb-4">
                {recipe.description}
              </p>

              {/* アクションボタン(自作レシピの場合のみ表示) */}
              {recipe.isOwn && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => router.push(`/recipes/${id}/edit`)}
                    className=" py-2 px-3 rounded-full font-medium bg-stone-100 text-stone-600-600 hover:bg-violet-200 transition-colors"
                  >
                    <EditIcon />
                    <span className="ml-2">編集</span>
                  </button>

                  <button
                    onClick={handleDelete}
                    className="py-2 px-3 rounded-full font-medium bg-stone-100 text-stone-600 hover:bg-violet-200 transition-colors"
                  >
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
                  {recipe.ingredients.map((ingredient, index) => (
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
                {recipe.steps.map((step, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-5 shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-violet-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
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
            {recipe.tags.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
                  タグ
                </h3>
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
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
            {recipe.savedMemo && (
              <div className="mb-4 p-3 bg-stone-50 rounded-xl">
                <p className="text-sm text-stone-600 leading-relaxed">
                  <span className="font-medium text-stone-700">
                    前回のメモ:{" "}
                  </span>
                  {recipe.savedMemo}
                </p>
              </div>
            )}
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="アレンジ方法や感想を記録しましょう..."
              className="w-full p-3 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleMemoSave}
                className="px-6 py-2 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors font-medium"
              >
                メモを保存
              </button>
            </div>
          </div>
        </section> */}
          </>
        ) : (
          <NotFoundPage />
        )}
      </div>
      <Footer />
    </div>
  );
}
