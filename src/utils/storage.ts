import { AppData, IngredientNode, IngredientVariant, JournalEntry, Recipe, RecipeIngredient } from "../types/models";
import { DEFAULT_VARIANT_NAME } from "./constants";
import { createId } from "./id";

const STORAGE_KEY = "dieta-app-data";

const normalizeRecipeIngredient = (item: Record<string, unknown>): RecipeIngredient => ({
  id: String(item.id ?? createId()),
  ingredientId: typeof item.ingredientId === "string" ? item.ingredientId : null,
  variantId: typeof item.variantId === "string" ? item.variantId : null,
  path: Array.isArray(item.path) ? item.path.filter((value): value is string => typeof value === "string") : [],
  cantidad: typeof item.cantidad === "number" ? item.cantidad : "",
  unidad: typeof item.unidad === "string" ? item.unidad : "g",
});

const normalizeRecipe = (item: Record<string, unknown>): Recipe => {
  const ingredientes = Array.isArray(item.ingredientes) ? item.ingredientes : [];

  return {
    id: String(item.id ?? createId()),
    nombre: String(item.nombre ?? ""),
    ingredientes: ingredientes.map((recipeIngredient) =>
      normalizeRecipeIngredient(recipeIngredient as Record<string, unknown>),
    ),
  };
};

const normalizeJournalEntry = (entry: Record<string, unknown>): JournalEntry | null => {
  const tipo = entry.tipo;
  const fecha = typeof entry.fecha === "string" ? entry.fecha : "";
  const id = String(entry.id ?? createId());

  if (!fecha) {
    return null;
  }

  if (tipo === "ingrediente") {
    return {
      id,
      tipo: "ingrediente",
      fecha,
      item: normalizeRecipeIngredient((entry.item as Record<string, unknown>) ?? {}),
    };
  }

  if (tipo === "receta") {
    return {
      id,
      tipo: "receta",
      fecha,
      recipeId: typeof entry.recipeId === "string" ? entry.recipeId : null,
      recipe: normalizeRecipe((entry.recipe as Record<string, unknown>) ?? {}),
    };
  }

  return null;
};

const normalizeAppData = (raw: unknown): AppData | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const source = raw as Record<string, unknown>;
  const categories = Array.isArray(source.categories) ? source.categories : [];
  const rawIngredients = Array.isArray(source.ingredients) ? source.ingredients : [];
  const rawVariants = Array.isArray(source.variants) ? source.variants : [];
  const recipes = Array.isArray(source.recipes) ? source.recipes : [];
  const journalEntries = Array.isArray(source.journalEntries) ? source.journalEntries : [];

  const normalizedIngredients: IngredientNode[] = rawIngredients.map((ingredient) => {
    const item = ingredient as Record<string, unknown>;
    return {
      id: String(item.id ?? createId()),
      nombre: String(item.nombre ?? "Ingrediente"),
      parentId: String(item.parentId ?? ""),
      tipo: "ingrediente",
      notas: typeof item.notas === "string" ? item.notas : undefined,
    };
  });

  const normalizedVariants: IngredientVariant[] = rawVariants.length
    ? rawVariants.map((variant) => {
        const item = variant as Record<string, unknown>;
        return {
          id: String(item.id ?? createId()),
          ingredientId: String(item.ingredientId ?? ""),
          marca: String(item.marca ?? DEFAULT_VARIANT_NAME),
          calorias: Number(item.calorias ?? 0),
          unidadBase: String(item.unidadBase ?? "g"),
          cantidadBase: Number(item.cantidadBase ?? 100),
        };
      })
    : rawIngredients.map((ingredient) => {
        const item = ingredient as Record<string, unknown>;
        return {
          id: createId(),
          ingredientId: String(item.id ?? createId()),
          marca: DEFAULT_VARIANT_NAME,
          calorias: Number(item.calorias ?? 0),
          unidadBase: String(item.unidadBase ?? "g"),
          cantidadBase: Number(item.cantidadBase ?? 100),
        };
      });

  const variantIngredientIds = new Set(normalizedVariants.map((variant) => variant.ingredientId));
  const ensuredVariants = [...normalizedVariants];

  normalizedIngredients.forEach((ingredient) => {
    if (!variantIngredientIds.has(ingredient.id)) {
      ensuredVariants.push({
        id: createId(),
        ingredientId: ingredient.id,
        marca: DEFAULT_VARIANT_NAME,
        calorias: 0,
        unidadBase: "g",
        cantidadBase: 100,
      });
    }
  });

  return {
    categories: categories as AppData["categories"],
    ingredients: normalizedIngredients,
    variants: ensuredVariants,
    recipes: recipes.map((recipe) => normalizeRecipe(recipe as Record<string, unknown>)),
    journalEntries: journalEntries
      .map((entry) => normalizeJournalEntry(entry as Record<string, unknown>))
      .filter((entry): entry is JournalEntry => Boolean(entry)),
  };
};

export const loadAppData = (): AppData | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return normalizeAppData(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveAppData = (data: AppData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
