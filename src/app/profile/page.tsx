"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AccountBoxIcon } from "@/icons";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/atoms";
import {
  createChild,
  createChildAllergens,
  createProfile,
  getAllergens,
  getChild,
} from "@/lib/supabase";
import { Allergen, FormData } from "@/types/types";
import { step1Schema, step2Schema } from "@/types/schemas";

type ValidationErrors = {
  [key: string]: string[];
};

export default function ProfilePage() {
  const router = useRouter();
  const setLoading = useSetAtom(loadingAtom);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    avatar_url: null as string | null,
    childName: "",
    childBirthday: "",
    allergens: [],
  });
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [allergenExclusions, setAllergenExclusions] = useState<
    Record<string, boolean>
  >({});
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fileMessage, setFileMessage] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [today, setToday] = useState("");
  const userId = useAtomValue(userIdAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //　アバター画像の取得
  useEffect(() => {
    if (formData && formData.avatar_url) {
      setAvatarUrl(formData.avatar_url);
    }
  }, [formData]);

  // アバター画像の変更処理
  const onUpLoadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      setFileMessage("");

      // ファイルが選択されていない場合
      if (!files || files.length === 0) {
        setFileMessage("画像をアップロードしてください。");
        setFormData((prev) => ({ ...prev, avatar_url: null }));
        return;
      }

      // 画像URLを生成してformDataにセット
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
      // 画像をセット
      setAvatar(files[0]);
    },
    []
  );

  const toggleAllergen = (allergenId: number) => {
    setAllergenExclusions((prev) => ({
      ...prev,
      [allergenId]: !prev[allergenId],
    }));
  };

  const handleNext = () => {
    const result = step1Schema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    setErrors(null);
    setStep(2);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = step2Schema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      setLoading(false);
      return;
    }
    setErrors(null);

    // 選択されたアレルゲン情報を抽出
    const selectedAllergenIds = Object.keys(allergenExclusions)
      .filter((key) => allergenExclusions[parseInt(key, 10)])
      .map((key) => parseInt(key, 10));

    try {
      // プロフィールと子どもの情報を登録
      await createProfile(formData, userId!);
      const childId = await createChild(formData, userId!);

      // アレルゲン情報を登録
      if (childId) {
        await createChildAllergens(
          { ...formData, allergens: selectedAllergenIds },
          childId,
          userId!
        );
      }

      // 成功したらホーム画面へ遷移
      router.push("/");
    } catch (err) {
      // いずれかのステップでエラーが発生した場合
      console.error(err);
      if (err instanceof Error) {
        setErrors({ general: [err.message] });
      } else {
        setErrors({ general: ["不明なエラーが発生しました。"] });
      }
    } finally {
      setLoading(false);
    }
  };

  // ページロード時とアレルゲン項目がないときに実行
  useEffect(() => {
    inputRef.current?.focus();
    const fetchAllergens = async () => {
      if (allergens.length === 0) {
        const data = await getAllergens();
        if (data) {
          setAllergens(data);
          const initialExclusions: Record<string, boolean> = {};
          data.forEach((allergen) => {
            initialExclusions[allergen.id] = false;
          });
          setAllergenExclusions(initialExclusions);
        }
      }
    };
    fetchAllergens();
  }, []);

  useEffect(() => {
    // 今日の日付を YYYY-MM-DD に変換
    const date = new Date().toISOString().split("T")[0];
    setToday(date);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-violet-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
            プロフィール設定
          </h2>
          <p className="text-stone-500 text-sm text-center mb-6">
            ステップ {step}/2
          </p>
          {errors?.general && (
            <div className="text-red-500 text-sm text-center mb-4">
              {errors.general[0]}
            </div>
          )}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  ユーザー名
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                />
                {errors?.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  プロフィール画像
                </label>
                <div
                  className="w-[200px] h-[200px] bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden cursor-pointer hover:bg-stone-200 transition-colors group relative"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {formData.avatar_url ? (
                    <>
                      <Image
                        src={formData.avatar_url}
                        alt="プロフィール画像"
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                      {/* <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <AccountBoxIcon className="text-white text-3xl" />
                      </div> */}
                    </>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 text-stone-400 group-hover:text-stone-500">
                      <AccountBoxIcon style={{ fontSize: 48 }} />
                      <span className="text-sm font-medium">画像を追加</span>
                      <span className="text-xs">タップして選択</span>
                    </div>
                  )}
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onUpLoadImage}
                  className="hidden"
                />
                {fileMessage && (
                  <p className="mt-2 text-sm text-red-500">{fileMessage}</p>
                )}
              </div>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                つぎへ
              </button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  お子様の名前
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                />
                {errors?.childName && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.childName[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  お子様の誕生日
                </label>
                <input
                  type="date"
                  max={today}
                  name="childBirthday"
                  value={formData.childBirthday}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
                />
                {errors?.childBirthday && (
                  <p className="mt-2 text-sm text-red-500">
                    {errors.childBirthday[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  アレルギー情報（複数選択可）
                </label>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen) => (
                    <button
                      key={allergen.id}
                      onClick={() => toggleAllergen(allergen.id)}
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                        allergenExclusions[allergen.id]
                          ? "bg-violet-400 text-white"
                          : "bg-stone-200 text-stone-600 hover:bg-stone-300"
                      }`}
                    >
                      <div className="text-xs leading-tight">
                        {allergen.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className="w-full py-4 rounded-2xl font-medium bg-gradient-to-r from-violet-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                保存してはじめる
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-xs text-stone-400">© 2025 もぐログ</p>
      </div>
    </div>
  );
}
