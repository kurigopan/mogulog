"use client";

import { useState, useCallback } from "react";
import { FavoriteBorderIcon, FavoriteIcon } from "@/icons";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  favoriteUpdateAtom,
  loadingAtom,
  loginDialogSourceAtom,
  userIdAtom,
} from "@/lib/atoms";
import { toggleFavoriteItem } from "@/lib/supabase/supabase";
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
  const [isLoading, setIsLoading] = useAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);
  const setFavoriteUpdate = useSetAtom(favoriteUpdateAtom);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  const handleToggleFavorite = useCallback(async () => {
    if (!userId) {
      setLoginDialogSource("favoriteButton");
      return;
    }

    setIsLoading(true);
    const previousState = isFavorited;
    const newState = !previousState;
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
        setFavoriteUpdate({
          itemId,
          itemType,
          isFavorited: previousState,
          timestamp: Date.now(),
        });
        console.error(`お気に入り操作(${itemType})に失敗しました。`);
        alert(
          previousState
            ? "お気に入り解除に失敗しました。"
            : "お気に入り登録に失敗しました。"
        );
      } else {
        setIsFavorited(newState);
        setFavoriteUpdate({
          itemId,
          itemType,
          isFavorited: newState,
          timestamp: Date.now(), // 強制更新のためのタイムスタンプ
        });
      }
    } catch (error) {
      console.error("お気に入り操作中に予期せぬエラーが発生:", error);
      setIsFavorited(previousState);
      alert("処理中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  }, [userId, itemId, itemType, isFavorited, setFavoriteUpdate]);

  const heartIcon = isFavorited ? (
    <FavoriteIcon className="w-6 h-6" />
  ) : (
    <FavoriteBorderIcon className="w-6 h-6" />
  );
  const buttonStyle = isFavorited
    ? "text-red-500 hover:bg-stone-100"
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
