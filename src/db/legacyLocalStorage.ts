import {
  AppData,
  IngredientNode,
  IngredientVariant,
  JournalEntry,
  MonthlyCalorieTarget,
  Recipe,
  RecipeIngredient,
} from "../types/models";
import { DEFAULT_MONTHLY_CALORIE_TARGET, DEFAULT_VARIANT_NAME } from "../utils/constants";
import { formatMonthKey } from "../utils/date";
import { createId } from "../utils/id";

const LEGACY_STORAGE_KEY = "dieta-app-data";

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

const normalizeTarget = (value: unknown): MonthlyCalorieTarget => {
  if (typeof value === "number") {
    return {
      goal: value,
      maintenance: value + 300,
    };
  }

  if (value && typeof value === "object") {
    const raw = value as Record<string, unknown>;
    const goal = Number(raw.goal ?? DEFAULT_MONTHLY_CALORIE_TARGET.goal);
    const maintenance = Number(raw.maintenance ?? goal + 300);

    return {
      goal,
      maintenance: Math.max(maintenance, goal),
    };
  }

  return DEFAULT_MONTHLY_CALORIE_TARGET;
};

const normalizeLegacyAppData = (raw: unknown): AppData | null => {
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

  const currentMonthKey = formatMonthKey(new Date().getFullYear(), new Date().getMonth());
  const monthlyCalorieTargets =
    source.monthlyCalorieTargets && typeof source.monthlyCalorieTargets === "object"
      ? Object.entries(source.monthlyCalorieTargets as Record<string, unknown>).reduce<Record<string, MonthlyCalorieTarget>>((accumulator, [key, value]) => {
          accumulator[key] = normalizeTarget(value);
          return accumulator;
        }, {})
      : source.monthlyCalorieGoals && typeof source.monthlyCalorieGoals === "object"
        ? Object.entries(source.monthlyCalorieGoals as Record<string, unknown>).reduce<Record<string, MonthlyCalorieTarget>>((accumulator, [key, value]) => {
            accumulator[key] = normalizeTarget(value);
            return accumulator;
          }, {})
        : { [currentMonthKey]: normalizeTarget(Number(source.dailyCalorieGoal ?? DEFAULT_MONTHLY_CALORIE_TARGET.goal)) };

  return {
    categories: categories as AppData["categories"],
    ingredients: normalizedIngredients,
    variants: ensuredVariants,
    recipes: recipes.map((recipe) => normalizeRecipe(recipe as Record<string, unknown>)),
    journalEntries: journalEntries
      .map((entry) => normalizeJournalEntry(entry as Record<string, unknown>))
      .filter((entry): entry is JournalEntry => Boolean(entry)),
    monthlyCalorieTargets,
  };
};

export const loadLegacyLocalStorageData = (): AppData | null => {
  try {
    const raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return normalizeLegacyAppData(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const clearLegacyLocalStorageData = () => {
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
};
