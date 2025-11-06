"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/icons";
import Header from "@/components/layout/Header";
import AgeOptionsFilter from "@/components/features/AgeOptionsFilter";
import AgeFilteredContent from "@/components/features/AgeFilteredContent";
import BrowsingHistory from "@/components/common/BrowsingHistory";
import { useAtom } from "jotai";
import { childAgeStageAtom } from "@/lib/utils/atoms";
import { CardContent } from "@/types";

interface HomeClientWrapperProps {
  initialChildAgeStage: string;
  initialCardContents: CardContent[];
}

export default function HomeClientWrapper({
  initialChildAgeStage,
  initialCardContents,
}: HomeClientWrapperProps) {
  const router = useRouter();
  const [activeChildAgeStage, setActiveChildAgeStage] =
    useAtom(childAgeStageAtom);

  useEffect(() => {
    if (activeChildAgeStage === null) {
      setActiveChildAgeStage(initialChildAgeStage);
    }
  }, [activeChildAgeStage, initialChildAgeStage, setActiveChildAgeStage]);

  const handleChildAgeStageChangeAction = useCallback(
    (newAge: string) => {
      setActiveChildAgeStage(newAge);
    },
    [setActiveChildAgeStage],
  );

  if (activeChildAgeStage === null) {
    return null;
  }

  return (
    <>
      <Header
        pageName="home"
        title="もぐログ"
        tools={
          <AgeOptionsFilter
            onChildAgeStageChangeAction={handleChildAgeStageChangeAction}
          />
        }
      />
      <div className="p-4 space-y-6">
        {/* 検索窓 */}
        <div className="relative mb-4" onClick={() => router.push("/search")}>
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
        <AgeFilteredContent initialCardContents={initialCardContents} />
        {/* 閲覧履歴 */}
        <BrowsingHistory />
      </div>
    </>
  );
}
