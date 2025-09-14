// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useEffect } from "react";
// import useStore from "@/store";
// import AccountBoxIcon from "@mui/icons-material/AccountBox";
// import type { Session } from "@supabase/supabase-js";
// import type { Database } from "@/types/supabase";
// type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];

// const Navigation = ({
//   session,
//   profile,
// }: {
//   session: Session | null;
//   profile: ProfileType | null;
// }) => {
//   const { setUser } = useStore();

//   // 状態管理にユーザー情報を保存
//   useEffect(() => {
//     setUser({
//       id: session ? session.user.id : "",
//       email: session ? session.user.email! : "",
//       name: session && profile ? profile.name : "",
//       introduce: session && profile ? profile.introduce : "",
//       avatar_url: session && profile ? profile.avatar_url : "",
//     });
//   }, [session, setUser, profile]);

//   return (
//     <header className="shadow-lg shadow-gray-100">
//       <div className="py-5 container max-w-screen-sm mx-auto flex items-center justify-between">
//         <Link href="/" className="font-bold text-xl cursor-pointer">
//           FullStackChannel
//         </Link>
//         <div className="text-sm font-bold">
//           {session ? (
//             <div className="flex items-center space-x-5">
//               <Link href="/settings/profile">
//                 <div className="relative w-10 h-10">
//                   {profile && profile.avatar_url ? (
//                     <Image
//                       src={profile.avatar_url}
//                       className="rounded-full object-cover"
//                       alt="Avatar"
//                       fill
//                     />
//                   ) : (
//                     <AccountBoxIcon sx={{ fontSize: 40 }} />
//                   )}
//                 </div>
//               </Link>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-5">
//               <Link href="/auth/login">Login</Link>
//               <Link href="/auth/signup">Signup</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navigation;
