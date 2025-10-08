"use client";

import { useState, useCallback } from "react";
import router from "next/router";
import { SearchIcon } from "@/icons";
import Header from "@/components/layout/Header";
import AgeOptionsFilter from "@/components/features/AgeOptionsFilter";
import AgeFilteredContent from "@/components/features/AgeFilteredContent";
import BrowsingHistory from "@/components/common/BrowsingHistory";
import { CardContent } from "@/types/types";

interface HomeClientWrapperProps {
  initialChildAgeStage: string;
  initialCardContents: CardContent[];
}

export default function HomeClientWrapper({
  initialChildAgeStage,
  initialCardContents,
}: HomeClientWrapperProps) {
  const [activeChildAgeStage, setActiveChildAgeStage] =
    useState(initialChildAgeStage);

  // AgeOptionsFilterから月齢変更を受け取るコールバック
  const handleChildAgeStageChange = useCallback((newAge: string) => {
    setActiveChildAgeStage(newAge);
  }, []);

  return (
    <>
      <Header
        pageName="home"
        title="もぐログ"
        tools={
          <AgeOptionsFilter
            initialChildAgeStage={activeChildAgeStage}
            onChildAgeStageChange={handleChildAgeStageChange}
          />
        }
      />
      <div className="p-4 space-y-6">
        {/* 検索窓 */}
        <div
          className="relative cursor-pointer mb-4"
          onClick={() => router.push("/search")}
        >
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="レシピ・食材を検索"
            readOnly
            className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition-all shadow-sm hover:shadow-md"
          />
        </div>
        {/* 月齢フィルターで変わるカードコンテンツ */}
        <AgeFilteredContent
          currentActiveAgeStage={activeChildAgeStage}
          initialCardContents={initialCardContents}
        />
        {/* 閲覧履歴 */}
        <BrowsingHistory />
      </div>
    </>
  );
}
