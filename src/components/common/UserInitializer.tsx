"use client";

import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import {
  parentInfoAtom,
  childInfoAtom,
  allergensAtom,
  loadingAtom,
  userIdAtom,
  childIdAtom,
} from "@/lib/atoms";
import {
  getProfile,
  getChild,
  getAllergens,
  getChildAllergens,
  supabase,
} from "@/lib/supabase/supabase";
import { calculateAgeInMonths, getAgeStage } from "@/utils/utils";

export const UserInitializer = () => {
  const setIsLoading = useSetAtom(loadingAtom);
  const setUserId = useSetAtom(userIdAtom);
  const setParentInfo = useSetAtom(parentInfoAtom);
  const setChildId = useSetAtom(childIdAtom);
  const setChildInfo = useSetAtom(childInfoAtom);
  const setAllergens = useSetAtom(allergensAtom);

  // 初回ロード完了フラグ
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  useEffect(() => {
    const initializeUserSession = async () => {
      setIsLoading(true);
      try {
        // 現在のセッション情報を取得
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const currentUserId = session.user.id;
          setUserId(currentUserId);

          const [profileData, childData, allergensResponse] = await Promise.all(
            [getProfile(currentUserId), getChild(currentUserId), getAllergens()]
          );

          if (allergensResponse) {
            setAllergens(allergensResponse);
          }
          if (profileData) {
            setParentInfo({
              id: currentUserId,
              name: profileData.name || "親",
              avatar_url: profileData.avatar_url || null,
              email: session.user.email || "未設定",
              joinDate:
                (profileData.created_at &&
                  new Date(profileData.created_at).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                  })) ||
                "不明",
            });
          }
          if (childData) {
            const childAllergenData = await getChildAllergens(childData.id);
            setChildInfo({
              id: childData.id || 0,
              name: childData.name || "こども",
              birthday: childData.birthday || "未設定",
              age:
                (childData.birthday &&
                  calculateAgeInMonths(childData.birthday)) + "ヶ月" ||
                "未設定",
              ageStage:
                (childData.birthday &&
                  getAgeStage(calculateAgeInMonths(childData.birthday))) ||
                "未設定",
              allergens: childAllergenData || [],
            });
            setChildId(childData.id);
          } else {
            // 子供情報がない場合の初期化
            setChildInfo({
              id: 0,
              name: "こども",
              birthday: "未設定",
              age: "未設定",
              ageStage: "未設定",
              allergens: [],
            });
            setChildId(null);
          }
        } else {
          // セッションがない場合（未ログイン）
          setUserId(null);
          setChildId(null);
          setParentInfo({
            id: "",
            name: "ゲスト",
            avatar_url: null,
            email: "未設定",
            joinDate: "不明",
          });
          setChildInfo({
            id: 0,
            name: "こども",
            birthday: "未設定",
            age: "未設定",
            ageStage: "未設定",
            allergens: [],
          });
        }
      } catch (error) {
        console.error("Failed to initialize user session:", error);
        // エラー時もJotaiの状態をリセット
        setUserId(null);
        setChildId(null);
      } finally {
        setIsLoading(false);
        setInitialLoadCompleted(true); // 初回ロードが完了したことをマーク
      }
    };

    // このuseEffectは初回マウント時のみ実行
    if (!initialLoadCompleted) {
      initializeUserSession();
    }
  }, [
    setUserId,
    setParentInfo,
    setChildId,
    setChildInfo,
    setAllergens,
    setIsLoading,
    initialLoadCompleted,
  ]);

  return null;
};
