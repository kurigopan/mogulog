"use client";

import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RecipeForm from "@/components/features/RecipeForm";
import { useAtomValue, useSetAtom } from "jotai";
import { loginDialogSourceAtom, userIdAtom } from "@/lib/utils/atoms";

export default function RecipeCreatePage() {
  const userId = useAtomValue(userIdAtom);
  const setLoginDialogSource = useSetAtom(loginDialogSourceAtom);

  useEffect(() => {
    if (!userId) {
      setLoginDialogSource("create");
    }
  }, [userId]);

  return (
    <>
      <Header title="レシピ作成" />
      <RecipeForm initialData={null} isEditMode={false} />
      <Footer pageName="create" />
    </>
  );
}
