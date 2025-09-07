"use client";

import { useState, useEffect } from "react";
import { Recipe, Ingredient } from "@/types/types";

export default function useRecentItems() {
  const [recentlyViewed, setRecentlyViewed] = useState<(Recipe | Ingredient)[]>(
    []
  );

  useEffect(() => {
    // ローカルストレージから最近見たアイテムを取得
    try {
      const recentItems = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );

      setRecentlyViewed(recentItems);
    } catch (error) {
      console.error(
        "Failed to load recently viewed items from localStorage",
        error
      );
    }
  }, []);

  return recentlyViewed;
}
