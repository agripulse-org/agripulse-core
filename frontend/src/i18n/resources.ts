import en from "./locales/en/translation.json";
import mk from "./locales/mk/translation.json";

export const defaultNS = "translation";

export const resources = {
  en: {
    translation: en,
  },
  mk: {
    translation: mk,
  },
} as const;

export type AppLanguage = keyof typeof resources;
