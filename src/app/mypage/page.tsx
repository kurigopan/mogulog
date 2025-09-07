"use client";

import { useState } from "react";
import Link from "next/link";
import {
  EditIcon,
  ChevronRightIcon,
  FavoriteBorderIcon,
  MenuBookIcon,
  EditNoteIcon,
  LogoutIcon,
  FaceIcon,
  ChildCareIcon,
} from "@/icons";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function MyPage() {
  const [isEditingParent, setIsEditingParent] = useState(false);
  const [isEditingChild, setIsEditingChild] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // 親のサンプルデータ
  const [parentInfo, setParentInfo] = useState({
    avatar: <FaceIcon style={{ fontSize: 150 }} />,
    name: "親",
    email: "parent@example.com",
    joinDate: "2024年1月",
  });

  // 子供の情報
  const [childInfo, setChildInfo] = useState({
    avatar: <ChildCareIcon style={{ fontSize: 150 }} />,
    name: "みーちゃん",
    age: "8ヶ月",
    allergies: ["卵", "牛乳"],
  });

  // 統計情報
  const stats = {
    favorites: 23,
    createdRecipes: 5,
    draftRecipes: 2,
  };

  const handleParentEditToggle = () => {
    setIsEditingParent(!isEditingParent);
  };

  const handleChildEditToggle = () => {
    setIsEditingChild(!isEditingChild);
  };

  const handleParentSave = () => {
    setIsEditingParent(false);
    console.log("ママの情報を保存:", parentInfo);
  };

  const handleChildSave = () => {
    setIsEditingChild(false);
    console.log("子供の情報を保存:", childInfo);
  };
  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // ログアウト処理
    console.log("ログアウト");
  };

  const handleAddAllergy = () => {
    const newAllergy = prompt("アレルギー食材を入力してください");
    if (newAllergy && !childInfo.allergies.includes(newAllergy)) {
      setChildInfo({
        ...childInfo,
        allergies: [...childInfo.allergies, newAllergy],
      });
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setChildInfo({
      ...childInfo,
      allergies: childInfo.allergies.filter(
        (allergy) => allergy !== allergyToRemove
      ),
    });
  };

  const menuItems = [
    {
      id: "favorites",
      title: "お気に入り",
      stats: `${stats.favorites}`,
      icon: <FavoriteBorderIcon />,
      color: "text-red-500",
      bgColor: "bg-red-100",
      link: "/mypage/favorites",
    },
    {
      id: "created",
      title: "作成したレシピ",
      stats: `${stats.createdRecipes}`,
      icon: <MenuBookIcon />,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      link: "/mypage/recipes/created",
    },
    {
      id: "drafts",
      title: "下書きレシピ",
      stats: `${stats.draftRecipes}`,
      icon: <EditNoteIcon />,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      link: "/mypage/recipes/drafts",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <Header title="マイページ" />
      <div className="p-4 space-y-6">
        {/* 親プロフィール */}
        <section>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-700">
                {isEditingParent ? (
                  <input
                    type="text"
                    value={parentInfo.name}
                    onChange={(e) =>
                      setParentInfo({ ...parentInfo, name: e.target.value })
                    }
                    className="text-xl font-bold text-stone-700 text-center bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  parentInfo.name
                )}
                のプロフィール
              </h2>
              <button
                onClick={
                  isEditingParent ? handleParentSave : handleParentEditToggle
                }
                className={`flex items-center px-4 py-2 rounded-xl font-medium transition-colors ${
                  isEditingParent
                    ? "bg-purple-500 text-white hover:bg-purple-600"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {isEditingParent ? (
                  "保存"
                ) : (
                  <>
                    <EditIcon />
                    <span className="ml-2">編集</span>
                  </>
                )}
              </button>
            </div>
            <div className="text-center text-6xl mb-6">{parentInfo.avatar}</div>

            {/* 親プロフィール詳細 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center">
                  <span className="text-stone-600 font-medium">
                    メールアドレス
                  </span>
                </div>
                {isEditingParent ? (
                  <input
                    type="email"
                    value={parentInfo.email}
                    onChange={(e) =>
                      setParentInfo({ ...parentInfo, email: e.target.value })
                    }
                    className="text-stone-700 bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                ) : (
                  <span className="text-stone-700">{parentInfo.email}</span>
                )}
              </div>

              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <div className="flex items-center">
                  <span className="text-stone-600 font-medium">パスワード</span>
                </div>
                {isEditingParent ? (
                  <button className="text-purple-500 hover:text-purple-600 font-medium">
                    変更する
                  </button>
                ) : (
                  <span className="text-stone-400">••••••••</span>
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

            <div className="text-center text-6xl mb-6">{childInfo.avatar}</div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-stone-100">
                <span className="text-stone-600 font-medium">月齢</span>
                {isEditingChild ? (
                  <select
                    value={childInfo.age}
                    onChange={(e) =>
                      setChildInfo({ ...childInfo, age: e.target.value })
                    }
                    className="text-stone-700 bg-stone-50 rounded-lg p-2 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="5ヶ月">5ヶ月</option>
                    <option value="6ヶ月">6ヶ月</option>
                    <option value="7ヶ月">7ヶ月</option>
                    <option value="8ヶ月">8ヶ月</option>
                    <option value="9ヶ月">9ヶ月</option>
                    <option value="10ヶ月">10ヶ月</option>
                    <option value="11ヶ月">11ヶ月</option>
                    <option value="12ヶ月">12ヶ月</option>
                    <option value="18ヶ月">18ヶ月</option>
                  </select>
                ) : (
                  <span className="text-stone-700">{childInfo.age}</span>
                )}
              </div>

              <div className="py-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-stone-600 font-medium">アレルギー</span>
                  {isEditingChild && (
                    <button
                      onClick={handleAddAllergy}
                      className="text-purple-500 hover:text-purple-600 font-medium text-sm"
                    >
                      + 追加
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {childInfo.allergies.length > 0 ? (
                    childInfo.allergies.map((allergy, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{allergy}</span>
                        {isEditingChild && (
                          <button
                            onClick={() => handleRemoveAllergy(allergy)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-stone-400 text-sm">なし</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Items */}
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
                      <p
                        className={`w-10 text-sm text-stone-500 p-1 rounded-full ${item.bgColor}`}
                      >
                        {item.stats}
                      </p>
                      {/* <p className="text-sm text-stone-500">{item.subtitle}</p> */}
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
