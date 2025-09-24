"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FavoriteBorderIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/atoms";
import { getFavoriteIngredients, getFavoriteRecipes } from "@/lib/supabase";
import { CardItem } from "@/types/types";

export default function FavoriteRecipes() {
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);
  const [favoriteRecipes, setFavoriteRecipes] = useState<CardItem[]>([]);
  const [favoriteIngredients, setFavoriteIngredients] = useState<CardItem[]>(
    []
  );
  const userId = useAtomValue(userIdAtom);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchFavorites = async () => {
        const recipes = await getFavoriteRecipes(userId);
        setFavoriteRecipes(recipes);
        const ingredients = await getFavoriteIngredients(userId);
        setFavoriteIngredients(ingredients);
      };
      fetchFavorites();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="お気に入り" />
      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {favoriteIngredients.length > 0 || favoriteRecipes.length > 0 ? (
          <ListCard
            cardItems={[...favoriteIngredients, ...favoriteRecipes]}
            pageName={"favorites"}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <FavoriteBorderIcon className="text-purple-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4">
              お気に入りがありません
            </h3>
            <p className="text-stone-500 mb-6">
              お気に入りを見つけたら、ハートマークを押して
              <br />
              お気に入りに追加してみてください。
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-purple-400 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              さがしにいく
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
