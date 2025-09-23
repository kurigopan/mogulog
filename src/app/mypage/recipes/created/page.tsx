"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateIcon } from "@/icons";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ListCard from "@/components/ui/ListCard";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/atoms";
import { getRecipesCreatedByUser } from "@/lib/supabase";
import { CardItem } from "@/types/types";

export default function CreatedRecipes() {
  const setLoading = useSetAtom(loadingAtom);
  const [createdRecipes, setCreatedRecipes] = useState<CardItem[]>([]);
  const userId = useAtomValue(userIdAtom);
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push("/");
      return;
    }
    setLoading(true);
    const fetchRecipes = async () => {
      const recipes = await getRecipesCreatedByUser(userId);
      setCreatedRecipes(recipes);
    };
    fetchRecipes();
    setLoading(false);
  }, [userId]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="作成したレシピ" />

      <div className="p-4 space-y-6">
        {/* レシピ一覧 */}
        {createdRecipes.length > 0 ? (
          <ListCard cardItems={createdRecipes} pageName={"created"} />
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <CreateIcon className="text-purple-500 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4">
              まだレシピを作成していません
            </h3>
            <p className="text-stone-500 mb-6">
              オリジナルのレシピを作成して、
              <br />
              他のママ・パパと共有してみませんか？
            </p>
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-6 py-3 bg-purple-400 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              新しいレシピを作成
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
