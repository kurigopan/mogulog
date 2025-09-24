export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
  public: {
    Tables: {
      allergens: {
        Row: {
          created_at: string;
          created_by: string;
          id: number;
          name: string;
          updated_at: string;
          updated_by: string;
          variants: string[];
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: number;
          name: string;
          updated_at?: string;
          updated_by: string;
          variants?: string[];
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: number;
          name?: string;
          updated_at?: string;
          updated_by?: string;
          variants?: string[];
        };
        Relationships: [];
      };
      child_allergens: {
        Row: {
          allergen_id: number;
          child_id: number;
          created_at: string;
          created_by: string | null;
          id: number;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          allergen_id: number;
          child_id: number;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          allergen_id?: number;
          child_id?: number;
          created_at?: string;
          created_by?: string | null;
          id?: number;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "child_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_allergens_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          }
        ];
      };
      child_ingredient_logs: {
        Row: {
          child_id: number;
          created_at: string;
          created_by: string;
          id: number;
          ingredient_id: number;
          status: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          child_id: number;
          created_at?: string;
          created_by: string;
          id?: number;
          ingredient_id: number;
          status: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          child_id?: number;
          created_at?: string;
          created_by?: string;
          id?: number;
          ingredient_id?: number;
          status?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "child_ingredient_logs_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_ingredient_logs_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          }
        ];
      };
      children: {
        Row: {
          birthday: string;
          created_at: string;
          created_by: string;
          id: number;
          name: string;
          parent_id: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          birthday: string;
          created_at?: string;
          created_by: string;
          id?: number;
          name: string;
          parent_id: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          birthday?: string;
          created_at?: string;
          created_by?: string;
          id?: number;
          name?: string;
          parent_id?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "children_auth_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      favorites_ingredients: {
        Row: {
          created_at: string;
          created_by: string;
          id: number;
          ingredient_id: number;
          parent_id: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: number;
          ingredient_id: number;
          parent_id: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: number;
          ingredient_id?: number;
          parent_id?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_ingredients_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_ingredients_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      favorites_recipes: {
        Row: {
          created_at: string;
          created_by: string;
          id: number;
          parent_id: string;
          recipe_id: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: number;
          parent_id: string;
          recipe_id: number;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: number;
          parent_id?: string;
          recipe_id?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_recipes_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ingredient_allergens: {
        Row: {
          allergen_id: number;
          allergen_name: string;
          created_at: string;
          created_by: string;
          id: number;
          ingredient_id: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          allergen_id: number;
          allergen_name: string;
          created_at?: string;
          created_by: string;
          id?: number;
          ingredient_id: number;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          allergen_id?: number;
          allergen_name?: string;
          created_at?: string;
          created_by?: string;
          id?: number;
          ingredient_id?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "ingredient_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "ingredient_allergens_allergens_name_fkey";
            columns: ["allergen_name"];
            isOneToOne: true;
            referencedRelation: "allergens";
            referencedColumns: ["name"];
          },
          {
            foreignKeyName: "ingredient_allergens_ingredient_id_fkey";
            columns: ["ingredient_id"];
            isOneToOne: false;
            referencedRelation: "ingredients";
            referencedColumns: ["id"];
          }
        ];
      };
      ingredients: {
        Row: {
          category: string;
          created_at: string;
          created_by: string;
          description: string | null;
          id: number;
          image_url: string | null;
          name: string;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name: string;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          name?: string;
          nutrition?: Json;
          seasons?: string[];
          stage_info?: Json;
          start_stage?: string;
          tips?: string[];
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          created_by: string;
          id: string;
          name: string;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          created_by: string;
          id: string;
          name: string;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
      recipe_allergens: {
        Row: {
          allergen_id: number;
          created_at: string;
          created_by: string;
          id: number;
          recipe_id: number;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          allergen_id: number;
          created_at?: string;
          created_by: string;
          id?: number;
          recipe_id: number;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          allergen_id?: number;
          created_at?: string;
          created_by?: string;
          id?: number;
          recipe_id?: number;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recipe_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "recipe_allergens_recipe_id_fkey";
            columns: ["recipe_id"];
            isOneToOne: false;
            referencedRelation: "recipes";
            referencedColumns: ["id"];
          }
        ];
      };
      recipes: {
        Row: {
          category: string;
          cooking_time: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: number;
          image_url: string | null;
          ingredients: Json;
          is_private: boolean;
          memo: string | null;
          name: string;
          servings: string | null;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          category: string;
          cooking_time?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          ingredients: Json;
          is_private?: boolean;
          memo?: string | null;
          name: string;
          servings?: string | null;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          category?: string;
          cooking_time?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: number;
          image_url?: string | null;
          ingredients?: Json;
          is_private?: boolean;
          memo?: string | null;
          name?: string;
          servings?: string | null;
          start_stage?: string;
          steps?: Json;
          tags?: string[];
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_favorite_ingredients: {
        Args: { user_id: string };
        Returns: {
          category: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          is_favorite: boolean;
          name: string;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_favorite_recipes: {
        Args: { user_id: string };
        Returns: {
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_ingredient_by_id: {
        Args: {
          child_id_param: number | null;
          ingredient_id_param: number;
          parent_id_param: string | null;
        };
        Returns: {
          category: string;
          created_at: string;
          created_by: string;
          description: string;
          eaten: boolean;
          id: number;
          image_url: string;
          is_favorite: boolean;
          name: string;
          ng: boolean;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_ingredients_with_status: {
        Args: { child_id_param: number | null; parent_id_param: string | null };
        Returns: {
          category: string;
          created_at: string;
          created_by: string;
          description: string;
          eaten: boolean;
          id: number;
          image_url: string;
          is_favorite: boolean;
          name: string;
          ng: boolean;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_recipe_allergens: {
        Args: { recipe_id_param: number };
        Returns: {
          id: number;
          name: string;
          variants: string[];
        }[];
      };
      get_recipe_by_id: {
        Args: { parent_id_param: string | null; recipe_id_param: number };
        Returns: {
          author: string;
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_own: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_recipes: {
        Args: { parent_id_param: string | null };
        Returns: {
          author: string;
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_own: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      get_recipes_created_by_user: {
        Args: { user_id: string };
        Returns: {
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      search_ingredients_with_allergens: {
        Args: {
          child_id_param: number;
          excluded_allergen_ids: number[];
          parent_id_param: string;
          search_term: string;
        };
        Returns: {
          category: string;
          created_at: string;
          created_by: string;
          description: string;
          eaten: boolean;
          id: number;
          image_url: string;
          is_favorite: boolean;
          name: string;
          ng: boolean;
          nutrition: Json;
          seasons: string[];
          stage_info: Json;
          start_stage: string;
          tips: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      search_recipes_by_ingredient: {
        Args: {
          age_stage_param: string;
          ingredient_name_param: string;
          parent_id_param: string | null;
        };
        Returns: {
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
      search_recipes_with_allergens: {
        Args: {
          excluded_allergen_ids: number[];
          parent_id_param: string;
          search_term: string;
        };
        Returns: {
          author: string;
          category: string;
          cooking_time: string;
          created_at: string;
          created_by: string;
          description: string;
          id: number;
          image_url: string;
          ingredients: Json;
          is_favorite: boolean;
          is_own: boolean;
          is_private: boolean;
          memo: string;
          name: string;
          servings: string;
          start_stage: string;
          steps: Json;
          tags: string[];
          updated_at: string;
          updated_by: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
