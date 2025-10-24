import { ChildCareIcon } from "@/icons";

type LogoProps = {
  showSubtitle?: boolean;
};

export function Logo({ showSubtitle = false }: LogoProps) {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center items-center mb-3">
        <div className="text-violet-400 mr-3">
          <ChildCareIcon style={{ fontSize: 50 }} />
        </div>
        <h1 className="text-4xl font-bold text-stone-700">もぐログ</h1>
      </div>
      {showSubtitle && (
        <p className="text-stone-500">離乳食づくりのサポートアプリ</p>
      )}
    </div>
  );
}
