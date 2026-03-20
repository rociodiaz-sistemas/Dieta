export type NodeType = "categoria" | "ingrediente";

export interface CategoryNode {
  id: string;
  nombre: string;
  parentId: string | null;
  tipo: "categoria";
}

export interface IngredientNode {
  id: string;
  nombre: string;
  parentId: string;
  tipo: "ingrediente";
  calorias: number;
  unidadBase: string;
  cantidadBase: number;
  notas?: string;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string | null;
  path: string[];
  cantidad: number | "";
  unidad: string;
}

export interface Recipe {
  id: string;
  nombre: string;
  ingredientes: RecipeIngredient[];
}

export interface AppData {
  categories: CategoryNode[];
  ingredients: IngredientNode[];
  recipes: Recipe[];
}

export interface IngredientFormValues {
  nombre: string;
  calorias: number | "";
  unidadBase: string;
  cantidadBase: number | "";
  notas: string;
}
