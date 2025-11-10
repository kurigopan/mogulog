"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ErrorOutlineIcon } from "@/icons";

export default function NotFoundPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-violet-100 flex items-center justify-center">
        <ErrorOutlineIcon className="text-violet-500 text-3xl" />
      </div>
      <h3 className="text-lg font-semibold text-stone-700 mb-4">
        ページが見つかりません
      </h3>
      <p className="text-stone-500 mb-4">
        お探しのページは存在しないか、
        <br />
        削除されている可能性があります
      </p>
      <div className="flex flex-col gap-3 items-center">
        <button
          onClick={handleBack}
          className="w-50 py-3 px-6 rounded-2xl font-medium bg-violet-400 text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          前のページに戻る
        </button>
        <Link
          href="/"
          className="w-50 py-3 px-6 rounded-2xl font-medium bg-stone-200 hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
