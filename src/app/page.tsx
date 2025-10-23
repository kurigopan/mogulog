import HomeClientWrapper from "@/components/features/HomeClientWrapper";
import Footer from "@/components/layout/Footer";
import {
  getPopularRecipes,
  getRecommendedRecipes,
  getSeasonalIngredients,
} from "@/lib/supabase";
import { getChildAgeStageForCurrentUser } from "@/lib/supabase/profiles.server";
import { getCardContents } from "@/lib/utils";

export default async function Home() {
  const initialChildAgeStage = await getChildAgeStageForCurrentUser();

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
    <>
      <HomeClientWrapper
        initialChildAgeStage={initialChildAgeStage}
        initialCardContents={initialCardContents}
      />
      <Footer pageName="home" />
    </>
  );
}
