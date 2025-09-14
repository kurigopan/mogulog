// "use server";

// import Navigation from "./navigation";
// import { supabaseCreateServerClient } from "@/lib/supabase";

// //認証状態の監視
// const SupabaseListener = async () => {
//   const supabase = supabaseCreateServerClient();
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   // プロフィールの取得
//   let profile = null;
//   if (session) {
//     const { data: currentProfile } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", session.user.id)
//       .single();

//     profile = currentProfile;

//     //  メールアドレスを変更した場合、プロフィールを更新
//     if (currentProfile && currentProfile.email !== session.user.email) {
//       const { data: updatedProfile } = await supabase
//         .from("profiles")
//         .update({ email: session.user.email })
//         .match({ id: session.user.id })
//         .select("*")
//         .single();

//       profile = updatedProfile;
//     }
//   }
//   return <Navigation session={session} profile={profile} />;
// };

// export default SupabaseListener;
