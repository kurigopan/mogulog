import { Recipe, Ingredient } from "@/types/types";

// ローカルストレージに保存するキー
const RECENTLY_VIEWED_KEY = "recentlyViewed";

export const saveRecentlyViewedItem = (
  item: Recipe | Ingredient
): (Recipe | Ingredient)[] => {
  // ローカルストレージから既存のアイテムを取得
  try {
    const recentItemsString = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const recentItems: (Recipe | Ingredient)[] = recentItemsString
      ? JSON.parse(recentItemsString)
      : [];

    // 重複を避けるため、同じIDのアイテムを一度削除
    const filteredItems = recentItems.filter((i) => i.id !== item.id);

    // 新しいアイテムを配列の先頭に追加
    const newRecentItems = [item, ...filteredItems].slice(0, 10); // 最大10件を保持

    // ローカルストレージに保存
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newRecentItems));

    return newRecentItems;
  } catch (error) {
    console.error("Failed to save item to localStorage", error);
    return [];
  }
};

export const removeRecentlyViewedItems = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  } catch (error) {
    console.error(
      "Failed to reset recently viewed items to localStorage",
      error
    );
  }
};
