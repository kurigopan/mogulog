"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ZodFormattedError } from "zod";
import { VisibilityIcon, VisibilityOffIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/utils/atoms";
import { login, signup } from "@/lib/supabase";
import { registerSchema } from "@/types";
import type { RegisterForm, User } from "@/types";

export default function AuthForm() {
  const router = useRouter();
  const setIsLoading = useSetAtom(loadingAtom);
  const [userData, setUserData] = useState<User>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<ZodFormattedError<RegisterForm> | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  // TODO: 新規登録の際に、メール認証を追加
  // const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = registerSchema.safeParse(userData);
    if (!result.success) {
      setErrors(result.error.format());
      setIsLoading(false);
      return;
    }
    setErrors(null);

    const { error: signupError } = await signup(
      userData.email,
      userData.password,
    );

    if (signupError) {
      console.error("サインアップに失敗しました:", signupError.message);
    } else {
      router.push("/profile");
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = registerSchema.safeParse(userData);
    if (!result.success) {
      setErrors(result.error.format());
      setIsLoading(false);
      return;
    }
    setErrors(null);

    const { error: loginError } = await login(
      userData.email,
      userData.password,
    );
    if (loginError) {
      console.error("ログインに失敗しました:", loginError.message);
    } else {
      router.push("/");
    }
    setIsLoading(false);
  };

  return (
    <CenteredCard>
      <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
        ログイン / 新規登録
      </h2>
      {/* TODO: 新規登録の際に、メール認証を追加 */}
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
          ) : ()} */}
      {errors?._errors && (
        <div className="text-red-500 text-sm text-center mb-4">
          {errors._errors[0]}
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
            className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
          />
          {errors?.email && (
            <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-2">
            パスワード
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userData.password}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-stone-300 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all mb-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
          </div>
          {errors?.password?._errors[0] && (
            <p className="mt-2 text-sm text-red-500">
              {errors.password._errors[0]}
            </p>
          )}
          <Link
            href="/register/forgetPassword"
            className="flex items-center justify-center text-sm font-medium text-stone-600"
          >
            パスワードを忘れた方はこちら
          </Link>
        </div>
        <button
          onClick={handleSignup}
          className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          新規登録する
        </button>
        <button
          onClick={handleLogin}
          className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          ログインする
        </button>
      </div>
    </CenteredCard>
  );
}
