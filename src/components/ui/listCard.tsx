"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FavoriteIcon,
  FavoriteBorderIcon,
  ImageIcon,
  EditIcon,
  DeleteIcon,
} from "@/icons";
import { ListCardItem, Recipe } from "@/types/types";
import React from "react";

interface ListCardProps {
  listCardItems: ListCardItem[];
  pageName: pageType;
}

type pageType = "favorites" | "drafts" | "history" | "created" | "search";

export default function ListCard({ listCardItems, pageName }: ListCardProps) {
  const [cardItems, setListCardItems] = useState<ListCardItem[]>([]);

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLElement>,
    item: ListCardItem
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const updateCardItems = cardItems.map((prevItem) =>
      item.id == prevItem.id
        ? { ...prevItem, isFavorite: !prevItem.isFavorite }
        : prevItem
    );
    setListCardItems(updateCardItems);
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLElement>,
    item: ListCardItem
  ) => {
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

  const iconArea = (item: ListCardItem) => {
    switch (pageName) {
      case "search":
      case "favorites":
        return (
          <button
            onClick={(e) => handleFavoriteClick(e, item)}
            className={`p-2 rounded-full transition-colors ${
              item.isFavorite
                ? "text-red-500 hover:bg-red-200"
                : "hover:bg-stone-100 text-stone-500"
            }`}
          >
            {item.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </button>
        );
      case "drafts":
      case "created":
        return (
          <div className="flex">
            <Link
              href={`/recipes/${item.id}/edit`}
              className="p-2 text-stone-500 hover:text-blue-500 transition-colors"
              title="編集"
            >
              <EditIcon />
            </Link>
            <button
              onClick={(e) => handleDelete(e, item)}
              className="p-2 text-stone-500 hover:text-red-500 transition-colors"
              title="削除"
            >
              <DeleteIcon />
            </button>
          </div>
        );
      case "history":
        return (
          <button
            onClick={(e) => handleDelete(e, item)}
            className="p-2 text-red-400 hover:bg-red-600 transition-colors"
            title="削除"
          >
            <DeleteIcon />
          </button>
        );
    }
  };

  useEffect(() => {
    setListCardItems(listCardItems);
  }, [listCardItems]);

  return (
    <div className="grid grid-cols-1 gap-3">
      {cardItems.map((item) => (
        <Link
          key={item.id}
          href={
            item.type === "recipe"
              ? `/recipes/${item.id}`
              : `/ingredients/${item.id}`
          }
          className="block"
        >
          {/* レシピカード */}
          <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-[120px] h-[120px] flex items-center justify-center rounded-2xl overflow-hidden mx-auto transition-transform duration-300 group-hover:scale-110">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={150}
                      height={150}
                      className="rounded-2xl object-contain w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <ImageIcon
                      className="text-stone-200"
                      style={{ fontSize: 150 }}
                    />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-stone-700 text-lg group-hover:text-purple-600 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <p className="text-stone-500 text-sm group-hover:text-stone-600 transition-colors mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.subtitle && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-xs text-amber-600">
                        {item.subtitle}
                      </span>
                    )}
                    {item.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-pink-50 text-xs text-pink-600">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div>{iconArea(item)}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
