"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowForwardIcon,
  TipsAndUpdatesIcon,
  MenuBookIcon,
  SearchIcon,
  CheckCircleOutlineIcon,
  LoginIcon,
} from "@/icons";
import CenteredCard from "@/components/ui/CenteredCard";

export default function Introduction() {
  const [currentScreen, setCurrentScreen] = useState("welcome");

  const freeFeatures = [
    {
      icon: <SearchIcon className="text-2xl" />,
      title: "食材検索",
      description: "月齢に合った食材を簡単検索",
    },
    {
      icon: <MenuBookIcon className="text-2xl" />,
      title: "レシピ閲覧",
      description: "離乳食のレシピを確認",
    },
    {
      icon: <TipsAndUpdatesIcon className="text-2xl" />,
      title: "調理のコツ",
      description: "月齢別の調理方法やポイント",
    },
  ];

  const loginFeatures = [
    "お子様の月齢に合わせた提案",
    "食べた食材の記録",
    "アレルギー情報の登録",
    "オリジナルレシピの記録",
    "お気に入り登録が無制限",
    // "複数のお子さまの登録",
  ];

  if (currentScreen === "welcome") {
    return (
      <CenteredCard type="welcome">
        {" "}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-stone-700 mb-3">
            はじめまして！
          </h2>
          <p className="text-stone-600 leading-relaxed">
            もぐログは離乳食づくりを
            <br />
            サポートするアプリです
          </p>
        </div>
        {/* デフォルト機能一覧 */}
        <div className="mb-8">
          <p className="text-sm font-medium text-stone-500 mb-4 text-center">
            ログインなしですぐに使える機能
          </p>
          <div className="space-y-4">
            {freeFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-violet-50 rounded-3xl"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-3xl flex items-center justify-center text-violet-500 mr-4">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-700 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* 次ボタン */}
        <button
          onClick={() => setCurrentScreen("loginPrompt")}
          className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          <span>つぎへ</span>
          <ArrowForwardIcon className="ml-2" />
        </button>
      </CenteredCard>
    );
  }

  // Login Prompt Screen
  return (
    <CenteredCard>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
          <LoginIcon className="text-violet-500 text-3xl" />
        </div>
        <h2 className="text-xl font-bold text-stone-700 mb-2">
          ログインでもっと便利に！
        </h2>
        <p className="text-stone-500 text-sm">
          以下の機能が利用できるようになります
        </p>
      </div>
      {/* ログイン機能一覧 */}
      <div className="bg-violet-50 rounded-3xl p-6 mb-6">
        <ul className="space-y-3">
          {loginFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircleOutlineIcon className="text-violet-400 text-lg mr-3 mt-0.5" />
              <span className="text-stone-700 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* ボタン */}
      <div className="space-y-3">
        <Link href="/register/authform">
          <button className="w-full py-4 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all mb-2">
            ログイン・新規登録する
          </button>
        </Link>
        <Link href="/">
          <button className="w-full py-4 rounded-2xl font-medium border-2 border-stone-300 text-stone-600 hover:bg-stone-50 transition-all">
            まずは使ってみる
          </button>
        </Link>

        <p className="text-center text-xs text-stone-400 mt-4 mb-2">
          ※あとからでもログインできます
        </p>
      </div>
    </CenteredCard>
  );
}
