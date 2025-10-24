"use client";

import { ShareIcon } from "@/icons";

type Props = {
  title: string;
};

export default function ShareButton({ title }: Props) {
  const handleShare = async () => {
    const shareData = {
      title,
      text: `${title} をシェアします！`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
          console.error("共有に失敗しました", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.url);
      } catch (err) {
        console.error("コピーに失敗しました", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 hover:bg-stone-100 rounded-2xl transition-colors"
    >
      <ShareIcon />
    </button>
  );
}
