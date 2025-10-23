"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SESSION_STORAGE_KEYS } from "@/lib/config/constants";

export function PrevPathObserver() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("pathname:", pathname);
    return () => {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.PREVIOUS_PATH, pathname);
    };
  }, [pathname]);

  return null;
}
