import { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { Copyright } from "@/components/ui/Copyright";

type CenteredCardProps = {
  type?: "welcome";
  children?: ReactNode;
};
export default function CenteredCard({ type, children }: CenteredCardProps) {
  return (
    <div
      className="bg-gradient-to-br from-violet-50 to-violet-50 flex flex-col"
      style={{ minHeight: "100dvh" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {type === "welcome" ? <Logo showSubtitle={true} /> : <Logo />}
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
          {children}
        </div>
      </div>
      <Copyright />
    </div>
  );
}
