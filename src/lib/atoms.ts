import { atom } from "jotai";
import { Session } from "@supabase/supabase-js";
import { Allergen, ChildInfo, ParentInfo, User } from "@/types/types";

export const sessionAtom = atom<Session | null>(null);
export const loginDialogAtom = atom(false);

export const loadingAtom = atom<boolean>(true);

export const allergensAtom = atom<Allergen[]>([]);
export const userAtom = atom<User | null>(null);

export const parentInfoAtom = atom<ParentInfo>({
  id: "",
  name: "親",
  avatar_url: null,
  email: "未設定",
  joinDate: "不明",
});
export const userIdAtom = atom<string | null>(null);

export const childInfoAtom = atom<ChildInfo>({
  id: 0,
  name: "こども",
  birthday: "未設定",
  age: "未設定",
  ageStage: "未設定",
  allergens: [],
});
export const childIdAtom = atom<number | null>(null);
