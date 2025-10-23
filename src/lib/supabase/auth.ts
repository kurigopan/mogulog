import { supabase } from "@/lib/supabase/client";

export async function signup(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });
  return { data, error };
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { data, error };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("ログアウトに失敗しました:", error.message);
    return;
  }
}

export async function updateEmail(newEmail: string) {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (error) {
    console.error("メールアドレスの更新に失敗しました:", error.message);
    return;
  }
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${location.origin}/reset-password`,
  });

  if (error) {
    console.error("メール送信に失敗しました。", error.message);
  }
}

export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error("パスワードの更新に失敗しました:", error.message);
    return;
  }
}
