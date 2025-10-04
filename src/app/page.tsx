import HomeClientWrapper from "@/components/features/HomeClientWrapper";
import Footer from "@/components/layout/Footer";
import {
  getUser,
  getChild,
  getSeasonalIngredients,
  getPopularRecipes,
  getRecommendedRecipes,
} from "@/lib/supabase/supabase";
import {
  calculateAgeInMonths,
  getAgeStage,
  getCardContents,
} from "@/utils/utils";

export default async function Home() {
  const user = await getUser();
  let initialChildAgeStage: string = "初期";
  if (user) {
    const child = await getChild(user.id);
    if (child) {
      initialChildAgeStage = getAgeStage(calculateAgeInMonths(child.birthday));
    }
  }

  const [
    initialPopularRecipes,
    initialSeasonalIngredients,
    initialRecommendedRecipes,
  ] = await Promise.all([
    getPopularRecipes(initialChildAgeStage),
    getSeasonalIngredients(initialChildAgeStage),
    getRecommendedRecipes(initialChildAgeStage),
  ]);

  const initialCardContents = getCardContents({
    popularRecipes: initialPopularRecipes,
    seasonalIngredients: initialSeasonalIngredients,
    recommendedRecipes: initialRecommendedRecipes,
  });

  return (
    <div className="min-h-screen bg-stone-50">
      <HomeClientWrapper
        initialChildAgeStage={initialChildAgeStage}
        initialCardContents={initialCardContents}
      />
      <Footer />
    </div>
  );
}
