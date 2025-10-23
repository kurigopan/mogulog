"use client";

import Link from "next/link";
import { HomeIcon, FavoriteIcon, ListIcon, PersonIcon, AddIcon } from "@/icons";
import { useAtomValue, useSetAtom } from "jotai";
import { loginDialogSourceAtom, userIdAtom } from "@/lib/utils/atoms";

type HeaderProps = {
  pageName?: pageType;
};

type pageType = "create" | "edit";

export default function Footer({ pageName }: HeaderProps) {
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const userId = useAtomValue(userIdAtom);

  const navigationButtons = [
    { href: "/", icon: <HomeIcon />, label: "ホーム" },
    {
      href: "/mypage/favorites",
      icon: <FavoriteIcon />,
      label: "お気に入り",
      requiresAuth: true,
    },
    { href: "/ingredients", icon: <ListIcon />, label: "食材リスト" },
    {
      href: "/mypage",
      icon: <PersonIcon />,
      label: "マイページ",
      requiresAuth: true,
    },
  ];

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    requiresAuth: boolean
  ) => {
    if (requiresAuth && !userId) {
      e.preventDefault();
      setLoginDialogSource("footer");
    }
  };

  return (
    <>
      {/* ナビゲーションボタン */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          {navigationButtons.map((button, index) => (
            <Link
              key={index}
              href={button.href}
              onClick={(e) => handleClick(e, button.requiresAuth || false)}
              className="flex flex-col items-center py-2 px-3 rounded-2xl hover:bg-violet-50 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="text-stone-400 mb-1">{button.icon}</div>
              <span className="text-xs text-stone-500 font-medium">
                {button.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {/* レシピ作成フローティングボタン */}
      {pageName !== "create" && pageName !== "edit" && (
        <div className="fixed bottom-24 right-4">
          <Link href="/recipes/create" onClick={(e) => handleClick(e, true)}>
            <button className="w-14 h-14 bg-gradient-to-r from-violet-400 to-violet-400 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group">
              <div className="text-white group-hover:rotate-90 transition-transform duration-200">
                <AddIcon />
              </div>
            </button>
          </Link>
        </div>
      )}

      {/* 下部余白 */}
      <div className="h-20"></div>
    </>
  );
}
