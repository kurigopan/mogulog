"use client";

import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { supabase } from "@/lib/supabase";
import { userIdAtom } from "@/lib/atoms";

const SupabaseAuthObserver = () => {
  const setUserId = useSetAtom(userIdAtom);

  useEffect(() => {
    // 認証状態の変更を購読する
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
    // コンポーネントがアンマウントされたときに購読を解除する
    return () => {
      subscription.unsubscribe();
    };
  }, [setUserId]);

  // このコンポーネントはUIをレンダリングしないので、nullを返す
  return null;
};

export default SupabaseAuthObserver;
