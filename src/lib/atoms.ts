import { atom } from "jotai";
import { Session } from "@supabase/supabase-js";
import { FormData } from "@/types/types";

// ユーザーセッションを格納するアトム
// 初期値はnull
export const sessionAtom = atom<Session | null>(null);

// ロード状態を管理するアトム
// true の場合、セッション取得中
export const loadingAtom = atom<boolean>(true);
