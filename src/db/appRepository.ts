import { AppData, MonthlyCalorieTarget } from "../types/models";
import { DEFAULT_MONTHLY_CALORIE_TARGET, INITIAL_DATA } from "../utils/constants";
import { appDb, AppSettingRecord } from "./appDb";
import { clearLegacyLocalStorageData, loadLegacyLocalStorageData } from "./legacyLocalStorage";

const MONTHLY_TARGETS_KEY = "monthlyCalorieTargets";
const LEGACY_MONTHLY_GOALS_KEY = "monthlyCalorieGoals";

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

const readMonthlyTargets = async () => {
  const [targetsRecord, legacyGoalsRecord] = await Promise.all([
    appDb.settings.get(MONTHLY_TARGETS_KEY) as Promise<
      AppSettingRecord<Record<string, MonthlyCalorieTarget>> | undefined
    >,
    appDb.settings.get(LEGACY_MONTHLY_GOALS_KEY) as Promise<
      AppSettingRecord<Record<string, number>> | undefined
    >,
  ]);

  if (targetsRecord?.value) {
    return Object.entries(targetsRecord.value).reduce<Record<string, MonthlyCalorieTarget>>(
      (accumulator, [key, value]) => {
        accumulator[key] = normalizeTarget(value);
        return accumulator;
      },
      {},
    );
  }

  if (legacyGoalsRecord?.value) {
    return Object.entries(legacyGoalsRecord.value).reduce<Record<string, MonthlyCalorieTarget>>(
      (accumulator, [key, value]) => {
        accumulator[key] = normalizeTarget(value);
        return accumulator;
      },
      {},
    );
  }

  return {};
};

const readAppDataFromDb = async (): Promise<AppData> => {
  const [categories, ingredients, variants, recipes, journalEntries, monthlyCalorieTargets] =
    await Promise.all([
      appDb.categories.toArray(),
      appDb.ingredients.toArray(),
      appDb.variants.toArray(),
      appDb.recipes.toArray(),
      appDb.journalEntries.toArray(),
      readMonthlyTargets(),
    ]);

  return {
    categories,
    ingredients,
    variants,
    recipes,
    journalEntries,
    monthlyCalorieTargets,
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
    Object.keys(data.monthlyCalorieTargets).length === 0;

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
        appDb.settings.clear(),
      ]);

      await Promise.all([
        appDb.categories.bulkPut(data.categories),
        appDb.ingredients.bulkPut(data.ingredients),
        appDb.variants.bulkPut(data.variants),
        appDb.recipes.bulkPut(data.recipes),
        appDb.journalEntries.bulkPut(data.journalEntries),
        appDb.settings.put({
          key: MONTHLY_TARGETS_KEY,
          value: data.monthlyCalorieTargets,
        }),
      ]);
    },
  );
};
