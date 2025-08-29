"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, Tab, Box } from "@mui/material";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Card from "@/components/ui/card";
import { ShareIcon, CheckCircleIcon, CancelIcon } from "@/icons";
import { mockIngredients } from "@/mocks/ingredients";
import { mockRecipes } from "@/mocks/recipes";

export default function IngredientDetail() {
  const [hasEaten, setHasEaten] = useState(false);
  const [isNG, setIsNG] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const handleEatenClick = () => {
    setHasEaten((prev) => !prev);
  };

  const handleNGClick = () => {
    setIsNG((prev) => !prev);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const content = (
    <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
      <ShareIcon />
    </button>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="食材詳細" content={content} />
      <div className="p-4 space-y-6">
        {/* 食材概要 */}
        <section>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="text-center mb-4">
              {/* 画像があれば表示する */}
              {mockIngredients[0].image && (
                <Image
                  src={mockIngredients[0].image}
                  alt={`${mockIngredients[0].name}の画像`}
                  width={150}
                  height={150}
                  className="rounded-3xl mb-4 mx-auto"
                  unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                />
              )}
              <h2 className="text-2xl font-bold text-stone-700 mb-4">
                {mockIngredients[0].name}
              </h2>
              <div className="inline-flex items-center px-3 py-2 rounded-full bg-green-50 text-green-600 text-sm">
                {mockIngredients[0].season}
              </div>
            </div>
            <p className="text-stone-600 text-center leading-relaxed">
              {mockIngredients[0].description}
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
                {mockIngredients[0].stageInfo.map((info, index) => (
                  <Tab key={index} label={`${info.stage}`} />
                ))}
              </Tabs>
            </Box>

            {/* 離乳食段階別内容 */}
            <div className="p-6">
              {mockIngredients[0].stageInfo.map((info, index) => (
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
                {mockIngredients[0].nutrition.calories}
              </span>
            </div>
            <div className="flex justify-between w-full">
              <span className="font-medium text-stone-700 flex-shrink-0">
                主な栄養素
              </span>
              <div className="flex flex-wrap gap-2 ml-2">
                {mockIngredients[0].nutrition.nutrients.map(
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
              {mockIngredients[0].tips.map((tip, index) => (
                <li key={index} className="flex items-center">
                  ・{tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 関連レシピ */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-700">関連レシピ</h3>
            <button className="text-sm text-purple-400 hover:text-purple-500 transition-colors">
              すべて見る
            </button>
          </div>
          <Card cardItems={mockRecipes} className="bg-purple-100" />
        </section>
      </div>
      <Footer />
    </div>
  );
}
