"use client";

import { useState } from "react";
import ChildCareIcon from "@mui/icons-material/ChildCare";

export default function Setup() {
  const [selectedAge, setSelectedAge] = useState("");
  const [childName, setChildName] = useState("");

  const ageOptions = [
    {
      value: "5-6",
      label: "5〜6ヶ月",
      description: "離乳食初期（ゴックン期）",
    },
    {
      value: "7-8",
      label: "7〜8ヶ月",
      description: "離乳食中期（モグモグ期）",
    },
    {
      value: "9-11",
      label: "9〜11ヶ月",
      description: "離乳食後期（カミカミ期）",
    },
    {
      value: "12-18",
      label: "12〜18ヶ月",
      description: "離乳食完了期（パクパク期）",
    },
  ];

  const handleSubmit = () => {
    // In a real app, this would save to backend/localStorage
    console.log("Selected age:", selectedAge, "Child name:", childName);
    // Navigate to home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="flex mb-2">
            <div className="text-purple-400 text-3xl mr-4">
              <ChildCareIcon />
            </div>
            <h1 className="text-3xl font-bold text-stone-700">もぐログ</h1>
          </div>
          <p className="text-stone-500 text-sm">離乳食づくりのサポートアプリ</p>
        </div>

        {/* Welcome Message */}
        <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-sm mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-stone-700 mb-2">
              はじめまして！
            </h2>
            <p className="text-stone-500 text-sm">
              お子さまについて教えてください
            </p>
          </div>

          {/* Child Name Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-600 mb-2">
              お子さまのお名前（任意）
            </label>
            <input
              type="text"
              placeholder="例：ももちゃん"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
            />
          </div>

          {/* Age Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-600 mb-3">
              現在の月齢
            </label>
            <div className="space-y-3">
              {ageOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedAge(option.value)}
                  className={`w-full p-4 text-left rounded-2xl border-2 transition-all ${
                    selectedAge === option.value
                      ? "border-purple-300 bg-purple-50"
                      : "border-stone-200 hover:border-purple-200 hover:bg-purple-25"
                  }`}
                >
                  <div className="font-medium text-stone-700">
                    {option.label}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">
                    {option.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedAge}
            className={`w-full py-4 rounded-2xl font-medium transition-all ${
              selectedAge
                ? "bg-gradient-to-r from-purple-400 to-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            }`}
          >
            はじめる
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-stone-400">© 2025 もぐログ</p>
      </div>
    </div>
  );
}
