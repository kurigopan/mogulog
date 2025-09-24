"use client";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { loginDialogAtom } from "@/lib/atoms";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

export default function LoginPromptDialog() {
  const [open, setOpen] = useAtom(loginDialogAtom);
  const router = useRouter();

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>ログインが必要です</DialogTitle>
      <DialogContent>
        <DialogContentText>
          この機能を使うにはログインしてください。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>閉じる</Button>
        <Button
          onClick={() => {
            setOpen(false);
            router.push("/authform");
          }}
          autoFocus
        >
          ログイン・新規登録へ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
