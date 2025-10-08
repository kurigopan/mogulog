"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "@/icons";
import { ListCardItem, PageName } from "@/types";
import FavoriteButton from "@/components/ui/FavoriteButton";

type ListCardProps = {
  cardItems: ListCardItem[];
  pageName: PageName;
};

export default function ListCard({ cardItems, pageName }: ListCardProps) {
  const iconArea = (item: ListCardItem) => {
    if (
      pageName === "search" ||
      pageName === "history" ||
      pageName === "favorites"
    ) {
      return (
        <div
          onClick={(e) => e.preventDefault()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <FavoriteButton
            itemId={item.id}
            itemType={item.type}
            initialIsFavorited={item.isFavorite || false}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-3">
      {cardItems.map((item) => (
        <Link
          key={`${item.type}-${item.id}`}
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
                  <h3 className="font-semibold text-stone-700 text-lg group-hover:text-violet-600 transition-colors">
                    {item.name}
                  </h3>
                </div>

                <p className="text-stone-500 text-sm group-hover:text-stone-600 transition-colors mb-3 line-clamp-2">
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.startStage && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-xs text-amber-600">
                        {item.startStage}
                      </span>
                    )}
                    {item.category && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-pink-50 text-xs text-pink-600">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="flex-shrink-0">{iconArea(item)}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
