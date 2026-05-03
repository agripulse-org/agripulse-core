import { useMemo } from "react";
import { mk, enGB } from "date-fns/locale";
import { format, formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { isValidLanguageCode } from "@/i18n";
import type { AppLanguage } from "@/i18n";

export function useFormatters() {
  const { i18n } = useTranslation();

  const currentLanguage: AppLanguage = isValidLanguageCode(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : "en";

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

      /**
       * Formats a date as a relative time string for recent dates, falling back to
       * an absolute date for dates older than 7 days.
       *
       * Examples:
       * - English: "less than a minute ago", "5 minutes ago", "about 3 hours ago", "2 days ago"
       * - Macedonian: localized equivalents via date-fns mk locale
       */
      relativeTime(date: string | Date) {
        const d = new Date(date);
        const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
        if (diffDays >= 7) return dateFormatter.format(d);
        return formatDistanceToNow(d, { addSuffix: true, locale });
      },
    };
  }, [currentLanguage]);
}

// Custom formatters
function getDateFormatter(languageCode: AppLanguage) {
  const locale = languageCode === "mk" ? "mk" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getTimeFormatter(languageCode: AppLanguage) {
  const locale = languageCode === "mk" ? "mk" : "en-GB";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}
