import Link from "next/link";
import { SearchIcon, StarIcon, LocalFloristIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import AgeOptionsFilter from "@/components/AgeOptionsFilter";
import RecentItems from "@/components/RecentItems";
import RecommendedRecipes from "@/components/RecommendedRecipes";
import { Season } from "@/types/types";

// データベースからデータを取得する関数をインポート
import {
  getRecipes,
  getIngredientsWithStatus,
  getFavoriteRecipeLogs,
} from "@/lib/supabase";

// ユーザー情報と子どもの情報を取得するヘルパー関数を仮定
async function getUserAndChildInfo() {
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   // ユーザーがログインしていない場合の処理
  //   return null;
  // }

  // ここでは仮のデータを設定
  const userId = "32836782-4f6d-4dc3-92ea-4faf03ed86a5";
  const childId = 1;
  const childAgeStage = "中期"; // 例: '初期', '中期', '後期', '完了期'

  return { userId, childId, childAgeStage };
}

export default async function Home() {
  const userAndChildInfo = await getUserAndChildInfo();

  const { userId, childId, childAgeStage } = userAndChildInfo;

  // サーバー側でデータを非同期で取得
  const allRecipes = await getRecipes(userId);
  const allIngredients = await getIngredientsWithStatus(userId, childId);
  const favoriteRecipeLogs = await getFavoriteRecipeLogs();

  // 人気のレシピを計算
  const favoriteCounts = favoriteRecipeLogs.reduce((acc, recipeId) => {
    acc[recipeId] = (acc[recipeId] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const sortedRecipeIds = Object.entries(favoriteCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([id]) => parseInt(id, 10));

  const popularRecipes = allRecipes
    .filter((recipe) => recipe.startStage === childAgeStage)
    .sort(
      (a, b) => sortedRecipeIds.indexOf(a.id) - sortedRecipeIds.indexOf(b.id)
    )
    .slice(0, 5);

  // 旬の食材 (月齢と季節を考慮)
  const getSeasonalIngredients = () => {
    const stages = ["初期", "中期", "後期", "完了期"];
    const currentStageIndex = stages.indexOf(childAgeStage);
    const stagesToInclude = stages.slice(0, currentStageIndex + 1);

    const currentMonth = new Date().getMonth() + 1;
    let season: Season;
    if (currentMonth >= 3 && currentMonth <= 5) season = "春";
    else if (currentMonth >= 6 && currentMonth <= 8) season = "夏";
    else if (currentMonth >= 9 && currentMonth <= 11) season = "秋";
    else season = "冬";

    return allIngredients.filter(
      (ingredient) =>
        stagesToInclude.includes(ingredient.startStage) &&
        ingredient.season.includes(season)
    );
  };

  const seasonalIngredients = getSeasonalIngredients();

  return (
    <div className="min-h-screen bg-stone-50">
      <Header pageName="home" title="もぐログ" content={<AgeOptionsFilter />} />
      <div className="p-4 space-y-6">
        {/* 検索窓 */}
        <Link href="/search">
          <div className="relative cursor-pointer mb-4">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="レシピ・食材を検索"
              readOnly
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all shadow-sm hover:shadow-md"
              style={{ borderRadius: "50px" }}
            />
          </div>
        </Link>

        {/* 人気のレシピ */}
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-amber-300 mr-2">
              <StarIcon />
            </div>
            人気のレシピ
          </h2>
          <Card cardItems={popularRecipes} className="bg-amber-100" />
        </section>

        {/* 旬の食材 */}
        <section>
          <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
            <div className="text-blue-300 mr-2">
              <LocalFloristIcon />
            </div>
            旬の食材
          </h2>
          <Card cardItems={seasonalIngredients} className="bg-blue-100" />
        </section>

        {/* おすすめのレシピ  */}
        <RecommendedRecipes
          allRecipes={allRecipes}
          childAgeStage={childAgeStage}
        />

        {/* 最近見たもの */}
        <RecentItems />
      </div>
      <Footer />
    </div>
  );
}
