import React from "react";
import { Category, Stage, Type } from "@/types";

export interface CardItem {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  category: Category;
  type: Type;
  startStage: Stage;
  date: Date;
}

export interface ListCardItem extends CardItem {
  isFavorite: boolean;
}

export interface CardContent {
  id: string;
  title: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  cardItems: CardItem[];
}
