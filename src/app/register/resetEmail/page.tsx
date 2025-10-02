"use client";

import { useState } from "react";
import { ChildCareIcon, MailOutlineIcon } from "@/icons";
import { useSetAtom } from "jotai";
import { loadingAtom } from "@/lib/atoms";
import { updateEmail } from "@/lib/supabase";

type ValidationErrors = {
  [key: string]: string[];
};

export default function UpdateEmail() {
  const setIsLoading = useSetAtom(loadingAtom);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      setErrors({ email: ["正しいメールアドレスを入力してください"] });
      return;
    }
    setErrors(null);
    setIsLoading(true);
    await updateEmail(newEmail);
    setIsLoading(false);
    setIsSuccess(true);
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
          <h2 className="text-2xl font-bold text-stone-700 text-center mb-4">
            メールアドレス変更
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
                確認メールを送りました
              </h3>
              <p className="text-stone-600">
                メールのリンクをクリックすると変更が完了します。
              </p>
            </div>
          ) : (
            <form onSubmit={handleUpdateEmail} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  新しいメールアドレス
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                />
                {errors?.email && (
                  <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                メールアドレスを更新する
              </button>
            </form>
          )}
        </div>

        <div className="p-4 text-center">
          <p className="text-xs text-stone-400">© 2025 もぐログ</p>
        </div>
      </div>
    </div>
  );
}
