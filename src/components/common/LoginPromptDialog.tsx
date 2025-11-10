"use client";

import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/ui/ConfirmationDialog";
import { useAtom } from "jotai";
import { loginDialogSourceAtom } from "@/lib/utils/atoms";

export default function LoginPromptDialog() {
  const [source, setSource] = useAtom(loginDialogSourceAtom);
  const router = useRouter();

  const handleClose = () => {
    if (source == "ingredientStatusToggle") {
      setSource(null);
    } else {
      setSource(null);
      router.push("/");
    }
  };

  const handleConfirm = () => {
    setSource(null);
    router.push("/register/authform");
  };

  return (
    <ConfirmationDialog
      isOpen={source !== null}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="ログインが必要です"
      message="この機能を使うにはログインしてください"
      cancelText="閉じる"
      confirmText="ログイン"
    />
  );
}
