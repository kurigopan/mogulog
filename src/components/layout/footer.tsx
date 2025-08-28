import { HomeIcon, FavoriteIcon, ListIcon, PersonIcon, AddIcon } from "@/icons";

export default function Footer() {
  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-2 shadow-lg">
        <div className="flex justify-around">
          <button className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 hover:scale-105 active:scale-95">
            <div className="text-purple-400 mb-1">
              <HomeIcon />
            </div>
            <span className="text-xs text-purple-600 font-medium">ホーム</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-stone-50 transition-all duration-200 hover:scale-105 active:scale-95">
            <div className="text-stone-400 mb-1">
              <FavoriteIcon />
            </div>
            <span className="text-xs text-stone-500">お気に入り</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-stone-50 transition-all duration-200 hover:scale-105 active:scale-95">
            <div className="text-stone-400 mb-1">
              <ListIcon />
            </div>
            <span className="text-xs text-stone-500">食材リスト</span>
          </button>
          <button className="flex flex-col items-center py-2 px-3 rounded-lg hover:bg-stone-50 transition-all duration-200 hover:scale-105 active:scale-95">
            <div className="text-stone-400 mb-1">
              <PersonIcon />
            </div>
            <span className="text-xs text-stone-500">マイページ</span>
          </button>
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-4">
        <button className="w-14 h-14 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 group">
          <div className="text-white group-hover:rotate-90 transition-transform duration-200">
            <AddIcon />
          </div>
        </button>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </>
  );
}
