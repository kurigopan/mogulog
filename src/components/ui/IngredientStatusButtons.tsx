"use client";

import { CheckCircleIcon, CancelIcon } from "@/icons";
import { Ingredient } from "@/types";
import { useIngredientStatusToggle } from "@/hooks/useIngredientStatusToggle";

type Props = {
  ingredient: Ingredient;
};

export default function IngredientStatusButtons({ ingredient }: Props) {
  const { eaten, ng, toggleEaten, toggleNG } =
    useIngredientStatusToggle(ingredient);

  return (
    <div className="flex justify-center space-x-3 mt-6">
      <button
        onClick={toggleEaten}
        className={`w-50 flex items-center justify-center py-3 px-4 rounded-full font-medium transition-all ${
          eaten
            ? "bg-green-100 text-green-600 border-2 border-green-200"
            : "bg-stone-100 text-stone-600 hover:bg-green-50 border-2 border-transparent"
        }`}
      >
        <CheckCircleIcon />
        <span className="ml-2">食べた</span>
      </button>
      <button
        onClick={toggleNG}
        className={`w-50 flex items-center justify-center py-3 px-4 rounded-full font-medium transition-all ${
          ng
            ? "bg-red-100 text-red-600 border-2 border-red-200"
            : "bg-stone-100 text-stone-600 hover:bg-red-50 border-2 border-transparent"
        }`}
      >
        <CancelIcon />
        <span className="ml-2">NG</span>
      </button>
    </div>
  );
}
