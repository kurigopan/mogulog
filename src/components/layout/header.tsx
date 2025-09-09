import { ReactNode } from "react";
import {
  ChildCareIcon,
  // DeleteIcon,
  // ShareIcon,
} from "@/icons";
import BackButton from "@/components/ui/BackButton";
import RemoveButton from "@/components/ui/RemoveButton";

type HeaderProps = {
  pageName?: pageType;
  title: string;
  content?: ReactNode;
};

type pageType =
  | "home"
  | "ingredientDetail"
  | "recipeDetail"
  | "favorites"
  | "drafts"
  | "created"
  | "edit"
  | "history"
  | "search"
  | "ingredientsList";

export default function Header({ pageName, title, content }: HeaderProps) {
  // const handleFavoriteClick = (
  //   e: React.MouseEvent<HTMLElement>,
  //   item: CardItem
  // ) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const updateCardItems = cardItems.map((prevItem) =>
  //     item.id == prevItem.id
  //       ? { ...prevItem, isFavorite: !prevItem.isFavorite }
  //       : prevItem
  //   );
  //   setListCardItems(updateCardItems);
  // };

  // const handleDelete = (e: React.MouseEvent<HTMLElement>, item: CardItem) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   if (
  //     window.confirm(
  //       `「${item.name}」を削除しますか？この操作は取り消せません。`
  //     )
  //   ) {
  //     const updateCardItems = cardItems.filter(
  //       (prevItem) => item.id !== prevItem.id
  //     );
  //     setListCardItems(updateCardItems);
  //   }
  // };

  // const rightSide = () => {
  //   switch (pageName) {
  //     case "home":
  //       return <AgeOptionsFilter />;
  //     case "ingredientDetail":
  //     case "recipeDetail":
  //       return (
  //         <div className="flex items-center space-x-2">
  //           <ShareButton />
  //           <FavoriteButton />
  //         </div>
  //       );
  //     case "favorites":
  //     case "created":
  //     case "drafts":
  //       return (
  //         <>
  //           {createdRecipes.length > 0 && (
  //             <select
  //               value={sortBy}
  //               onChange={(e) => setSortBy(e.target.value)}
  //               className="text-sm text-stone-600 bg-white border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300"
  //             >
  //               <option value="newest">新しい順</option>
  //               <option value="oldest">古い順</option>
  //               <option value="name">名前順</option>
  //               <option value="subtitle">離乳食段階順</option>
  //             </select>
  //           )}
  //         </>
  //       );
  //     case "edit":
  //       return (
  //         <button
  //           onClick={(e) => handleDelete(e, item)}
  //           className="p-2 text-stone-500 hover:text-red-500 transition-colors"
  //           title="削除"
  //         >
  //           <DeleteIcon />
  //         </button>
  //       );
  //     case "history":
  // return <RemoveButton />;
  //   }
  // };

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
