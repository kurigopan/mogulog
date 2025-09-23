"use client";

import React from "react";
import { useEffect } from "react";
import Link from "next/link";
import { HistoryIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import useRecentItems from "@/hooks/useRecentItems";
import RemoveButton from "@/components/ui/RemoveButton";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";

export default function RecentViewed() {
  const setLoading = useSetAtom(loadingAtom);
  const recentlyViewed = useRecentItems();

  useEffect(() => {
    // Simulate API call to fetch recent viewed items
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="最近見たもの" content={<RemoveButton />} />

      <div className="p-4 space-y-6">
        {/* アイテム一覧 */}
        {recentlyViewed.length > 0 ? (
          <ListCard cardItems={recentlyViewed} pageName="history" />
        ) : recentlyViewed.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <HistoryIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              閲覧履歴がありません
            </h3>
            <p className="text-stone-500 mb-6">
              レシピや食材を見ると、
              <br />
              こちらに履歴として記録されます。
            </p>
            <Link
              href="/home"
              className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
            >
              ホームに戻る
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
              <HistoryIcon className="text-stone-300 text-3xl" />
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-2">
              該当する履歴がありません
            </h3>
            <p className="text-stone-500 mb-6">
              選択したフィルターに該当する履歴がありません。
              <br />
              フィルターを変更してみてください。
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
