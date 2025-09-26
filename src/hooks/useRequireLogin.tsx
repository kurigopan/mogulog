import { useAtomValue, useSetAtom } from "jotai";
import { userIdAtom, loginDialogAtom } from "@/lib/atoms";

export const useRequireLogin = () => {
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogOpen = useSetAtom(loginDialogAtom);

  const requireLogin = () => {
    if (!userId) {
      setLoginDialogOpen(true);
      return false;
    }
    return true;
  };

  return requireLogin;
};
