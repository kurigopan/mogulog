"use client";

import { useEffect } from "react";
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
  getUser,
  getProfile,
  getChild,
  getAllergens,
  getChildAllergens,
} from "@/lib/supabase";
import { calculateAgeInMonths, getAgeStage } from "@/lib/utils";

export const UserInitializer = ({ userId }: { userId: string | null }) => {
  const setIsLoading = useSetAtom(loadingAtom);
  const setUserId = useSetAtom(userIdAtom);
  const setParentInfo = useSetAtom(parentInfoAtom);
  const setChildId = useSetAtom(childIdAtom);
  const setChildInfo = useSetAtom(childInfoAtom);
  const setAllergens = useSetAtom(allergensAtom);

  useEffect(() => {
    const setUserData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);

      const [userData, profileData, childData, allergensResponse] =
        await Promise.all([
          getUser(),
          getProfile(userId),
          getChild(userId),
          getAllergens(),
        ]);

      if (allergensResponse) {
        setAllergens(allergensResponse);
      }
      if (userData && profileData) {
        setParentInfo({
          id: userData.id || "",
          name: profileData.name || "親",
          avatar_url: profileData.avatar_url || null,
          email: userData.email || "未設定",
          joinDate:
            (profileData.created_at &&
              new Date(profileData.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
              })) ||
            "不明",
        });
        setUserId(userData.id);
      }
      if (childData) {
        const childAllergenData = await getChildAllergens(childData.id);
        setChildInfo({
          id: childData.id || 0,
          name: childData.name || "こども",
          birthday: childData.birthday || "未設定",
          age:
            (childData.birthday && calculateAgeInMonths(childData.birthday)) +
              "ヶ月" || "未設定",
          ageStage:
            (childData.birthday &&
              getAgeStage(calculateAgeInMonths(childData.birthday))) ||
            "未設定",
          allergens: childAllergenData || [],
        });
        setChildId(childData.id);
      }

      setIsLoading(false);
    };

    setUserData();
  }, [userId, setParentInfo, setChildInfo, setAllergens, setIsLoading]);

  return null;
};
