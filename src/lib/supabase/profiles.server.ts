import { createClient } from "@/lib/supabase/server";
import { calculateAgeInMonths, getAgeStage } from "@/lib/utils";

// 現在のログインユーザーに紐づく子供の月齢ステージを取得
export async function getChildAgeStageForCurrentUser(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return "初期";
  }

  const { data: child } = await supabase
    .from("children")
    .select("birthday")
    .eq("parent_id", user.id)
    .single();

  if (child?.birthday) {
    return getAgeStage(calculateAgeInMonths(child.birthday));
  }

  return "初期";
}
