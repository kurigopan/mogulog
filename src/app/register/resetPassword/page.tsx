"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ZodFormattedError } from "zod";
import { VisibilityIcon, VisibilityOffIcon, PasswordIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/utils/atoms";
import { updatePassword } from "@/lib/supabase";
import { passwordSchema } from "@/types";
import type { PasswordForm } from "@/types";

export default function ResetPassword() {
  const router = useRouter();
  const setIsLoading = useSetAtom(loadingAtom);
  const [errors, setErrors] = useState<ZodFormattedError<PasswordForm> | null>(
    null,
  );
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = passwordSchema.safeParse({ password: newPassword });
    if (!result.success) {
      setErrors(result.error.format());
      setIsLoading(false);
      return;
    }

    setErrors(null);
    await updatePassword(newPassword);
    setIsSuccess(true);
    setTimeout(() => router.push("/register/authform"), 3000);
    setIsLoading(false);
  };

  return (
    <CenteredCard>
      <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
        パスワード変更
      </h2>
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full">
          <PasswordIcon className="text-violet-500 text-3xl" />
        </div>
      </div>

      {isSuccess ? (
        <div className="text-center p-6 space-y-4">
          <h3 className="text-xl font-bold text-stone-700">
            パスワードを変更しました
          </h3>
          <p className="text-stone-600">3秒後にログインページに移動します</p>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-6" noValidate>
          <div className="relative">
            <label className="block text-sm font-medium text-stones-600 mb-2">
              新しいパスワード
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 rounded-2xl border border-stone-300 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </button>
            {errors?.password?._errors[0] && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password._errors[0]}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center justify-center w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            変更する
          </button>
        </form>
      )}
    </CenteredCard>
  );
}
