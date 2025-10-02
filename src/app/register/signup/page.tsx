"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VisibilityIcon, VisibilityOffIcon, ChildCareIcon } from "@/icons";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { signup } from "@/lib/supabase";
import { registerSchema } from "@/types/schemas";
import { User } from "@/types/types";

type ValidationErrors = {
  [key: string]: string[];
};

export default function AuthForm() {
  const router = useRouter();
  const setIsLoading = useSetAtom(loadingAtom);
  const [userData, setUserData] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  // const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  // useEffect(() => {
  //   if (session) {
  //     router.push("/");
  //   }
  // }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(userData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors(null);
    setIsLoading(true);
    await signup(userData.email, userData.password);
    setIsLoading(false);
    router.push("/createProfile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-2">
            <div className="text-violet-400 text-3xl mr-3">
              <ChildCareIcon />
            </div>
            <h1 className="text-3xl font-bold text-stone-700">もぐログ</h1>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
            ログイン / 新規登録
          </h2>
          {/* {isSignUpSuccess ? (
            // 新規登録が成功した場合のメッセージ
            <div className="text-center p-6 space-y-4">
              <h3 className="text-xl font-bold text-stone-700">
                メールを確認してください
              </h3>
              <p className="text-stone-600">
                ご入力いただいたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
              </p>
            </div>
          ) : (
            <> */}
          {errors?.general && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errors.general[0]}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
              {errors?.email && (
                <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-stone-600 mb-2">
                パスワード
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-stone-300 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </button>
              {errors?.password && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.password[0]}
                </p>
              )}
            </div>
            <button
              onClick={handleSignup}
              className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              登録する
            </button>
          </div>
          {/* </>
          )} */}
        </div>
        <div className="p-4 text-center">
          <p className="text-xs text-stone-400">© 2025 もぐログ</p>
        </div>
      </div>
    </div>
  );
}
