import { useMemo } from "react";
import { mk, enGB } from "date-fns/locale";
import { format } from "date-fns";
import { useLanguage } from "@/providers/language-provider";
import type { Language } from "@/providers/language-provider";

export function useFormatters() {
  const { language: currentLanguage } = useLanguage();

  return useMemo(() => {
    const dateFormatter = getDateFormatter(currentLanguage);
    const timeFormatter = getTimeFormatter(currentLanguage);
    const locale = currentLanguage == "mk" ? mk : enGB;

    return {
      /**
       * Formats a date into a localized date string (DD/MM/YYYY)
       *
       * Examples:
       * - English: 31/12/2024
       * - Macedonian: 31/12/2024
       */
      date(date: string | Date) {
        return dateFormatter.format(new Date(date));
      },

      /**
       * Formats a date into a localized date and time string (DD/MM/YYYY HH:MM)
       */
      dateTime(date: string | Date) {
        return format(new Date(date), "dd/MM/yyyy HH:mm", { locale });
      },

      /**
       * Formats a date into a day-month string using abbreviated weekday and full month
       *
       * Examples:
       * - English: Mon 01 January
       * - Macedonian: Пон 01 Јануари
       */
      dateDayMonth: (date: string | Date) => {
        return format(new Date(date), "EEE dd MMMM", { locale });
      },

      /**
       * Formats a date into a localized short time string (HH:MM)
       *
       * Examples:
       * - English: 14:30
       * - Macedonian: 14:30
       */
      timeShort(date: string | Date) {
        return timeFormatter.format(new Date(date));
      },
    };
  }, [currentLanguage]);
}

// Custom formatters
function getDateFormatter(languageCode: Language) {
  const locale = languageCode === "mk" ? "mk" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getTimeFormatter(languageCode: Language) {
  const locale = languageCode === "mk" ? "mk" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
