import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "もぐログ",
  description: "月齢に合わせた離乳食レシピ・食材管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-stone-50 text-stone-700 min-h-screen">
        {children}
      </body>
    </html>
  );
}
