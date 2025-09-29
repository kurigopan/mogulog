import Link from "next/link";
import { SearchIcon, StarIcon, LocalFloristIcon, RecommendIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import AgeOptionsFilter from "@/components/AgeOptionsFilter";
import BrowsingHistory from "@/components/BrowsingHistory";
import {
  getUser,
  getChild,
  getSeasonalIngredients,
  getPopularRecipes,
  getRecommendedRecipes,
} from "@/lib/supabase";
import { calculateAgeInMonths, getAgeStage } from "@/lib/utils";

export default async function Home() {
  const user = await getUser();
  let childAgeStage: string = "初期";
  if (user) {
    const child = await getChild(user.id);
    if (child) {
      childAgeStage = getAgeStage(calculateAgeInMonths(child.birthday));
    }
  }

  const [popularRecipes, seasonalIngredients, recommendedRecipes] =
    await Promise.all([
      getPopularRecipes(childAgeStage),
      getSeasonalIngredients(childAgeStage),
      getRecommendedRecipes(childAgeStage),
    ]);

  const cardContents = [
    {
      id: "popular",
      title: "人気のレシピ",
      icon: <StarIcon />,
      color: "text-orange-300",
      bgColor: "bg-orange-100",
      cardItems: popularRecipes,
    },
    {
      id: "seasonal",
      title: "旬の食材",
      icon: <LocalFloristIcon />,
      color: "text-blue-300",
      bgColor: "bg-blue-100",
      cardItems: seasonalIngredients,
    },
    {
      id: "recommended",
      title: "おすすめのレシピ",
      icon: <RecommendIcon />,
      color: "text-pink-300",
      bgColor: "bg-pink-100",
      cardItems: recommendedRecipes,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header pageName="home" title="もぐログ" tools={<AgeOptionsFilter />} />
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
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all shadow-sm hover:shadow-md"
              // style={{ borderRadius: "50px" }}
            />
          </div>
        </Link>
        {/* 人気のレシピ・旬の食材・おすすめのレシピ */}
        <section>
          <div className="space-y-4">
            {cardContents.map((content) => (
              <div key={content.id}>
                <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center">
                  <div className={`mr-2 ${content.color}`}>{content.icon}</div>
                  {content.title}
                </h2>
                <Card
                  cardItems={content.cardItems}
                  className={content.bgColor}
                />
              </div>
            ))}
          </div>
        </section>
        {/* 閲覧履歴 */}
        <BrowsingHistory />
      </div>
      <Footer />
    </div>
  );
}
