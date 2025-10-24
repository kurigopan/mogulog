export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_by: string;
  updated_by: string;
  created_at?: string;
}

export interface Child {
  id: number;
  parent_id: string;
  name: string;
  birthday: string;
  created_by: string;
  updated_by: string;
}

export interface ChildAllergens {
  id?: number;
  child_id: number;
  allergen_id: number;
  created_by: string;
  updated_by: string;
}

export interface FavoritesRecipes {
  parent_id: string;
  recipe_id: number;
  created_by: string;
  updated_by: string;
}

export interface FavoritesIngredients {
  parent_id: string;
  ingredient_id: number;
  created_by: string;
  updated_by: string;
}
