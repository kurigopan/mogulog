"use client";

import { ClearIcon, DeleteIcon } from "@/icons";
import { CardItem } from "@/types";

export default function DeleteButton() {
  const handleDelete = (e: React.MouseEvent<HTMLElement>, item: CardItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        `「${item.name}」を削除しますか？この操作は取り消せません。`
      )
    ) {
      const updateCardItems = cardItems.filter(
        (prevItem) => item.id !== prevItem.id
      );
      setListCardItems(updateCardItems);
    }
  };
  return (
    <button
      onClick={(e) => handleDelete(e, item)}
      className="p-2 text-stone-500 hover:text-red-500 transition-colors"
      title="削除"
    >
      <ClearIcon />
    </button>
  );
}
