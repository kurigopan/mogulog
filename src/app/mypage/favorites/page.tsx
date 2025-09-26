"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FavoriteBorderIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import { useAtomValue, useSetAtom } from "jotai";
import { favoriteUpdateAtom, loadingAtom, userIdAtom } from "@/lib/atoms";
import { getFavoriteIngredients, getFavoriteRecipes } from "@/lib/supabase";
import { ListCardItem } from "@/types/types";

export default function Favorites() {
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);
  const [favoriteRecipes, setFavoriteRecipes] = useState<ListCardItem[]>([]);
  const [favoriteIngredients, setFavoriteIngredients] = useState<
    ListCardItem[]
  >([]);
  const userId = useAtomValue(userIdAtom);
  const favoriteUpdate = useAtomValue(favoriteUpdateAtom);
  // const [removedItemKeys, setRemovedItemKeys] = useState<string[]>([]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchFavorites = async () => {
        const recipes = await getFavoriteRecipes(userId);
        setFavoriteRecipes(recipes.map((r) => ({ ...r, isFavorite: true })));
        const ingredients = await getFavoriteIngredients(userId);
        setFavoriteIngredients(
          ingredients.map((i) => ({ ...i, isFavorite: true }))
        );
      };
      fetchFavorites();
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [userId]);

  useEffect(() => {
    if (!favoriteUpdate) return;

    const { itemId, itemType, isFavorited } = favoriteUpdate;

    const updateList = (prevList: ListCardItem[]) => {
      // リスト全体をマップし、対象アイテムの isFavorite フラグを更新
      return prevList.map((item) => {
        if (item.id === itemId && item.type === itemType) {
          // ⭐️ isFavorite フラグをトグル（これでハートの塗りつぶし状態が変わる）
          return { ...item, isFavorite: isFavorited };
        }
        return item;
      });
    };

    if (itemType === "recipe") {
      setFavoriteRecipes(updateList);
    } else if (itemType === "ingredient") {
      setFavoriteIngredients(updateList);
    }
  }, [favoriteUpdate]);

  const displayItems = [...favoriteIngredients, ...favoriteRecipes];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="お気に入り" />
      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {displayItems.length > 0 ? (
          <ListCard cardItems={displayItems} pageName={"favorites"} />
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
