"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowBackIosIcon,
  ShareIcon,
  EditIcon,
  FavoriteIcon,
  FavoriteBorderIcon,
  ScheduleIcon,
  PeopleIcon,
  InfoOutlineIcon,
} from "@/icons";
import { Tooltip, IconButton } from "@mui/material";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function RecipeDetail() {
  const [isFavorited, setIsFavorited] = useState(false);
  const [memo, setMemo] = useState("");

  // サンプルレシピデータ
  const recipe = {
    id: 1,
    name: "にんじんとかぼちゃの煮物",
    image: "/soup.jpg",
    author: "離乳食ママ",
    isOwn: false, // 自分が作成したレシピかどうか
    stages: ["中期", "後期"],
    cookingTime: "15分",
    servings: "1食分",
    description:
      "甘くて栄養満点！赤ちゃんが大好きな定番メニューです。自然の甘みで食べやすく、冷凍保存も可能です。",
    ingredients: [
      { name: "にんじん", amount: "30g", note: "皮を厚めに剥く" },
      { name: "かぼちゃ", amount: "30g", note: "種とワタを取り除く" },
      { name: "だし汁", amount: "100ml", note: "昆布だしがおすすめ" },
      { name: "しょうゆ", amount: "小さじ1/4", note: "後期から使用可能" },
    ],
    steps: [
      {
        step: 1,
        title: "野菜の下準備",
        description:
          "にんじんとかぼちゃを月齢に適した大きさに切る。にんじんは皮を厚めに剥き、かぼちゃは種とワタを取り除きます。",
        time: "3分",
        image: "https://placehold.co/600x400/E5E7EB/4B5563?text=Step+1",
      },
      {
        step: 2,
        title: "だし汁で煮る",
        description:
          "小鍋にだし汁を入れ、切った野菜を加えて弱火で煮込みます。野菜が柔らかくなるまで約10分煮込みます。",
        time: "10分",
        image: "https://placehold.co/600x400/E5E7EB/4B5563?text=Step+2",
      },
      {
        step: 3,
        title: "味付けと仕上げ",
        description:
          "野菜が柔らかくなったら、後期の場合は少量のしょうゆを加えます。中期までは味付けなしで自然の甘みを楽しみます。",
        time: "2分",
        image: "",
      },
    ],
    tags: ["野菜", "煮物", "冷凍OK", "作り置きOK"],
    savedMemo: "少し多めに作って冷凍保存。解凍後は少し水分を足すと良い。",
  };

  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);
  };

  const handleMemoSave = () => {
    // メモ保存処理
    console.log("メモを保存:", memo);
  };

  const content = (
    <div className="flex items-center space-x-2">
      <button className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
        <ShareIcon />
      </button>
      <button
        onClick={handleFavoriteClick}
        className={`p-2 rounded-lg transition-colors ${
          isFavorited
            ? "bg-red-100 text-red-500 hover:bg-red-200"
            : "hover:bg-stone-100 text-stone-500"
        }`}
      >
        {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </button>
    </div>
  );

  // 補足テキスト
  const infoText = "自分専用なので他の人は見れません";

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        icon={<ArrowBackIosIcon />}
        title="レシピ詳細"
        content={content}
      />
      <div className="p-4 space-y-6">
        {/* レシピヘッダー */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="text-center mb-4">
            {/* 画像があれば表示する */}
            <div className="w-[300px] h-[300px] overflow-hidden mx-auto mb-2">
              {recipe.image && (
                <Image
                  src={recipe.image}
                  alt={`${recipe.name}の画像`}
                  width={300}
                  height={300}
                  className="object-contain rounded-2xl"
                  unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-stone-700 mb-2">
              {recipe.name}
            </h2>
            <p className="text-sm text-stone-500 mb-3">by {recipe.author}</p>

            {/* 離乳食段階タグ */}
            <div className="flex justify-center space-x-2 mb-4">
              {recipe.stages.map((stage, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-sm font-medium"
                >
                  離乳食{stage}
                </span>
              ))}
            </div>

            {/* レシピ情報 */}
            <div className="flex justify-center space-x-6 text-sm text-stone-600">
              <div className="flex items-center">
                <ScheduleIcon />
                <span className="ml-1">{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center">
                <PeopleIcon />
                <span className="ml-1">{recipe.servings}</span>
              </div>
            </div>
          </div>

          <p className="text-stone-600 text-center leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* アクションボタン */}
          <div className="flex space-x-3">
            {recipe.isOwn && (
              <button className="flex items-center justify-center py-3 px-4 rounded-2xl font-medium bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                <EditIcon />
                <span className="ml-2">編集</span>
              </button>
            )}
          </div>
        </div>

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
              <div key={index} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-stone-700">{step.title}</h4>
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                {/* 画像があれば表示する */}
                {step.image && (
                  <Image
                    src={step.image}
                    alt={`${step.title}の画像`}
                    width={400}
                    height={300}
                    className="w-full rounded-2xl shadow-sm"
                    unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                  />
                )}
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
          </section>
        )}

        {/* メモ */}
        <section>
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
              className="w-full p-3 border border-stone-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleMemoSave}
                className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors font-medium"
              >
                メモを保存
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
