import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userIdAtom, childIdAtom } from "@/lib/atoms";
import { upsertIngredientStatus, deleteIngredientStatus } from "@/lib/supabase";
import { Ingredient } from "@/types/types";

export const useIngredientStatusToggle = (ingredient: Ingredient) => {
  const [eaten, setEaten] = useState(ingredient.eaten);
  const [ng, setNG] = useState(ingredient.ng);

  const userId = useAtomValue(userIdAtom);
  const childId = useAtomValue(childIdAtom);
  const ingredientId = ingredient.id;

  useEffect(() => {
    setEaten(ingredient.eaten);
    setNG(ingredient.ng);
  }, [ingredient]);

  const toggleEaten = async () => {
    if (!userId || !childId) return;

    // 1. ローカル変数に確定
    const newEatenStatus = !eaten;
    const originalEatenStatus = eaten;
    const originalNgStatus = ng;

    // 2. UIを即時更新 (楽観的更新)
    setEaten(newEatenStatus);
    if (newEatenStatus) {
      setNG(false); // eatenがtrueになったらngはfalse
    }

    try {
      // 3. DB操作を実行
      if (newEatenStatus) {
        await upsertIngredientStatus(childId, ingredientId, "eaten", userId);
      } else {
        await deleteIngredientStatus(childId, ingredientId);
      }
    } catch (error) {
      console.error("DB更新エラー (eaten):", error);
      // 4. 失敗時にロールバック
      setEaten(originalEatenStatus);
      setNG(originalNgStatus);
      // TODO: ユーザーへのエラー通知
    }
  };

  const toggleNG = async () => {
    if (!userId || !childId) return;

    // 1. ローカル変数に確定
    const newNGStatus = !ng;
    const originalEatenStatus = eaten;
    const originalNgStatus = ng;

    // 2. UIを即時更新 (楽観的更新)
    setNG(newNGStatus);
    if (newNGStatus) {
      setEaten(false); // ngがtrueになったらeatenはfalse
    }

    try {
      // 3. DB操作を実行
      if (newNGStatus) {
        await upsertIngredientStatus(childId, ingredientId, "ng", userId);
      } else {
        await deleteIngredientStatus(childId, ingredientId);
      }
    } catch (error) {
      console.error("DB更新エラー (ng):", error);
      // 4. 失敗時にロールバック
      setEaten(originalEatenStatus);
      setNG(originalNgStatus);
      // TODO: ユーザーへのエラー通知
    }
  };

  return { eaten, ng, toggleEaten, toggleNG };
};
