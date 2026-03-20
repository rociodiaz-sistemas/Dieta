import Dexie, { Table } from "dexie";
import {
  CategoryNode,
  IngredientNode,
  IngredientVariant,
  JournalEntry,
  Recipe,
} from "../types/models";

export interface AppSettingRecord<T = unknown> {
  key: string;
  value: T;
}

class DietaDatabase extends Dexie {
  categories!: Table<CategoryNode, string>;
  ingredients!: Table<IngredientNode, string>;
  variants!: Table<IngredientVariant, string>;
  recipes!: Table<Recipe, string>;
  journalEntries!: Table<JournalEntry, string>;
  settings!: Table<AppSettingRecord, string>;

  constructor() {
    super("dieta-app-db");

    this.version(1).stores({
      categories: "id,parentId,nombre",
      ingredients: "id,parentId,nombre",
      variants: "id,ingredientId,marca",
      recipes: "id,nombre",
      journalEntries: "id,fecha,tipo,recipeId",
      settings: "key",
    });
  }
}

export const appDb = new DietaDatabase();
