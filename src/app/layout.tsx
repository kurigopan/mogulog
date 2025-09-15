import "./globals.css";
import type { Metadata } from "next";
import { Provider } from "jotai";
import SupabaseAuthObserver from "@/components/SupabaseAuthObserver";
import LoadingOverlay from "@/components/LoadingOverlay";
import LoadingResetter from "@/components/LoadingResetter";

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
      <body>
        <Provider>
          <SupabaseAuthObserver />
          <LoadingOverlay />
          <LoadingResetter />
          <div className="bg-stone-50 text-stone-700 min-h-screen">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
