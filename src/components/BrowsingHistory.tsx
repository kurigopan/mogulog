"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HistoryIcon } from "@/icons";
import Card from "@/components/ui/Card";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { getBrowsingHistory } from "@/lib/localstorage";
import { ListCardItem } from "@/types/types";

export default function BrowsingHistory() {
  const setLoading = useSetAtom(loadingAtom);
  const [browsingHistory, setBrowsingHistory] = useState<ListCardItem[]>([]);

  useEffect(() => {
    setLoading(true);
    const history = getBrowsingHistory(5);
    setBrowsingHistory(history);
    setLoading(false);
  }, [setLoading]);

  return (
    <>
      {browsingHistory.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-700 flex items-center">
              <div className="text-stone-400 mr-2">
                <HistoryIcon />
              </div>
              閲覧履歴
            </h2>
            <Link
              href="/search/history"
              className="text-sm text-violet-400 hover:text-violet-500 transition-colors"
            >
              すべて見る
            </Link>
          </div>
          <Card cardItems={browsingHistory} className="bg-stone-100" />
        </section>
      )}
    </>
  );
}
