"use client";

import { useState } from "react";
import { MailOutlineIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/utils/atoms";
import { resetPassword } from "@/lib/supabase";
import Link from "next/link";

type ValidationErrors = {
  [key: string]: string[];
};

export default function ForgetPassword() {
  const setIsLoading = useSetAtom(loadingAtom);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: ["正しいメールアドレスを入力してください"] });
      return;
    }
    setErrors(null);
    setIsLoading(true);
    await resetPassword(email);
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <CenteredCard>
      <h2 className="text-2xl font-bold text-stone-700 text-center mb-4">
        パスワード再設定
      </h2>
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full">
          <MailOutlineIcon className="text-violet-500 text-3xl" />
        </div>
      </div>
      {errors?.general && (
        <div className="text-red-500 text-sm text-center mb-4">
          {errors.general[0]}
        </div>
      )}
      {isSuccess ? (
        <div className="text-center p-6 space-y-4">
          <h3 className="text-xl font-bold text-stone-700">
            メールを送りました
          </h3>
          <p className="text-stone-600">
            メールのリンクから
            <br />
            パスワードを再設定してください
          </p>
        </div>
      ) : (
        <form onSubmit={handleSendEmail} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              登録メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
            {errors?.email && (
              <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            メールを送信する
          </button>
          <Link
            href="/register/authform"
            className="flex items-center justify-center block text-sm font-medium text-stone-600"
          >
            ログイン・新規登録する方はこちら
          </Link>
        </form>
      )}
    </CenteredCard>
  );
}
