"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingResetter = () => {
  const setLoading = useSetAtom(loadingAtom);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // ページ遷移が完了した時点でローディングを終了
    setLoading(false);
    console.log("LoadingResetter: set loading to false");
  }, [pathname, searchParams, setLoading]);

  return null;
};

export default LoadingResetter;
