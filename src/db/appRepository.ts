import { AppData } from "../types/models";
import { INITIAL_DATA } from "../utils/constants";
import { appDb, AppSettingRecord } from "./appDb";
import { clearLegacyLocalStorageData, loadLegacyLocalStorageData } from "./legacyLocalStorage";

const MONTHLY_GOALS_KEY = "monthlyCalorieGoals";

const hasIndexedDbData = async () => {
  const counts = await Promise.all([
    appDb.categories.count(),
    appDb.ingredients.count(),
    appDb.variants.count(),
    appDb.recipes.count(),
    appDb.journalEntries.count(),
    appDb.settings.count(),
  ]);

  return counts.some((count) => count > 0);
};

const readAppDataFromDb = async (): Promise<AppData> => {
  const [categories, ingredients, variants, recipes, journalEntries, monthlyGoalsRecord] =
    await Promise.all([
      appDb.categories.toArray(),
      appDb.ingredients.toArray(),
      appDb.variants.toArray(),
      appDb.recipes.toArray(),
      appDb.journalEntries.toArray(),
      appDb.settings.get(MONTHLY_GOALS_KEY) as Promise<
        AppSettingRecord<Record<string, number>> | undefined
      >,
    ]);

  return {
    categories,
    ingredients,
    variants,
    recipes,
    journalEntries,
    monthlyCalorieGoals: monthlyGoalsRecord?.value ?? {},
  };
};

export const loadAppData = async (): Promise<AppData> => {
  const dbHasData = await hasIndexedDbData();

  if (!dbHasData) {
    const legacyData = loadLegacyLocalStorageData();
    if (legacyData) {
      await saveAppData(legacyData);
      clearLegacyLocalStorageData();
      return legacyData;
    }

    return INITIAL_DATA;
  }

  const data = await readAppDataFromDb();
  const isEmpty =
    data.categories.length === 0 &&
    data.ingredients.length === 0 &&
    data.variants.length === 0 &&
    data.recipes.length === 0 &&
    data.journalEntries.length === 0 &&
    Object.keys(data.monthlyCalorieGoals).length === 0;

  return isEmpty ? INITIAL_DATA : data;
};

export const saveAppData = async (data: AppData) => {
  await appDb.transaction(
    "rw",
    [
      appDb.categories,
      appDb.ingredients,
      appDb.variants,
      appDb.recipes,
      appDb.journalEntries,
      appDb.settings,
    ],
    async () => {
      await Promise.all([
        appDb.categories.clear(),
        appDb.ingredients.clear(),
        appDb.variants.clear(),
        appDb.recipes.clear(),
        appDb.journalEntries.clear(),
      ]);

      await Promise.all([
        appDb.categories.bulkPut(data.categories),
        appDb.ingredients.bulkPut(data.ingredients),
        appDb.variants.bulkPut(data.variants),
        appDb.recipes.bulkPut(data.recipes),
        appDb.journalEntries.bulkPut(data.journalEntries),
        appDb.settings.put({
          key: MONTHLY_GOALS_KEY,
          value: data.monthlyCalorieGoals,
        }),
      ]);
    },
  );
};
