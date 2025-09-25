import { ReactNode } from "react";
import { ChildCareIcon } from "@/icons";
import BackButton from "@/components/ui/BackButton";
import { PageName } from "@/types/types";

type HeaderProps = {
  pageName?: PageName;
  title: string;
  content?: ReactNode;
};

export default function Header({ pageName, title, content }: HeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 p-4 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* 左側のコンテンツ */}
        <div className="flex items-center">
          <div className="mr-3 p-2 hover:bg-stone-100 rounded-lg transition-colors">
            {pageName === "home" ? <ChildCareIcon /> : <BackButton />}
          </div>
          <h1 className="text-lg font-bold text-stone-700">{title}</h1>
        </div>
        {/* 右側のコンテンツ */}
        <div className="flex items-center">{content}</div>
      </div>
    </header>
  );
}
