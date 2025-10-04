"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryIcon } from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ListCard from "@/components/ui/ListCard";
import RemoveButton from "@/components/ui/RemoveButton";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { getBrowsingHistory } from "@/utils/localstorage";
import { ListCardItem } from "@/types/types";

export default function BrowsingHistoryPage() {
  const setIsLoading = useSetAtom(loadingAtom);
  const [browsingHistory, setBrowsingHistory] = useState<ListCardItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const history = getBrowsingHistory();
    setBrowsingHistory(history);
    setIsLoading(false);
  }, [setIsLoading]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="閲覧履歴" tools={<RemoveButton />} />

      <div className="p-4 space-y-6">
        {/* アイテム一覧 */}
        {browsingHistory.length > 0 ? (
          <ListCard cardItems={browsingHistory} pageName="history" />
        ) : browsingHistory.length === 0 ? (
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
              className="inline-flex items-center px-6 py-3 bg-violet-500 text-white rounded-full hover:bg-violet-600 transition-colors font-medium"
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
