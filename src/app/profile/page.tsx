"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ZodFormattedError } from "zod";
import { AccountBoxIcon } from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingAtom, userIdAtom } from "@/lib/utils/atoms";
import {
  createChild,
  createChildAllergens,
  createProfile,
  getAllergens,
  uploadAvatar,
} from "@/lib/supabase";
import { parentSchema, childCreateSchema } from "@/types";
import type { Allergen, FormData, ParentForm, ChildCreateForm } from "@/types";

export default function ProfilePage() {
  const router = useRouter();
  const setIsLoading = useSetAtom(loadingAtom);
  const userId = useAtomValue(userIdAtom);
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
  const [step, setStep] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [today, setToday] = useState("");
  const [parentFormErrors, setParentFormErrors] =
    useState<ZodFormattedError<ParentForm> | null>(null);
  const [childFormErrors, setChildFormErrors] =
    useState<ZodFormattedError<ChildCreateForm> | null>(null);
  const [errors, setErrors] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // アバター画像の変更処理
  const onUpLoadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      // ファイルが選択されていない場合
      if (!files || files.length === 0) {
        setFormData((prev) => ({ ...prev, avatar_url: null }));
        setAvatar(null);
        return;
      }

      // 画像URLを生成してformDataにセット
      const imageUrl = URL.createObjectURL(files[0]);
      setFormData((prev) => ({ ...prev, avatar_url: imageUrl }));
      // 画像をセット
      setAvatar(files[0]);
    },
    [],
  );

  const toggleAllergen = (allergenId: number) => {
    setAllergenExclusions((prev) => ({
      ...prev,
      [allergenId]: !prev[allergenId],
    }));
  };

  const handleNext = () => {
    setIsLoading(true);
    const result = parentSchema.safeParse(formData);
    if (!result.success) {
      setParentFormErrors(result.error.format());
      setIsLoading(false);
      return;
    }
    setParentFormErrors(null);
    setIsLoading(false);
    setStep(2);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = childCreateSchema.safeParse(formData);
    if (!result.success) {
      setChildFormErrors(result.error.format());
      setIsLoading(false);
      return;
    }
    setChildFormErrors(null);

    // 選択されたアレルゲン情報を抽出
    const selectedAllergenIds = Object.keys(allergenExclusions)
      .filter((key) => allergenExclusions[parseInt(key, 10)])
      .map((key) => parseInt(key, 10));

    let newAvatarUrl = formData.avatar_url;

    // avatarファイルが存在する場合のみ、画像をアップロードする
    if (avatar) {
      newAvatarUrl = await uploadAvatar(avatar, userId!);
    }

    try {
      // プロフィールと子どもの情報を登録
      await createProfile({ ...formData, avatar_url: newAvatarUrl }, userId!);
      const childId = await createChild(formData, userId!);

      // アレルゲン情報を登録
      if (childId) {
        await createChildAllergens(
          { ...formData, allergens: selectedAllergenIds },
          childId,
          userId!,
        );
      }

      // 成功したらホーム画面へ遷移
      router.push("/");
    } catch (err) {
      // いずれかのステップでエラーが発生した場合
      console.error(err);
      if (err instanceof Error) {
        setErrors(err.message);
      } else {
        setErrors("不明なエラーが発生しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ページロード時とアレルゲン項目がないときに実行
  useEffect(() => {
    inputRef.current?.focus();
    (async () => {
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
    })();
  });

  useEffect(() => {
    // 今日の日付を YYYY-MM-DD に変換
    const date = new Date().toISOString().split("T")[0];
    setToday(date);
  }, []);

  return (
    <CenteredCard>
      <h2 className="text-2xl font-bold text-stone-700 text-center mb-2">
        プロフィール設定
      </h2>
      <p className="text-stone-500 text-sm text-center mb-6">
        ステップ {step}/2
      </p>
      {errors && (
        <div className="text-red-500 text-sm text-center mb-4">{errors}</div>
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
              className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
            {parentFormErrors?.name?._errors && (
              <p className="mt-2 text-sm text-red-500">
                {parentFormErrors.name._errors[0]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-2">
              プロフィール画像
            </label>
            <div
              className="w-[200px] h-[200px] bg-stone-100 rounded-2xl flex items-center justify-center overflow-hidden hover:bg-stone-200 transition-colors group relative"
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
          </div>
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
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
              className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
            {childFormErrors?.childName?._errors?.[0] && (
              <p className="mt-2 text-sm text-red-500">
                {childFormErrors.childName._errors[0]}
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
              className="w-full p-4 rounded-2xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-200 transition-all"
            />
            {childFormErrors?.childBirthday?._errors?.[0] && (
              <p className="mt-2 text-sm text-red-500">
                {childFormErrors.childBirthday._errors[0]}
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
                  <div className="text-xs leading-tight">{allergen.name}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            保存してはじめる
          </button>
        </div>
      )}
    </CenteredCard>
  );
}
