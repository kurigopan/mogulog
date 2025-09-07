"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import { Tabs, Tab, Box } from "@mui/material";
import { CheckCircleIcon, CancelIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import NotFoundPage from "./notFound";
import { getIngredientsWithStatus, getRecipes } from "@/lib/supabase";
import { saveRecentlyViewedItem } from "@/lib/localstorage";
import { Ingredient, Recipe } from "@/types/types";
import ShareButton from "@/components/ui/ShareButton";

export default function IngredientDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrapParams = use(params);
  const id = Number(unwrapParams.id);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [relatedRecipes, setRelatedRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasEaten, setHasEaten] = useState(false);
  const [isNG, setIsNG] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // ユーザーIDと子どものIDを仮定。実際は認証情報やプロフィールから取得
  const userId = "32836782-4f6d-4dc3-92ea-4faf03ed86a5";
  const childId = 1; // getIngredientsWithStatusの引数と同じ値
  const childAgeStage = "中期"; // 例: プロフィール情報から取得

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredientsWithStatus(userId, childId);
        if (data) {
          setIngredients(data);
        }
      } catch (err) {
        setError("データの取得に失敗しました。");
        console.error(err);
      }
    };
    fetchIngredients();
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipes(userId);
        if (data) {
          setRecipes(data);
        }
      } catch (err) {
        setError("データの取得に失敗しました。");
        console.error(err);
      }
    };
    fetchRecipes();
  }, []);

  // 食材と全レシピが両方取得されたら、関連レシピをフィルタリング
  useEffect(() => {
    if (ingredients.length > 0 && recipes.length > 0) {
      const displayIngredient = ingredients.find((ing) => ing.id === id);
      if (displayIngredient) {
        // 全レシピから、この食材名を含むものを抽出
        const recipesWithIngredient = recipes.filter((recipe) =>
          recipe.ingredients.some((ing) => ing.name === displayIngredient.name)
        );
        // 子どもの月齢でフィルター
        const filteredRecipes = recipesWithIngredient.filter(
          (recipe) => recipe.startStage === childAgeStage
        );
        // シャッフルして先頭5件を推薦レシピに設定
        const shuffled = [...filteredRecipes].sort(() => 0.5 - Math.random());

        setRelatedRecipes(shuffled.slice(0, 5));
      }
    }
  }, [ingredients, recipes, id, childAgeStage]);

  const displayIngredient = ingredients.find((ing) => ing.id === id);

  // コンポーネントがマウントされた時に、ローカルストレージに保存
  useEffect(() => {
    if (displayIngredient) {
      saveRecentlyViewedItem(displayIngredient);
    }
  }, [displayIngredient]); // displayIngredientが取得されたタイミングで実行

  // 食材が見つからない場合は404ページを表示
  if (!displayIngredient) {
    return <NotFoundPage />;
  }

  const handleEatenClick = () => {
    setHasEaten((prev) => !prev);
  };

  const handleNGClick = () => {
    setIsNG((prev) => !prev);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const content = <ShareButton title={displayIngredient.name} />;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="食材詳細" content={content} />
      <div className="p-4 space-y-6">
        {/* 食材概要 */}
        <section>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="text-center mb-4">
              {/* 画像があれば表示する */}
              {displayIngredient.image && (
                <Image
                  src={displayIngredient.image}
                  alt={`${displayIngredient.name}の画像`}
                  width={150}
                  height={150}
                  className="rounded-3xl mb-4 mx-auto"
                  unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                />
              )}
              <h2 className="text-2xl font-bold text-stone-700 mb-4">
                {displayIngredient.name}
              </h2>
              {displayIngredient.season.map((s) => {
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
                {displayIngredient.category}
              </div>
            </div>
            <p className="text-stone-600 text-center leading-relaxed">
              {displayIngredient.description}
            </p>

            {/* 食べたNGボタン */}
            <div className="flex justify-center space-x-3 mt-6">
              <button
                onClick={handleEatenClick}
                className={`w-50 flex items-center justify-center py-3 px-4 rounded-full font-medium transition-all ${
                  hasEaten
                    ? "bg-green-100 text-green-600 border-2 border-green-200"
                    : "bg-stone-100 text-stone-600 hover:bg-green-50 border-2 border-transparent"
                }`}
              >
                <CheckCircleIcon />
                <span className="ml-2">食べた</span>
              </button>
              <button
                onClick={handleNGClick}
                className={`w-50 flex items-center justify-center py-3 px-4 rounded-full font-medium transition-all ${
                  isNG
                    ? "bg-red-100 text-red-600 border-2 border-red-200"
                    : "bg-stone-100 text-stone-600 hover:bg-red-50 border-2 border-transparent"
                }`}
              >
                <CancelIcon />
                <span className="ml-2">NG</span>
              </button>
            </div>
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
                {displayIngredient.stageInfo.map((info, index) => (
                  <Tab key={index} label={`${info.stage}`} />
                ))}
              </Tabs>
            </Box>

            {/* 離乳食段階別内容 */}
            <div className="p-6">
              {displayIngredient.stageInfo.map((info, index) => (
                <div
                  key={index}
                  className={`${selectedTab === index ? "block" : "hidden"}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-stone-700">
                      離乳食{info.stage}
                    </h4>
                    <span className="bg-purple-50 text-purple-600 px-3 py-2 rounded-full text-sm font-medium">
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
          <h3 className="text-lg font-bold text-stone-700 mb-4">栄養情報</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between w-full mb-4">
              <span className="font-medium text-stone-700">カロリー</span>
              <span className="text-stone-600">
                {displayIngredient.nutrition.calories}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span className="font-medium text-stone-700 flex-shrink-0">
                主な栄養素
              </span>
              <div className="flex flex-wrap gap-2 ml-2">
                {displayIngredient.nutrition.nutrients.map(
                  (nutrient, index) => (
                    <span
                      key={index}
                      className="text-xs bg-amber-50 text-amber-600 px-3 py-2 rounded-full whitespace-nowrap"
                    >
                      {nutrient}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 調理のコツ */}
        <section>
          <h3 className="text-lg font-bold text-stone-700 mb-4">調理のコツ</h3>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <ul className="list-disc list-inside space-y-2 text-stone-600 text-sm">
              {displayIngredient.tips.map((tip, index) => (
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
            <Card cardItems={relatedRecipes} className="bg-purple-100" />
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
