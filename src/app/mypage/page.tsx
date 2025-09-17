"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  EditIcon,
  ChevronRightIcon,
  FavoriteBorderIcon,
  MenuBookIcon,
  // EditNoteIcon,
  LogoutIcon,
  FaceIcon,
  ChildCareIcon,
} from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { allergensAtom, loadingAtom, userIdAtom } from "@/lib/atoms";
import {
  getAllergens,
  getChild,
  getChildAllergens,
  getCurrentUser,
  getProfile,
  updateChild,
  updateProfile,
  uploadAvatar,
  upsertChildAllergens,
} from "@/lib/supabase";
import { ChildInfo, ParentInfo } from "@/types/types";
import { Avatar } from "@mui/material";

export default function MyPage() {
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userId = useAtomValue(userIdAtom);
  const setLoading = useSetAtom(loadingAtom);
  const [allergens, setAllergens] = useAtom(allergensAtom);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);

  const [parentInfo, setParentInfo] = useState<ParentInfo>({
    name: "親",
    avatar_url: null,
    email: "未設定",
    joinDate: "不明",
  });

  const childInitialState: ChildInfo = {
    id: 0,
    name: "こども",
    birthday: "未設定",
    age: "未設定",
    allergens: [],
  };

  const [childInfo, setChildInfo] = useState<ChildInfo>(childInitialState);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const [userData, profileData, childData, allergensResponse] =
          await Promise.all([
            getCurrentUser(),
            getProfile(userId),
            getChild(userId),
            getAllergens(),
          ]);
        if (allergensResponse) {
          setAllergens(allergensResponse);
        }
        if (userData && profileData) {
          setParentInfo({
            name: profileData.name || "親",
            avatar_url: profileData.avatar_url || null,
            email: userData.email || "未設定",
            joinDate:
              (profileData.created_at &&
                new Date(profileData.created_at).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                })) ||
              "不明",
          });
        }
        if (childData) {
          const childAllergenData = await getChildAllergens(childData.id);
          setChildInfo({
            id: childData.id || 0,
            name: childData.name || "こども",
            birthday: childData.birthday || "未設定",
            age:
              (childData.birthday &&
                calculateAgeInMonths(childData.birthday)) ||
              "未設定",
            allergens: childAllergenData || [],
          });
        } else {
          // 子どものデータがnullの場合、childInfoもnullに設定
          setChildInfo(childInitialState);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(
            "ユーザー情報の取得中にエラーが発生しました:",
            error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, setLoading, setAllergens]);
  //　アバター画像の取得
  useEffect(() => {
    if (parentInfo && parentInfo.avatar_url) {
      setAvatarUrl(parentInfo.avatar_url);
    }
  }, [parentInfo]);

  // アバター画像の変更処理
  const onUpLoadImage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      // ファイルが選択されていない場合
      if (!files || files.length === 0) {
        setParentInfo((prev) => ({ ...prev, avatar_url: null }));
        return;
      }

      // 画像URLを生成してparentInfoにセット
      const imageUrl = URL.createObjectURL(files[0]);
      setParentInfo((prev) => ({ ...prev, avatar_url: imageUrl }));
      // 画像をセット
      setAvatar(files[0]);
    },
    []
  );

  const calculateAgeInMonths = (birthday: string) => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const years = today.getFullYear() - birthDate.getFullYear();
    const months = today.getMonth() - birthDate.getMonth();
    const totalMonths = years * 12 + months;
    return totalMonths >= 0 ? `${totalMonths}ヶ月` : "不明";
  };

  const getAllergenNameById = (id: number) => {
    const allergen = allergens.find((a) => a.id === id);
    return allergen ? allergen.name : "不明";
  };

  const handleParentEditToggle = () => {
    setIsEditingParent(!isEditingParent);
  };

  const handleChildEditToggle = () => {
    setIsEditingChild(!isEditingChild);
  };

  const handleParentSave = async () => {
    if (!userId) {
      alert("ユーザー情報が取得できません。ログインし直してください。");
      return;
    }
    setLoading(true);
    let newAvatarUrl = parentInfo.avatar_url;

    // avatarファイルが存在する場合のみ、画像をアップロードする
    if (avatar) {
      newAvatarUrl = await uploadAvatar(avatar, userId);
    }
    const { data, error } = await updateProfile(userId, {
      name: parentInfo.name,
      avatar_url: newAvatarUrl,
    });
    if (error) throw error;

    // UIを更新
    setParentInfo((prev) => ({
      ...prev,
      name: data.name,
      avatar_url: data.avatar_url,
    }));
    setIsEditingParent(false);
    setAvatar(null);

    setLoading(false);
  };

  const handleChildSave = async () => {
    if (!userId) {
      alert("ユーザー情報が取得できません。ログインし直してください。");
      return;
    }
    setLoading(true);

    try {
      // 子どものプロフィールを更新
      await updateChild(childInfo.id, {
        name: childInfo.name,
        birthday: childInfo.birthday,
      });
      // アレルギー情報を一括更新
      await upsertChildAllergens(childInfo.id, childInfo.allergens);
      setIsEditingChild(false);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "子どもの情報更新中にエラーが発生しました:",
          error.message
        );
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
    setIsEditingChild(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // ログアウト処理
  };
  const handleToggleAllergen = (allergenId: number) => {
    if (!childInfo) return;

    if (childInfo.allergens.includes(allergenId)) {
      setChildInfo({
        ...childInfo,
        allergens: childInfo.allergens.filter(
          (id: number) => id !== allergenId
        ),
      });
    } else {
      setChildInfo({
        ...childInfo,
        allergens: [...childInfo.allergens, allergenId],
      });
    }
  };

  const menuItems = [
    {
      id: "favorites",
      title: "お気に入り",
      icon: <FavoriteBorderIcon />,
      color: "text-red-500",
      bgColor: "bg-red-100",
      link: "/mypage/favorites",
    },
    {
      id: "created",
      title: "作成したレシピ",
      icon: <MenuBookIcon />,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      link: "/mypage/recipes/created",
    },
    // {
    //   id: "drafts",
    //   title: "下書きレシピ",
    //   icon: <EditNoteIcon />,
    //   color: "text-amber-500",
    //   bgColor: "bg-amber-100",
    //   link: "/mypage/recipes/drafts",
    // },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="マイページ" />
      <div className="p-4 space-y-6">
        {/* 親プロフィール */}
        <section>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              {/* 名前 */}
              <h2 className="text-lg font-bold text-stone-700">
                {isEditingParent ? (
                  <input
                    type="text"
                    value={parentInfo.name}
                    onChange={(e) =>
                      setParentInfo({ ...parentInfo, name: e.target.value })
                    }
                    className="text-xl font-bold text-stone-700 text-center bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
                  />
                ) : (
                  parentInfo.name
                )}
                のプロフィール
              </h2>
              {/* ボタン */}
              {isEditingParent ? (
                <button
                  onClick={handleParentSave}
                  className="flex items-center px-4 py-2 rounded-xl font-medium transition-colors bg-purple-500 text-white hover:bg-purple-600"
                >
                  保存
                </button>
              ) : (
                <button
                  onClick={handleParentEditToggle}
                  className="flex items-center px-4 py-2 rounded-xl font-medium transition-colors bg-stone-100 text-stone-600 hover:bg-stone-200"
                >
                  <EditIcon />
                  <span className="ml-2">編集</span>
                </button>
              )}
            </div>
            <div className="flex text-center justify-center text-6xl mb-6">
              {isEditingParent ? (
                <>
                  <Avatar
                    src={parentInfo.avatar_url ?? undefined}
                    sx={{ width: 150, height: 150, cursor: "pointer" }}
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {!parentInfo.avatar_url && (
                      <FaceIcon sx={{ fontSize: 150 }} />
                    )}
                  </Avatar>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={onUpLoadImage}
                    className="hidden"
                  />
                </>
              ) : (
                <Avatar
                  src={parentInfo.avatar_url ?? undefined}
                  sx={{ width: 150, height: 150 }}
                >
                  {!parentInfo.avatar_url && (
                    <FaceIcon sx={{ fontSize: 150 }} />
                  )}
                </Avatar>
              )}
            </div>

            {/* 親プロフィール詳細 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center">
                  <span className="text-stone-600 font-medium">
                    メールアドレス
                  </span>
                </div>
                {isEditingParent ? (
                  <Link href="/resetEmail">
                    <button className="text-purple-500 hover:text-purple-600 font-medium">
                      変更する
                    </button>
                  </Link>
                ) : (
                  <span className="text-stone-700">{parentInfo.email}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center">
                  <span className="text-stone-600 font-medium">パスワード</span>
                </div>
                {isEditingParent ? (
                  <Link href="/resetPassword">
                    <button className="text-purple-500 hover:text-purple-600 font-medium">
                      変更する
                    </button>
                  </Link>
                ) : (
                  <span className="text-stone-400">* * * * * *</span>
                )}
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                  <span className="text-stone-600 font-medium">利用開始</span>
                </div>
                <p className="text-stone-700">{parentInfo.joinDate}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 子供のプロフィール */}
        <section>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            {/* 名前 */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-700">
                {isEditingChild ? (
                  <input
                    type="text"
                    value={childInfo.name}
                    onChange={(e) =>
                      setChildInfo({ ...childInfo, name: e.target.value })
                    }
                    className="text-xl font-bold text-stone-700 text-center bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  childInfo.name
                )}
                のプロフィール
              </h2>
              <button
                onClick={
                  isEditingChild ? handleChildSave : handleChildEditToggle
                }
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
                  isEditingChild
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {isEditingChild ? (
                  "保存"
                ) : (
                  <>
                    <EditIcon />
                    <span className="ml-2">編集</span>
                  </>
                )}
              </button>
            </div>
            {/* アバター画像 */}
            <div className="text-center text-6xl mb-6">
              <ChildCareIcon style={{ fontSize: 150 }} />
            </div>
            <div className="space-y-4">
              {/* 誕生日*/}
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <span className="text-stone-600 font-medium">誕生日</span>
                {isEditingChild ? (
                  <input
                    type="date"
                    value={childInfo.birthday || ""}
                    onChange={(e) =>
                      setChildInfo({ ...childInfo, birthday: e.target.value })
                    }
                    className="text-stone-700 bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-stone-700">{childInfo.birthday}</span>
                )}
              </div>
              {/* 月齢 */}
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <span className="text-stone-600 font-medium">月齢</span>
                <span className="text-stone-700">
                  {childInfo.birthday
                    ? calculateAgeInMonths(childInfo.birthday)
                    : "不明"}
                </span>
              </div>
              {/* アレルギー */}
              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-stone-600 font-medium">アレルギー</span>
                  {/* 既存アレルギー */}
                  {!isEditingChild &&
                    childInfo.allergens &&
                    childInfo.allergens.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {childInfo.allergens.map((allergenId: number) => (
                          <div
                            key={allergenId}
                            className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{getAllergenNameById(allergenId)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  {/*情報なし*/}
                  {!isEditingChild &&
                    (!childInfo.allergens ||
                      childInfo.allergens.length === 0) &&
                    allergens.length === 0 && (
                      <span className="text-stone-400 text-sm ml-2">
                        アレルギー情報がありません。
                      </span>
                    )}
                </div>
                {/* アレルギー一覧から選択（編集モード） */}
                {isEditingChild && allergens.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 mt-2">
                    {allergens.map((allergen) => (
                      <button
                        key={allergen.id}
                        onClick={() => handleToggleAllergen(allergen.id)}
                        className={`h-10 flex items-center justify-center p-1.5 rounded-full text-xs transition-all hover:scale-105 active:scale-95 ${
                          childInfo.allergens.includes(allergen.id)
                            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                            : "bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <span>{allergen.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* メニュー */}
        <section>
          <div className="space-y-3 ">
            {menuItems.map((item) => (
              <Link href={item.link} key={item.id}>
                <button className="w-full mb-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`${item.color} mr-4`}>{item.icon}</div>
                      <h4 className="font-bold text-stone-700 mr-4">
                        {item.title}
                      </h4>
                    </div>
                    <ChevronRightIcon />
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* ログアウト */}
        <section>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-red-50 border border-transparent hover:border-red-100"
          >
            <div className="flex items-center justify-center">
              <div className="text-red-500 mr-3">
                <LogoutIcon />
              </div>
              <span className="font-bold text-red-600">ログアウト</span>
            </div>
          </button>
        </section>
      </div>
      {/* ログアウト確認モーダル */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-stone-700 mb-2">
                ログアウトしますか？
              </h3>
              <p className="text-sm text-stone-500">
                また戻ってきてくださいね！
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 px-4 bg-stone-100 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors"
              >
                キャンセル
              </button>
              <Link
                href="/"
                onClick={handleLogout}
                className="flex justify-center flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                ログアウト
              </Link>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
