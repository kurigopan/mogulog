import { atom } from "jotai";
import { Session } from "@supabase/supabase-js";
import {
  Allergen,
  ChildInfo,
  FavoriteUpdate,
  ParentInfo,
  SearchState,
  User,
} from "@/types";

export const sessionAtom = atom<Session | null>(null);
export const loginDialogSourceAtom = atom<string | null>(null);

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

//  お気に入り操作の変更を通知する
export const favoriteUpdateAtom = atom<FavoriteUpdate>(null);

// 食材一覧ページのフィルターを維持する
export const filterCategoryAtom = atom<string>("all");
export const filterStageAtom = atom<string>("all");
export const filterStatusAtom = atom<string>("all");

//　検索履歴を保持する
export const searchStateAtom = atom<SearchState>({
  query: "",
  results: [],
  allergenExclusions: {},
});

//　月齢フィルターを維持する
export const childAgeStageAtom = atom<string>("初期");
