import { AppData } from "../types/models";

const STORAGE_KEY = "dieta-app-data";

export const loadAppData = (): AppData | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as AppData;
  } catch {
    return null;
  }
};

export const saveAppData = (data: AppData) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
