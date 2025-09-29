import { ListCardItem } from "@/types/types";

// ローカルストレージに保存するキー
const VIEWED_KEY = "viewedItems";

export const savedBrowsingHistory = (item: ListCardItem): void => {
  try {
    const viewedItemsString = localStorage.getItem(VIEWED_KEY);
    const viewedItems: ListCardItem[] = viewedItemsString
      ? JSON.parse(viewedItemsString)
      : [];

    // 重複を避けるため、同じIDのアイテムを一度削除
    const filteredItems = viewedItems.filter((i) => i.id !== item.id);

    // 新しいアイテムを配列の先頭に追加
    const newViewedItems = [item, ...filteredItems].slice(0, 20); // 最大20件を保持

    // ローカルストレージに保存
    localStorage.setItem(VIEWED_KEY, JSON.stringify(newViewedItems));
  } catch (error) {
    console.error("Failed to save browsing history to localStorage", error);
  }
};

export const getBrowsingHistory = (limit?: number): ListCardItem[] => {
  try {
    const viewedItemsString = localStorage.getItem(VIEWED_KEY);
    const viewedItems: ListCardItem[] = viewedItemsString
      ? JSON.parse(viewedItemsString)
      : [];
    return limit ? viewedItems.slice(0, limit) : viewedItems;
  } catch (error) {
    console.error("Failed to get browsing history from localStorage", error);
    return [];
  }
};

export const removeBrowsingHistory = () => {
  try {
    localStorage.removeItem(VIEWED_KEY);
  } catch (error) {
    console.error("Failed to reset viewed items to localStorage", error);
  }
};
