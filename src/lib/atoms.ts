import { atom } from "jotai";
import { Session } from "@supabase/supabase-js";

// 初期値はnull
export const sessionAtom = atom<Session | null>(null);

export const loadingAtom = atom<boolean>(true);

export const userIdAtom = atom<string | null>(null);
