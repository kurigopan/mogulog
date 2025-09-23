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

const UserInitializer = ({ userId }: { userId: string | null }) => {
  const setParentInfo = useSetAtom(parentInfoAtom);
  const setUserId = useSetAtom(userIdAtom);
  const setChildInfo = useSetAtom(childInfoAtom);
  const setChildId = useSetAtom(childIdAtom);
  const setAllergens = useSetAtom(allergensAtom);
  const setLoading = useSetAtom(loadingAtom);

  useEffect(() => {
    const setUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);

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

      setLoading(false);
    };

    setUserData();
  }, [userId, setParentInfo, setChildInfo, setAllergens, setLoading]);

  return null;
};

export default UserInitializer;
