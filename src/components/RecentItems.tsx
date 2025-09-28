"use client";

import Link from "next/link";
import { HistoryIcon } from "@/icons";
import Card from "@/components/ui/Card";
import useRecentItems from "@/hooks/useRecentItems";

export default function RecentItems() {
  const recentlyViewed = useRecentItems();
  const recentlyViewed5 = recentlyViewed.slice(0, 5);
  return (
    <>
      {recentlyViewed5.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-700 flex items-center">
              <div className="text-stone-400 mr-2">
                <HistoryIcon />
              </div>
              最近見たもの
            </h2>
            <Link
              href="/search/history"
              className="text-sm text-violet-400 hover:text-violet-500 transition-colors"
            >
              すべて見る
            </Link>
          </div>
          <Card cardItems={recentlyViewed5} className="bg-stone-100" />
        </section>
      )}
    </>
  );
}
