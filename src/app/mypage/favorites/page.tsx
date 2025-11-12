"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FavoriteBorderIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import { useAtomValue, useSetAtom } from "jotai";
import {
  favoriteUpdateAtom,
  loadingAtom,
  loginDialogSourceAtom,
  userIdAtom,
} from "@/lib/utils/atoms";
import { getFavoriteIngredients, getFavoriteRecipes } from "@/lib/supabase";
import type { ListCardItem } from "@/types";

export default function Favorites() {
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const favoriteUpdate = useAtomValue(favoriteUpdateAtom);
  const [favoriteRecipes, setFavoriteRecipes] = useState<ListCardItem[]>([]);
  const [favoriteIngredients, setFavoriteIngredients] = useState<
    ListCardItem[]
  >([]);

  useEffect(() => {
    if (userId === undefined) {
      return;
    }
    if (userId === null) {
      setLoginDialogSource("favorites");
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const [recipes, ingredients] = await Promise.all([
          getFavoriteRecipes(userId),
          getFavoriteIngredients(userId),
        ]);
        setFavoriteRecipes(recipes.map((r) => ({ ...r, isFavorite: true })));
        setFavoriteIngredients(
          ingredients.map((i) => ({ ...i, isFavorite: true })),
        );
      } catch (error) {
        // TODO: エラーダイアログ
        alert("処理中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  useEffect(() => {
    if (!favoriteUpdate) return;

    const { itemId, itemType, isFavorited } = favoriteUpdate;

    const updateList = (prevList: ListCardItem[]) => {
      return prevList.map((item) => {
        if (item.id === itemId && item.type === itemType) {
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
    <>
      <Header title="お気に入り" />
      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {displayItems.length > 0 ? (
          <ListCard cardItems={displayItems} pageName={"favorites"} />
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center">
              <FavoriteBorderIcon className="text-violet-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4">
              お気に入りがありません
            </h3>
            <p className="text-stone-500 mb-6">
              お気に入りを見つけたら、ハートマークを押して
              <br />
              お気に入りに追加してみてください
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-violet-400 text-white rounded-2xl hover:bg-violet-600 transition-colors font-medium"
            >
              さがしにいく
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
