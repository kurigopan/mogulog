"use client";

import { useState, useCallback } from "react";
import { FavoriteBorderIcon, FavoriteIcon } from "@/icons";
import { useAtomValue, useSetAtom } from "jotai";
import { loginDialogAtom, sessionAtom, userIdAtom } from "@/lib/atoms";
import { toggleFavoriteItem } from "@/lib/supabase";
import { Type } from "@/types/types";

type FavoriteButtonProps = {
  itemId: number;
  itemType: Type;
  initialIsFavorited: boolean;
};

export default function FavoriteButton({
  itemId,
  itemType,
  initialIsFavorited,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogOpen = useSetAtom(loginDialogAtom);

  const handleToggleFavorite = useCallback(async () => {
    if (!userId) {
      setLoginDialogOpen(true);
      return;
    }

    setIsLoading(true);
    const previousState = isFavorited;

    try {
      const success = await toggleFavoriteItem(
        userId,
        itemId,
        itemType,
        previousState
      );

      if (!success) {
        // 失敗時、状態を元に戻す
        setIsFavorited(previousState);
        console.error(`お気に入り操作(${itemType})に失敗しました。`);
        alert(
          previousState
            ? "お気に入り解除に失敗しました。"
            : "お気に入り登録に失敗しました。"
        );
      } else {
        setIsFavorited(!previousState);
      }
    } catch (error) {
      console.error("お気に入り操作中に予期せぬエラーが発生:", error);
      setIsFavorited(previousState);
      alert("処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [userId, itemId, itemType, isFavorited]);

  const heartIcon = isFavorited ? (
    <FavoriteIcon className="w-6 h-6" />
  ) : (
    <FavoriteBorderIcon className="w-6 h-6" />
  );
  const buttonStyle = isFavorited
    ? "bg-red-100 text-red-500 hover:bg-red-200"
    : "hover:bg-stone-100 text-stone-500";

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={`${isFavorited ? "解除" : "登録"}: ${itemType}お気に入り`}
      className={`p-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${buttonStyle}`}
    >
      {heartIcon}
    </button>
  );
}
