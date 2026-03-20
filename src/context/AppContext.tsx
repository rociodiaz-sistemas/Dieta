import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import {
  AppData,
  CategoryNode,
  IngredientFormValues,
  IngredientNode,
  Recipe,
  RecipeIngredient,
} from "../types/models";
import { INITIAL_DATA, UNIT_OPTIONS } from "../utils/constants";
import { createId } from "../utils/id";
import { loadAppData, saveAppData } from "../utils/storage";
import { collectCategoryAndDescendants } from "../utils/tree";

interface AppContextValue extends AppData {
  unitOptions: string[];
  addCategory: (parentId: string | null, nombre: string) => void;
  updateCategory: (id: string, nombre: string) => void;
  deleteCategory: (id: string) => void;
  addIngredient: (parentId: string, values: IngredientFormValues) => void;
  updateIngredient: (id: string, values: IngredientFormValues) => void;
  deleteIngredient: (id: string) => void;
  saveRecipe: (recipe: Recipe) => void;
  deleteRecipe: (id: string) => void;
  createEmptyRecipeIngredient: () => RecipeIngredient;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(() => loadAppData() ?? INITIAL_DATA);

  useEffect(() => {
    saveAppData(data);
  }, [data]);

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
          const nextCategories = current.categories.filter(
            (category) => !removableCategoryIds.includes(category.id),
          );
          const removedIngredientIds = current.ingredients
            .filter((ingredient) => removableCategoryIds.includes(ingredient.parentId))
            .map((ingredient) => ingredient.id);
          const nextIngredients = current.ingredients.filter(
            (ingredient) => !removedIngredientIds.includes(ingredient.id),
          );
          const nextRecipes = current.recipes.map((recipe) => ({
            ...recipe,
            ingredientes: recipe.ingredientes.map((recipeIngredient) =>
              removedIngredientIds.includes(recipeIngredient.ingredientId ?? "")
                ? { ...recipeIngredient, ingredientId: null, path: [] }
                : recipeIngredient,
            ),
          }));

          return {
            categories: nextCategories,
            ingredients: nextIngredients,
            recipes: nextRecipes,
          };
        });
      },
      addIngredient: (parentId, values) => {
        const nextIngredient: IngredientNode = {
          id: createId(),
          parentId,
          tipo: "ingrediente",
          nombre: values.nombre.trim(),
          calorias: Number(values.calorias),
          unidadBase: values.unidadBase,
          cantidadBase: Number(values.cantidadBase),
          notas: values.notas.trim() || undefined,
        };

        setData((current) => ({
          ...current,
          ingredients: [...current.ingredients, nextIngredient],
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
                  calorias: Number(values.calorias),
                  unidadBase: values.unidadBase,
                  cantidadBase: Number(values.cantidadBase),
                  notas: values.notas.trim() || undefined,
                }
              : ingredient,
          ),
        }));
      },
      deleteIngredient: (id) => {
        setData((current) => ({
          ...current,
          ingredients: current.ingredients.filter((ingredient) => ingredient.id !== id),
          recipes: current.recipes.map((recipe) => ({
            ...recipe,
            ingredientes: recipe.ingredientes.map((recipeIngredient) =>
              recipeIngredient.ingredientId === id
                ? { ...recipeIngredient, ingredientId: null, path: [] }
                : recipeIngredient,
            ),
          })),
        }));
      },
      saveRecipe: (recipe) => {
        setData((current) => {
          const exists = current.recipes.some((item) => item.id === recipe.id);
          return {
            ...current,
            recipes: exists
              ? current.recipes.map((item) => (item.id === recipe.id ? recipe : item))
              : [...current.recipes, recipe],
          };
        });
      },
      deleteRecipe: (id) => {
        setData((current) => ({
          ...current,
          recipes: current.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      createEmptyRecipeIngredient: () => ({
        id: createId(),
        ingredientId: null,
        path: [],
        cantidad: "",
        unidad: "g",
      }),
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
