"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RecipeForm from "@/components/recipeForm";
import { ArrowBackIosIcon } from "@/icons";
import { Recipe } from "@/types/types";

// サンプルレシピデータ
// 実際のアプリケーションでは、IDに基づいてAPIからデータを取得します
const sampleRecipeData: Recipe = {
  id: 1,
  name: "にんじんとかぼちゃの煮物",
  image: "/soup.jpg",
  subtitle: "",
  category: "",
  date: new Date(),
  isFavorite: false,
  author: "離乳食ママ",
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
  nutritionTips: [
    "ビタミンAとカロテンが豊富で、免疫力アップに効果的",
    "食物繊維が豊富で、お腹の調子を整えます",
    "自然の甘みで赤ちゃんも食べやすい味",
  ],
  tags: ["野菜", "煮物", "冷凍OK", "作り置きOK"],
  isPrivate: true,
};

// レシピ編集ページのコンポーネント
export default function RecipeEditPage() {
  const content = (
    <div className="flex items-center space-x-2">
      {/* 画面右側にボタンなどを配置する場合はここに記述します */}
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      <Header
        icon={<ArrowBackIosIcon />}
        title="レシピ編集"
        content={content}
      />
      {/* RecipeFormコンポーネントを呼び出し、既存データを渡します */}
      <RecipeForm initialData={sampleRecipeData} isEditMode={true} />
      <Footer />
    </div>
  );
}
