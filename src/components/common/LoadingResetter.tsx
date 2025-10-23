"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/utils/atoms";

export const LoadingResetter = () => {
  const setIsLoading = useSetAtom(loadingAtom);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // ページ遷移が完了した時点でローディングを終了
    setIsLoading(false);
  }, [pathname, searchParams, setIsLoading]);

  return null;
};
