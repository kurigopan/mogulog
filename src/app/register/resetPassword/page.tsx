"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VisibilityIcon, VisibilityOffIcon, PasswordIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { updatePassword } from "@/lib/supabase";

type ValidationErrors = {
  [key: string]: string[];
};

export default function ResetPassword() {
  const router = useRouter();
  const setIsLoading = useSetAtom(loadingAtom);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setErrors({ password: ["パスワードは6文字以上にしてください"] });
      return;
    }
    setErrors(null);
    setIsLoading(true);
    await updatePassword(newPassword);
    setIsLoading(false);
    setIsSuccess(true);
    router.push("/register/authform");
  };

  return (
    <CenteredCard>
      {" "}
      <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
        パスワード再設定
      </h2>
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full">
          <PasswordIcon className="text-violet-500 text-3xl" />
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
            パスワードを更新しました
          </h3>
          <p className="text-stone-600">3秒後にログインページに移動します。</p>
        </div>
      ) : (
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-stone-600 mb-2">
              新しいパスワード
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              <p className="mt-2 text-sm text-red-500">{errors.password[0]}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            パスワードを更新する
          </button>
        </form>
      )}
    </CenteredCard>
  );
}
