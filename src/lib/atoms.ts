import { atom } from "jotai";
import { Session } from "@supabase/supabase-js";
import { Allergen } from "@/types/types";

export const sessionAtom = atom<Session | null>(null);

export const loadingAtom = atom<boolean>(true);

export const userIdAtom = atom<string | null>(null);

export const allergensAtom = atom<Allergen[]>([]);
