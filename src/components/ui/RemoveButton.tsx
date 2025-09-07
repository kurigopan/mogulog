"use client";

import { DeleteIcon } from "@/icons";
import { removeRecentlyViewedItems } from "@/lib/localstorage";

export default function RemoveButton() {
  const handleRemove = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm("閲覧履歴をすべて削除しますか？この操作は取り消せません。")
    ) {
      removeRecentlyViewedItems();
    }
  };

  return (
    <button
      onClick={(e) => handleRemove(e)}
      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
    >
      <DeleteIcon />
    </button>
  );
}
