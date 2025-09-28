import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "@/icons";
import { CardItem } from "@/types/types";

interface CardProps {
  cardItems: CardItem[];
  className?: string;
}

export default function Card({ cardItems, className }: CardProps) {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2">
      {cardItems.map((item) => (
        <Link
          key={item.id}
          href={`/${item.type}s/${item.id}`}
          className="flex-shrink-0 w-40 bg-white rounded-3xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105 cursor-pointer group"
        >
          <div className="text-center">
            <div className="mb-2 transition-transform duration-300 group-hover:scale-110 w-[120px] h-[120px] flex items-center justify-center rounded-2xl overflow-hidden mx-auto">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded-2xl object-contain w-full h-full"
                  unoptimized // 画像がsvgの場合ブロックされてしまうため設定
                />
              ) : (
                <ImageIcon
                  className="text-stone-200"
                  style={{ fontSize: 150 }}
                />
              )}
            </div>
            <h3 className="font-medium text-stone-700 text-sm mb-1 group-hover:text-violet-600 transition-colors">
              {item.name}
            </h3>
            <div className="flex justify-center gap-4">
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                  className ?? ""
                } text-stone-600 mb-1 group-hover:bg-violet-100 transition-colors`}
              >
                {item.startStage}
              </div>
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                  className ?? ""
                } text-stone-600 mb-1 group-hover:bg-violet-100 transition-colors`}
              >
                {item.category}
              </div>
            </div>
            <p className="text-xs text-stone-500 group-hover:text-stone-600 transition-colors line-clamp-2">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
