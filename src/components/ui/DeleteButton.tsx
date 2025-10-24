"use client";

import { ClearIcon } from "@/icons";
import { CardItem } from "@/types";

type DeleteButtonProps = {
  item: CardItem;
  cardItems: CardItem[];
  setListCardItems: React.Dispatch<React.SetStateAction<CardItem[]>>;
};

export default function DeleteButton({
  item,
  cardItems,
  setListCardItems,
}: DeleteButtonProps) {
  const handleDelete = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      window.confirm(
        `「${item.name}」を削除しますか？この操作は取り消せません。`,
      )
    ) {
      const updateCardItems = cardItems.filter(
        (prevItem) => item.id !== prevItem.id,
      );
      setListCardItems(updateCardItems);
    }
  };
  return (
    <button
      onClick={handleDelete}
      className="p-2 text-stone-500 hover:text-red-500 transition-colors"
      title="削除"
    >
      <ClearIcon />
    </button>
  );
}
