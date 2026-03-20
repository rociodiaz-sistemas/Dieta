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
  notas?: string;
}

export interface IngredientVariant {
  id: string;
  ingredientId: string;
  marca: string;
  calorias: number;
  unidadBase: string;
  cantidadBase: number;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string | null;
  variantId: string | null;
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
  variants: IngredientVariant[];
  recipes: Recipe[];
}

export interface IngredientFormValues {
  nombre: string;
  notas: string;
  calorias: number | "";
  unidadBase: string;
  cantidadBase: number | "";
}

export interface IngredientEditValues {
  nombre: string;
  notas: string;
}

export interface VariantFormValues {
  marca: string;
  calorias: number | "";
  unidadBase: string;
  cantidadBase: number | "";
}
