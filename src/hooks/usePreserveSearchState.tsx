"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { searchStateAtom } from "@/lib/utils/atoms";
import { SESSION_STORAGE_KEYS } from "@/lib/config/constants";

export function usePreserveSearchState() {
  const setSearchState = useSetAtom(searchStateAtom);

  useEffect(() => {
    const prevPath = sessionStorage.getItem(SESSION_STORAGE_KEYS.PREVIOUS_PATH);

    // 詳細ページから戻ってきたかを判定
    const isFromDetailPage =
      prevPath?.match(/^\/recipes\/\d+$/) ||
      prevPath?.match(/^\/ingredients\/\d+$/);

    // 詳細ページ以外からの遷移の場合は、検索状態をリセット
    if (!isFromDetailPage) {
      setSearchState({
        query: "",
        results: [],
        allergenExclusions: {},
      });
    }
  }, [setSearchState]);
}
