import { supabase } from "@/lib/supabase/client";
import { Profile, Child } from "@/types";

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
  return data;
}
export async function getChild(userId: string) {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch child:", error);
    return null;
  }
  return data;
}

export async function createProfile(
  formData: { name: string; avatar_url: string | null },
  userId: string, // supabase.auth.signUp 後の user.id
) {
  const profileData: Profile = {
    id: userId,
    name: formData.name,
    avatar_url: formData.avatar_url,
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("profiles")
    .insert(profileData)
    .select();

  if (error) {
    console.error("プロフィールの登録に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}

export async function createChild(
  formData: { childName: string; childBirthday: string },
  userId: string, // supabase.auth.signUp 後の user.id
) {
  const childData: Omit<Child, "id"> = {
    parent_id: userId,
    name: formData.childName,
    birthday: formData.childBirthday,
    created_by: userId,
    updated_by: userId,
  };

  const { data, error } = await supabase
    .from("children")
    .insert(childData)
    .select()
    .single();

  if (error) {
    console.error("子どもの登録に失敗しました:", error);
    return null;
  }

  return data.id;
}

export async function updateProfile(
  userId: string,
  updates: { name: string; avatar_url: string | null },
) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("プロフィールの更新に失敗しました:", error);
    return { data: null, error };
  }

  return { data, error };
}

export async function updateChild(
  childId: number,
  updates: { name: string; birthday: string },
) {
  const { data, error } = await supabase
    .from("children")
    .update(updates)
    .eq("id", childId)
    .select()
    .single();

  if (error) {
    console.error("子どものプロフィールの更新に失敗しました:", error);
    return { data: null, error };
  }

  return data;
}
