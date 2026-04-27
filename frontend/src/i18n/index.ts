import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { defaultNS, resources } from "./resources";
import type { AppLanguage } from "./resources";

const supportedLanguages = Object.keys(resources) as AppLanguage[];

export function isValidLanguageCode(code?: string): code is AppLanguage {
  if (!code) return false;
  return supportedLanguages.includes(code as AppLanguage);
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
export type { AppLanguage };
