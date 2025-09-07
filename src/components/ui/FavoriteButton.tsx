"use client";

import { useState } from "react";
import { FavoriteBorderIcon, FavoriteIcon } from "@/icons";

export default function FavoriteButton() {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };

  return (
    <button
      onClick={handleFavorite}
      className={`p-2 rounded-lg transition-colors ${
        isFavorited
          ? "bg-red-100 text-red-500 hover:bg-red-200"
          : "hover:bg-stone-100 text-stone-500"
      }`}
    >
      {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </button>
  );
}
