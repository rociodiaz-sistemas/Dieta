import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  AppData,
  CategoryNode,
  IngredientEditValues,
  IngredientFormValues,
  IngredientNode,
  IngredientVariant,
  Recipe,
  RecipeIngredient,
  VariantFormValues,
} from "../types/models";
import { DEFAULT_VARIANT_NAME, INITIAL_DATA, UNIT_OPTIONS } from "../utils/constants";
import { createId } from "../utils/id";
import { loadAppData, saveAppData } from "../utils/storage";
import { collectCategoryAndDescendants } from "../utils/tree";

interface AppContextValue extends AppData {
  unitOptions: string[];
  addCategory: (parentId: string | null, nombre: string) => void;
  updateCategory: (id: string, nombre: string) => void;
  deleteCategory: (id: string) => void;
  addIngredient: (parentId: string, values: IngredientFormValues) => void;
  updateIngredient: (id: string, values: IngredientEditValues) => void;
  deleteIngredient: (id: string) => void;
  addVariant: (ingredientId: string, values: VariantFormValues) => void;
  updateVariant: (id: string, values: VariantFormValues) => void;
  deleteVariant: (id: string) => void;
  saveRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  addJournalIngredientEntry: (date: string) => void;
  addJournalRecipeEntry: (date: string, recipeId: string) => void;
  updateJournalIngredientEntry: (entryId: string, item: RecipeIngredient) => void;
  updateJournalRecipeEntry: (entryId: string, recipe: Recipe) => void;
  deleteJournalEntry: (entryId: string) => void;
  setMonthlyCalorieGoal: (monthKey: string, goal: number) => void;
  createEmptyRecipeIngredient: () => RecipeIngredient;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const cloneRecipe = (recipe: Recipe): Recipe => ({
  id: createId(),
  nombre: recipe.nombre,
  ingredientes: recipe.ingredientes.map((item) => ({
    ...item,
    id: createId(),
    path: [...item.path],
  })),
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(() => loadAppData() ?? INITIAL_DATA);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const createEmptyRecipeIngredient = () => ({
    id: createId(),
    ingredientId: null,
    variantId: null,
    path: [],
    cantidad: "" as const,
    unidad: "g",
  });

  const value = useMemo<AppContextValue>(
    () => ({
      ...data,
      unitOptions: UNIT_OPTIONS,
      addCategory: (parentId, nombre) => {
        const nextCategory: CategoryNode = {
          id: createId(),
          nombre,
          parentId,
          tipo: "categoria",
        };

        setData((current) => ({
          ...current,
          categories: [...current.categories, nextCategory],
        }));
      },
      updateCategory: (id, nombre) => {
        setData((current) => ({
          ...current,
          categories: current.categories.map((category) =>
            category.id === id ? { ...category, nombre } : category,
          ),
        }));
      },
      deleteCategory: (id) => {
        setData((current) => {
          const removableCategoryIds = collectCategoryAndDescendants(current.categories, id);
          const removedIngredientIds = current.ingredients
            .filter((ingredient) => removableCategoryIds.includes(ingredient.parentId))
            .map((ingredient) => ingredient.id);
          const removedVariantIds = current.variants
            .filter((variant) => removedIngredientIds.includes(variant.ingredientId))
            .map((variant) => variant.id);

          return {
            categories: current.categories.filter((category) => !removableCategoryIds.includes(category.id)),
            ingredients: current.ingredients.filter((ingredient) => !removedIngredientIds.includes(ingredient.id)),
            variants: current.variants.filter((variant) => !removedVariantIds.includes(variant.id)),
            recipes: current.recipes.map((recipe) => ({
              ...recipe,
              ingredientes: recipe.ingredientes.map((recipeIngredient) =>
                removedIngredientIds.includes(recipeIngredient.ingredientId ?? "")
                  ? { ...recipeIngredient, ingredientId: null, variantId: null, path: [] }
                  : recipeIngredient,
              ),
            })),
            journalEntries: current.journalEntries.map((entry) => {
              if (entry.tipo === "ingrediente") {
                return removedIngredientIds.includes(entry.item.ingredientId ?? "")
                  ? { ...entry, item: { ...entry.item, ingredientId: null, variantId: null, path: [] } }
                  : entry;
              }

              return {
                ...entry,
                recipe: {
                  ...entry.recipe,
                  ingredientes: entry.recipe.ingredientes.map((recipeIngredient) =>
                    removedIngredientIds.includes(recipeIngredient.ingredientId ?? "")
                      ? { ...recipeIngredient, ingredientId: null, variantId: null, path: [] }
                      : recipeIngredient,
                  ),
                },
              };
            }),
            monthlyCalorieGoals: current.monthlyCalorieGoals,
          };
        });
      },
      addIngredient: (parentId, values) => {
        const ingredientId = createId();
        const nextIngredient: IngredientNode = {
          id: ingredientId,
          parentId,
          tipo: "ingrediente",
          nombre: values.nombre.trim(),
          notas: values.notas.trim() || undefined,
        };
        const nextVariant: IngredientVariant = {
          id: createId(),
          ingredientId,
          marca: DEFAULT_VARIANT_NAME,
          calorias: Number(values.calorias),
          unidadBase: values.unidadBase,
          cantidadBase: Number(values.cantidadBase),
        };

        setData((current) => ({
          ...current,
          ingredients: [...current.ingredients, nextIngredient],
          variants: [...current.variants, nextVariant],
        }));
      },
      updateIngredient: (id, values) => {
        setData((current) => ({
          ...current,
          ingredients: current.ingredients.map((ingredient) =>
            ingredient.id === id
              ? {
                  ...ingredient,
                  nombre: values.nombre.trim(),
                  notas: values.notas.trim() || undefined,
                }
              : ingredient,
          ),
        }));
      },
      deleteIngredient: (id) => {
        setData((current) => {
          const removedVariantIds = current.variants
            .filter((variant) => variant.ingredientId === id)
            .map((variant) => variant.id);

          return {
            ...current,
            ingredients: current.ingredients.filter((ingredient) => ingredient.id !== id),
            variants: current.variants.filter((variant) => variant.ingredientId !== id),
            recipes: current.recipes.map((recipe) => ({
              ...recipe,
              ingredientes: recipe.ingredientes.map((recipeIngredient) =>
                recipeIngredient.ingredientId === id || removedVariantIds.includes(recipeIngredient.variantId ?? "")
                  ? { ...recipeIngredient, ingredientId: null, variantId: null, path: [] }
                  : recipeIngredient,
              ),
            })),
            journalEntries: current.journalEntries.map((entry) => {
              if (entry.tipo === "ingrediente") {
                return entry.item.ingredientId === id || removedVariantIds.includes(entry.item.variantId ?? "")
                  ? { ...entry, item: { ...entry.item, ingredientId: null, variantId: null, path: [] } }
                  : entry;
              }

              return {
                ...entry,
                recipe: {
                  ...entry.recipe,
                  ingredientes: entry.recipe.ingredientes.map((recipeIngredient) =>
                    recipeIngredient.ingredientId === id || removedVariantIds.includes(recipeIngredient.variantId ?? "")
                      ? { ...recipeIngredient, ingredientId: null, variantId: null, path: [] }
                      : recipeIngredient,
                  ),
                },
              };
            }),
          };
        });
      },
      addVariant: (ingredientId, values) => {
        const nextVariant: IngredientVariant = {
          id: createId(),
          ingredientId,
          marca: values.marca.trim(),
          calorias: Number(values.calorias),
          unidadBase: values.unidadBase,
          cantidadBase: Number(values.cantidadBase),
        };

        setData((current) => ({
          ...current,
          variants: [...current.variants, nextVariant],
        }));
      },
      updateVariant: (id, values) => {
        setData((current) => ({
          ...current,
          variants: current.variants.map((variant) =>
            variant.id === id
              ? {
                  ...variant,
                  marca: values.marca.trim(),
                  calorias: Number(values.calorias),
                  unidadBase: values.unidadBase,
                  cantidadBase: Number(values.cantidadBase),
                }
              : variant,
          ),
        }));
      },
      deleteVariant: (id) => {
        setData((current) => {
          const target = current.variants.find((variant) => variant.id === id);
          if (!target) {
            return current;
          }

          const variantsForIngredient = current.variants.filter((variant) => variant.ingredientId === target.ingredientId);
          if (variantsForIngredient.length <= 1) {
            return current;
          }

          return {
            ...current,
            variants: current.variants.filter((variant) => variant.id !== id),
            recipes: current.recipes.map((recipe) => ({
              ...recipe,
              ingredientes: recipe.ingredientes.map((recipeIngredient) =>
                recipeIngredient.variantId === id ? { ...recipeIngredient, variantId: null } : recipeIngredient,
              ),
            })),
            journalEntries: current.journalEntries.map((entry) => {
              if (entry.tipo === "ingrediente") {
                return entry.item.variantId === id ? { ...entry, item: { ...entry.item, variantId: null } } : entry;
              }

              return {
                ...entry,
                recipe: {
                  ...entry.recipe,
                  ingredientes: entry.recipe.ingredientes.map((recipeIngredient) =>
                    recipeIngredient.variantId === id ? { ...recipeIngredient, variantId: null } : recipeIngredient,
                  ),
                },
              };
            }),
          };
        });
      },
      saveRecipe: (recipe) => {
        setData((current) => {
          const exists = current.recipes.some((item) => item.id === recipe.id);
          return {
            ...current,
            recipes: exists ? current.recipes.map((item) => (item.id === recipe.id ? recipe : item)) : [...current.recipes, recipe],
          };
        });
      },
      deleteRecipe: (id) => {
        setData((current) => ({
          ...current,
          recipes: current.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      addJournalIngredientEntry: (date) => {
        setData((current) => ({
          ...current,
          journalEntries: [
            ...current.journalEntries,
            {
              id: createId(),
              tipo: "ingrediente",
              fecha: date,
              item: createEmptyRecipeIngredient(),
            },
          ],
        }));
      },
      addJournalRecipeEntry: (date, recipeId) => {
        setData((current) => {
          const baseRecipe = current.recipes.find((recipe) => recipe.id === recipeId);
          if (!baseRecipe) {
            return current;
          }

          return {
            ...current,
            journalEntries: [
              ...current.journalEntries,
              {
                id: createId(),
                tipo: "receta",
                fecha: date,
                recipeId,
                recipe: cloneRecipe(baseRecipe),
              },
            ],
          };
        });
      },
      updateJournalIngredientEntry: (entryId, item) => {
        setData((current) => ({
          ...current,
          journalEntries: current.journalEntries.map((entry) =>
            entry.id === entryId && entry.tipo === "ingrediente" ? { ...entry, item } : entry,
          ),
        }));
      },
      updateJournalRecipeEntry: (entryId, recipe) => {
        setData((current) => ({
          ...current,
          journalEntries: current.journalEntries.map((entry) =>
            entry.id === entryId && entry.tipo === "receta" ? { ...entry, recipe } : entry,
          ),
        }));
      },
      deleteJournalEntry: (entryId) => {
        setData((current) => ({
          ...current,
          journalEntries: current.journalEntries.filter((entry) => entry.id !== entryId),
        }));
      },
      setMonthlyCalorieGoal: (monthKey, goal) => {
        setData((current) => ({
          ...current,
          monthlyCalorieGoals: {
            ...current.monthlyCalorieGoals,
            [monthKey]: goal,
          },
        }));
      },
      createEmptyRecipeIngredient,
    }),
    [data],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }

  return context;
};
