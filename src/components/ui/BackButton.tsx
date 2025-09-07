"use client";

import { useRouter } from "next/navigation";
import { ArrowBackIosIcon } from "@/icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push("/"); // 履歴がなければトップページへ
        }
      }}
    >
      <ArrowBackIosIcon />
    </button>
  );
}
