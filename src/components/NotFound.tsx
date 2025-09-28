"use client";

import Link from "next/link";
import { ErrorOutlineIcon } from "@/icons";
import router from "next/router";

export default function NotFoundPage() {
  const handleBack = () => {
    router.back();
  };
  return (
    <div className="flex flex-col bg-white rounded-3xl shadow-sm text-center p-4 space-y-4 mt-20 mx-auto w-full max-w-lg">
      <div className="text-6xl text-stone-300 font-bold">404</div>
      <div className="w-20 h-20 mx-auto rounded-full bg-stone-100 flex items-center justify-center">
        <ErrorOutlineIcon className="text-violet-500 text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-stone-700">
        ページが見つかりません
      </h2>
      <p className="text-stone-600 mb-4 leading-relaxed">
        お探しのページは存在しないか、
        <br />
        削除されている可能性があります。
        <br />
        URLをご確認いただくか、再度お探しください。
      </p>
      <div className="space-y-3 mx-auto">
        <button
          onClick={handleBack}
          className="block w-full bg-violet-500 hover:bg-violet-600 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200"
        >
          前のページに戻る
        </button>
        <Link
          href="/"
          className="block w-full bg-stone-200 hover:text-stone-600 font-medium py-3 px-6 rounded-full transition-colors duration-200"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
