"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header title="ページが見つかりません" />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center max-w-md w-full">
          {/* 404アイコン */}
          <div className="mb-6">
            <div className="text-6xl text-stone-300 font-bold mb-4">404</div>
            <div className="w-24 h-24 mx-auto bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-12 h-12 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.476-6.182-1.291M21 12c0 5.523-4.477 10-10 10S1 17.523 1 12 5.477 2 11 2s10 4.477 10 10z"
                />
              </svg>
            </div>
          </div>

          {/* メッセージ */}
          <h2 className="text-2xl font-bold text-stone-700 mb-3">
            食材が見つかりません
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            お探しの食材は存在しないか、削除されている可能性があります。
            <br />
            URLをご確認いただくか、食材一覧から再度お探しください。
          </p>

          {/* アクションボタン */}
          <div className="space-y-3">
            <Link
              href="/ingredients"
              className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200"
            >
              食材一覧に戻る
            </Link>

            <button
              onClick={handleGoBack}
              className="block w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 px-6 rounded-full transition-colors duration-200"
            >
              前のページに戻る
            </button>

            <Link
              href="/"
              className="block w-full text-stone-500 hover:text-stone-600 font-medium py-2 transition-colors duration-200"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
