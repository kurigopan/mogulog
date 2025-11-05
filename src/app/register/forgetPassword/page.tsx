"use client";

import React, { useState } from "react";
import { ZodFormattedError } from "zod";
import { MailOutlineIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/utils/atoms";
import { resetPassword } from "@/lib/supabase";
import Link from "next/link";
import { emailSchema } from "@/types";
import type { EmailForm } from "@/types";

export default function ForgetPassword() {
  const setIsLoading = useSetAtom(loadingAtom);
  const [errors, setErrors] = useState<ZodFormattedError<EmailForm> | null>(
    null,
  );
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = emailSchema.safeParse({ email: email });
    if (!result.success) {
      setErrors(result.error.format());
      setIsLoading(false);
      return;
    }
    setErrors(null);
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
        <form onSubmit={handleSendEmail} className="space-y-6" noValidate>
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
            {errors?.email?._errors && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email._errors[0]}
              </p>
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
            className="flex items-center justify-center text-sm font-medium text-stone-600"
          >
            ログイン・新規登録する方はこちら
          </Link>
        </form>
      )}
    </CenteredCard>
  );
}
