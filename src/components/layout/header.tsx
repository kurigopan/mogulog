import { ReactNode } from "react";

type HeaderProps = {
  icon?: ReactNode;
  title?: string;
  content?: ReactNode;
};

export default function Header({ icon, title, content }: HeaderProps) {
  return (
    <header className="bg-white border-b border-stone-200 p-4 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-3 p-2 hover:bg-stone-100 rounded-lg transition-colors">
            {icon}
          </button>
          <h1 className="text-lg font-bold text-stone-700">{title}</h1>
        </div>
        {content}
      </div>
    </header>
  );
}
