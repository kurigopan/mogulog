import { useAtomValue } from "jotai";
import { userIdAtom } from "@/lib/atoms";

export const useRequireLogin = () => {
  const userId = useAtomValue(userIdAtom);

  const requireLogin = () => {
    if (!userId) {
      return false;
    }
    return true;
  };

  return requireLogin;
};
