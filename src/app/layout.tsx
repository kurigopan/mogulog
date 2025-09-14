import type { Metadata } from "next";
import "./globals.css";
// import SupabaseListener from "@/components/supabase/supabaseListener";

export const metadata: Metadata = {
  title: "もぐログ",
  description: "離乳食づくりサポートアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      {/* <SupabaseListener /> */}
      <body className="bg-stone-50 text-stone-700 min-h-screen">
        {children}
      </body>
    </html>
  );
}
