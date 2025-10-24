import "@/app/globals.css";
import { Suspense } from "react";
import type { Metadata } from "next";
import { M_PLUS_Rounded_1c } from "next/font/google";
import { AuthObserver } from "@/components/common/AuthObserver";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { LoadingResetter } from "@/components/common/LoadingResetter";
import { UserInitializer } from "@/components/common/UserInitializer";
import { PrevPathObserver } from "@/components/common/PrevPathObserver";
import LoginPromptDialog from "@/components/common/LoginPromptDialog";
import { Provider } from "jotai";

const mPlus = M_PLUS_Rounded_1c({
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
});

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
    <html lang="ja" className={mPlus.className}>
      <body>
        <Provider>
          <AuthObserver />
          <LoadingOverlay />
          <Suspense fallback={null}>
            <LoadingResetter />
          </Suspense>
          <UserInitializer />
          <PrevPathObserver />
          <div className="bg-stone-50 text-stone-700 min-h-screen">
            {children}
          </div>
          <LoginPromptDialog />
        </Provider>
      </body>
    </html>
  );
}
