import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type Language = "en" | "mk";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    "auth.login": "Login",
    "auth.register": "Register",
    "auth.name": "Full Name",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.signInWithGoogle": "Continue with Google",
    "auth.welcomeBack": "Welcome Back",
    "auth.getStarted": "Get Started",
    "auth.tagline": "Smart soil analysis for sustainable farming",

    // Dashboard
    "dashboard.title": "Soil Analysis History",
    "dashboard.newAnalysis": "New Analysis",
    "dashboard.noAnalyses": "No analyses yet",
    "dashboard.getStarted":
      "Start your first soil analysis to get personalized plant recommendations",
    "dashboard.location": "Location",
    "dashboard.date": "Date",
    "dashboard.depth": "Depth",
    "dashboard.recommendations": "Top Recommendations",

    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.soils": "My Soils",
    "nav.assistant": "AI Assistant",
    "nav.settings": "Settings",
    "nav.logout": "Logout",

    // New Analysis
    "analysis.new.title": "New Soil Analysis",
    "analysis.new.step1": "Location",
    "analysis.new.step2": "Soil Info",
    "analysis.new.step3": "Depth",
    "analysis.new.step4": "Analyze",
    "analysis.new.searchLocation": "Search for city or location",
    "analysis.new.orCoordinates": "Or enter GPS coordinates",
    "analysis.new.latitude": "Latitude",
    "analysis.new.longitude": "Longitude",
    "analysis.new.soilName": "Soil Name",
    "analysis.new.description": "Description (optional)",
    "analysis.new.selectDepth": "Select soil depth layer",
    "analysis.new.startAnalysis": "Start Analysis",
    "analysis.new.analyzing": "Analyzing soil data...",
    "analysis.new.next": "Next",
    "analysis.new.previous": "Previous",

    // Analysis Details
    "analysis.details.soilParameters": "Soil Parameters",
    "analysis.details.weatherData": "Weather Data",
    "analysis.details.plantRecommendations": "Plant Recommendations",
    "analysis.details.compatibility": "Compatibility",
    "analysis.details.downloadPDF": "Download PDF Report",
    "analysis.details.delete": "Delete Analysis",
    "analysis.details.disclaimer":
      "These recommendations are advisory only. Please consult with an agronomist for critical farming decisions.",
    "analysis.details.ph": "pH Level",
    "analysis.details.texture": "Soil Texture",
    "analysis.details.carbon": "Organic Carbon",
    "analysis.details.nitrogen": "Nitrogen",
    "analysis.details.bulkDensity": "Bulk Density",
    "analysis.details.cec": "CEC",
    "analysis.details.moisture": "Moisture",
    "analysis.details.temperature": "Temperature",
    "analysis.details.rainfall": "Rainfall",

    // Soils
    "soils.title": "Soil Management",
    "soils.add": "Add Soil",
    "soils.edit": "Edit",
    "soils.delete": "Delete",
    "soils.analyze": "Analyze",
    "soils.noSoils": "No saved soils",
    "soils.addFirst": "Add your first soil to get started",

    // Chatbot
    "chat.title": "AI Assistant",
    "chat.placeholder": "Ask about your soil analysis...",
    "chat.send": "Send",
    "chat.thinking": "Thinking...",

    // Common
    "common.loading": "Loading...",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.confirm": "Confirm",
  },
  mk: {
    // Auth
    "auth.login": "Најава",
    "auth.register": "Регистрација",
    "auth.name": "Име и презиме",
    "auth.email": "Email",
    "auth.password": "Лозинка",
    "auth.signInWithGoogle": "Продолжи со Google",
    "auth.welcomeBack": "Добредојдовте назад",
    "auth.getStarted": "Започнете",
    "auth.tagline": "Паметна анализа на почва за одржливо земјоделство",

    // Dashboard
    "dashboard.title": "Историја на анализи",
    "dashboard.newAnalysis": "Нова анализа",
    "dashboard.noAnalyses": "Сеуште нема анализи",
    "dashboard.getStarted":
      "Започнете ја вашата прва анализа на почва за да добиете персонализирани препораки за растенија",
    "dashboard.location": "Локација",
    "dashboard.date": "Датум",
    "dashboard.depth": "Длабочина",
    "dashboard.recommendations": "Најдобри препораки",

    // Navigation
    "nav.dashboard": "Контролна табла",
    "nav.soils": "Мои почви",
    "nav.assistant": "AI Асистент",
    "nav.settings": "Поставки",
    "nav.logout": "Одјава",

    // New Analysis
    "analysis.new.title": "Нова анализа на почва",
    "analysis.new.step1": "Локација",
    "analysis.new.step2": "Инфо за почва",
    "analysis.new.step3": "Длабочина",
    "analysis.new.step4": "Анализа",
    "analysis.new.searchLocation": "Пребарај град или локација",
    "analysis.new.orCoordinates": "Или внеси GPS координати",
    "analysis.new.latitude": "Географска ширина",
    "analysis.new.longitude": "Географска должина",
    "analysis.new.soilName": "Име на почва",
    "analysis.new.description": "Опис (опционално)",
    "analysis.new.selectDepth": "Избери слој на длабочина",
    "analysis.new.startAnalysis": "Започни анализа",
    "analysis.new.analyzing": "Анализирам податоци за почвата...",
    "analysis.new.next": "Следно",
    "analysis.new.previous": "Претходно",

    // Analysis Details
    "analysis.details.soilParameters": "Параметри на почвата",
    "analysis.details.weatherData": "Временски податоци",
    "analysis.details.plantRecommendations": "Препораки за растенија",
    "analysis.details.compatibility": "Компатибилност",
    "analysis.details.downloadPDF": "Преземи PDF извештај",
    "analysis.details.delete": "Избриши анализа",
    "analysis.details.disclaimer":
      "Овие препораки се само советодавни. Ве молиме консултирајте се со агроном за критични земјоделски одлуки.",
    "analysis.details.ph": "pH ниво",
    "analysis.details.texture": "Текстура на почва",
    "analysis.details.carbon": "Органски јаглерод",
    "analysis.details.nitrogen": "Азот",
    "analysis.details.bulkDensity": "Густина",
    "analysis.details.cec": "CEC",
    "analysis.details.moisture": "Влажност",
    "analysis.details.temperature": "Температура",
    "analysis.details.rainfall": "Врнежи",

    // Soils
    "soils.title": "Управување со почви",
    "soils.add": "Додај почва",
    "soils.edit": "Уреди",
    "soils.delete": "Избриши",
    "soils.analyze": "Анализирај",
    "soils.noSoils": "Нема зачувани почви",
    "soils.addFirst": "Додајте ја вашата прва почва за да започнете",

    // Chatbot
    "chat.title": "AI Асистент",
    "chat.placeholder": "Прашај за твојата анализа на почва...",
    "chat.send": "Испрати",
    "chat.thinking": "Размислувам...",

    // Common
    "common.loading": "Вчитување...",
    "common.cancel": "Откажи",
    "common.save": "Зачувај",
    "common.confirm": "Потврди",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
