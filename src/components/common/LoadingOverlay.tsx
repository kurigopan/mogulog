"use client";

import { CircularProgress } from "@mui/material";
import { useAtomValue } from "jotai";
import { loadingAtom } from "@/lib/atoms";

export const LoadingOverlay = () => {
  const isLoading = useAtomValue(loadingAtom);

  if (!isLoading) {
    return null; // ローディング中でない場合は何も表示しない
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // 他の要素より手前に表示
      }}
    >
      <div className="flex justify-center py-12">
        <CircularProgress color="secondary" />
      </div>
    </div>
  );
};
