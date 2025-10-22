"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { prevPathAtom, searchStateAtom } from "@/lib/atoms";

export function usePreserveSearchState() {
  const setSearchState = useSetAtom(searchStateAtom);
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useAtom(prevPathAtom);

  useEffect(() => {
    if (!pathname) return;

    // 詳細ページから戻ってきた場合
    const isFromDetailPage =
      prevPath?.match(/^\/recipes\/\d+$/) ||
      prevPath?.match(/^\/ingredients\/\d+$/);

    // 詳細ページ以外から来た場合はリセット
    if (pathname === "/search") {
      if (!isFromDetailPage) {
        setSearchState({
          query: "",
          results: [],
          allergenExclusions: {},
        });
      }
    }
    setPrevPath(pathname);
  }, [pathname, setSearchState]);
}
