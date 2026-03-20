import { IngredientVariant, JournalEntry, Recipe, RecipeIngredient } from "../types/models";
import { convertToBaseUnit } from "./unitConversion";

export const calculateRecipeIngredientCalories = (
  item: RecipeIngredient,
  variants: IngredientVariant[],
) => {
  const variant = variants.find((candidate) => candidate.id === item.variantId);
  if (!variant || item.cantidad === "" || Number(item.cantidad) <= 0) {
    return { total: 0, warning: "" };
  }

  const convertedAmount = convertToBaseUnit(Number(item.cantidad), item.unidad, variant.unidadBase);

  if (convertedAmount === null) {
    return {
      total: 0,
      warning: `No se puede convertir ${item.unidad} a ${variant.unidadBase}.`,
    };
  }

  return {
    total: (variant.calorias * convertedAmount) / variant.cantidadBase,
    warning: "",
  };
};

export const calculateRecipeCalories = (recipe: Recipe, variants: IngredientVariant[]) =>
  recipe.ingredientes.reduce(
    (accumulator, item) => accumulator + calculateRecipeIngredientCalories(item, variants).total,
    0,
  );

export const calculateJournalEntryCalories = (
  entry: JournalEntry,
  variants: IngredientVariant[],
) => {
  if (entry.tipo === "ingrediente") {
    return calculateRecipeIngredientCalories(entry.item, variants).total;
  }

  return calculateRecipeCalories(entry.recipe, variants);
};
