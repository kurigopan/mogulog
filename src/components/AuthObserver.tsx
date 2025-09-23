"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userIdAtom } from "@/lib/atoms";
import { supabase } from "@/lib/supabase";

export const AuthObserver = () => {
  const setUserId = useSetAtom(userIdAtom);

  useEffect(() => {
    // 認証状態の変化を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Supabase Auth Event:", event);

      // セッションがあればユーザーIDをセット
      if (session) {
        setUserId(session.user.id);
      } else {
        // セッションがなければユーザーIDをnullにリセット
        setUserId(null);
      }
    });

    // クリーンアップ関数
    // コンポーネントがアンマウントされたときに監視を解除
    return () => {
      subscription.unsubscribe();
    };
  }, [setUserId]);

  return null;
};
