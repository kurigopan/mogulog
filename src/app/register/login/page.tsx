"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VisibilityIcon, VisibilityOffIcon, ChildCareIcon } from "@/icons";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { login } from "@/lib/supabase";
import { registerSchema } from "@/types/schemas";

type ValidationErrors = {
  [key: string]: string[];
};

export default function Login() {
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(userData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors(null);
    setLoading(true);
    await login(userData.email, userData.password);
    setLoading(false);
    router.push("/"); // ログイン成功後にホームへ
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
            ログイン
          </h2>

          {errors?.general && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errors.general[0]}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              ログイン
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="/forgot-password"
              className="text-sm text-violet-500 hover:underline"
            >
              パスワードを忘れた場合
            </a>
          </div>
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-stone-400">© 2025 もぐログ</p>
        </div>
      </div>
    </div>
  );
}
