"use client";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { loginDialogSourceAtom } from "@/lib/atoms";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

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

  return (
    <Dialog open={source !== null} onClose={handleClose}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText>
          この機能を使うにはログインしてください。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>閉じる</Button>
        <Button
          onClick={() => {
            setSource(null);
            router.push("/authform");
          }}
        >
          ログイン・新規登録へ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
