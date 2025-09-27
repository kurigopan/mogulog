import Link from "next/link";
import { SearchIcon, StarIcon, LocalFloristIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import AgeOptionsFilter from "@/components/AgeOptionsFilter";
import RecentItems from "@/components/RecentItems";
import RecommendedRecipes from "@/components/RecommendedRecipes";
import { CardItem } from "@/types/types";
import {
  getRecipes,
  getIngredientsWithStatus,
  getUser,
  getChild,
} from "@/lib/supabase";
import {
  calculateAgeInMonths,
  getAgeStage,
  getPopularRecipes,
  getSeasonalIngredients,
} from "@/lib/utils";

export default async function Home() {
  const user = await getUser();
  let popularRecipes: CardItem[] = [];
  let seasonalIngredients: CardItem[] = [];
  let childAgeStage: string = "初期";
  let allRecipes: CardItem[] = [];
  if (user) {
    const userId = user.id;
    const child = await getChild(userId);
    if (!child) {
      return null;
    }
    const childId = child.id;
    childAgeStage = getAgeStage(calculateAgeInMonths(child.birthday));
    allRecipes = await getRecipes(userId);

    const allIngredients = await getIngredientsWithStatus(userId, childId);
    popularRecipes = await getPopularRecipes(allRecipes, childAgeStage);
    seasonalIngredients = getSeasonalIngredients(childAgeStage, allIngredients);
  } else {
    allRecipes = await getRecipes();
    const allIngredients = await getIngredientsWithStatus();
    popularRecipes = await getPopularRecipes(allRecipes, "初期");
    seasonalIngredients = getSeasonalIngredients("初期", allIngredients);
  }

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
        <RecommendedRecipes childAgeStage={childAgeStage} />

        {/* 最近見たもの */}
        <RecentItems />
      </div>
      <Footer />
    </div>
  );
}
