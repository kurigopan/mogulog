"use client";

import { useState } from "react";
import { ShareIcon } from "@/icons";

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: `${title} をシェアします！`,
      url: window.location.href, // ✅ 現在のページのURLを共有
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("コピーに失敗しました", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
    >
      <ShareIcon />
    </button>
  );
}
