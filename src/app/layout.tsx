import "@/app/globals.css";
import type { Metadata } from "next";
import { Provider } from "jotai";
import { AuthObserver } from "@/components/AuthObserver";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { LoadingResetter } from "@/components/LoadingResetter";
import { UserInitializer } from "@/components/UserInitializer";
import LoginPromptDialog from "@/components/LoginPromptDialog";

export const metadata: Metadata = {
  title: "もぐログ",
  description: "離乳食づくりサポートアプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Provider>
          <AuthObserver />
          <LoadingOverlay />
          <LoadingResetter />
          <UserInitializer />
          <div className="bg-stone-50 text-stone-700 min-h-screen">
            {children}
          </div>
          <LoginPromptDialog />
        </Provider>
      </body>
    </html>
  );
}
