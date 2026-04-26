import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

export type Language = "en" | "mk";

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
    "auth.signInWithApple": "Continue with Apple",
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
    "nav.notes": "Notes",
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
    "soils.never": "Never",
    "soils.lastAnalysis": "Last Analysis",
    "soils.coordinates": "Coordinates",
    "soils.newProfileTitle": "New Soil Profile",
    "soils.editProfileTitle": "Edit Soil Profile",
    "soils.stepLocation": "Location",
    "soils.stepLocationDescription": "Choose a place on the map or search for an address.",
    "soils.stepDetails": "Soil Info",
    "soils.stepDetailsDescription": "Give the profile a name and add a short description.",
    "soils.name": "Soil Name",
    "soils.description": "Description",
    "soils.descriptionPlaceholder": "Add notes about this soil profile...",
    "soils.location": "Location",
    "soils.unknownLocation": "Unknown location",
    "soils.latitude": "Latitude",
    "soils.longitude": "Longitude",
    "soils.searchPlaceholder": "Search an address or place",
    "soils.search": "Search",
    "soils.manageDescription": "Manage your saved soil locations and samples",
    "soils.mapHelpTitle": "Map selection",
    "soils.mapHelpDescription":
      "Search by address, click the map, or fine-tune the coordinates manually.",
    "soils.summaryTitle": "Summary",
    "soils.next": "Next",
    "soils.back": "Back",
    "soils.create": "Create Soil Profile",
    "soils.update": "Update Soil Profile",
    "soils.deleteConfirmTitle": "Delete Soil Profile",
    "soils.deleteConfirmDescription":
      'Are you sure you want to delete the soil profile "{name}"? This action cannot be undone.',
    "soils.deleteSuccess": "Soil profile deleted successfully",
    "soils.createSuccess": "Soil profile created successfully",
    "soils.updateSuccess": "Soil profile updated successfully",
    "soils.details.backToSoils": "Back to Soils",
    "soils.details.editSoil": "Edit Soil",
    "soils.details.created": "Created",
    "soils.details.notFoundTitle": "Soil not found",
    "soils.details.notFoundDescription":
      "This soil profile does not exist or you do not have access to it.",
    "soils.details.tabs.overview": "Overview",
    "soils.details.tabs.analyses": "Analyses",
    "soils.details.tabs.notes": "Notes",
    "soils.details.tabs.chat": "AI Sessions",
    "soils.details.totalAnalyses": "Total Analyses",
    "soils.details.recentAnalyses": "Recent Analyses",
    "soils.details.viewAll": "View All",
    "soils.details.allAnalyses": "All Analyses",
    "soils.details.noAnalysesDescription":
      "Create your first analysis to get soil insights and plant recommendations",
    "soils.details.createAnalysis": "Create Analysis",
    "soils.details.analysis.creating": "Creating analysis for depth {depth}...",
    "soils.details.analysis.created": "Analysis created successfully!",
    "soils.details.analysis.autoLoad": "Discover Parameters",
    "soils.details.analysis.autoLoadLabel": "Discover Parameters",
    "soils.details.analysis.autoLoadDescription":
      "Select a depth layer and we'll automatically use the latest soil parameters for this location.",
    "soils.details.chat.title": "AI Chat Sessions",
    "soils.details.chat.subtitle": "View and manage your conversations about this soil",
    "soils.details.chat.newSession": "New Chat Session",
    "soils.details.chat.session": "Chat Session",
    "soils.details.chat.emptyTitle": "No chat sessions",
    "soils.details.chat.emptyDescription":
      "Start a conversation with the AI assistant to get advice about this soil",
    "soils.details.chat.startChat": "Start Chat",
    "soils.details.chat.messages": "messages",
    "soils.details.chat.deleteConfirm": "Delete this chat session?",
    "soils.details.chat.deleted": "Chat session deleted",
    "soils.details.chat.assistantReply":
      "That's a great question! Let me analyze your soil data and provide specific recommendations...",
    "soils.details.import.fromCsv": "Import Parameters",
    "soils.details.import.fromCsvLabel": "Import Parameters",
    "soils.details.import.description":
      "Upload a CSV file with soil parameters. The analysis will be created with your exact data.",
    "soils.details.import.dropCsv": "Drop CSV file here",
    "soils.details.import.orBrowse": "or click to browse",
    "soils.details.import.importing": "Importing soil parameters...",
    "soils.details.import.importingShort": "Importing...",
    "soils.details.import.parametersImported": "Parameters imported! Creating analysis...",
    "soils.details.import.invalidCsv": "Please upload a valid CSV file",
    "soils.details.import.templateDownloaded": "Template downloaded",
    "soils.details.import.requirementsTitle": "CSV Format Requirements",
    "soils.details.import.requirement.depth": 'Include depth column (e.g., "0-5 cm", "5-15 cm")',
    "soils.details.import.requirement.required": "Required: pH, Texture, Nitrogen, Organic Carbon",
    "soils.details.import.requirement.optional": "Optional: Bulk Density, CEC, Moisture",
    "soils.details.import.requirement.headers": "First row must contain column headers",
    "soils.details.import.downloadTemplate": "Download CSV Template",

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
    "common.delete": "Delete",
    "common.retry": "Try again",
    "common.edit": "Edit",

    "notes.title": "Notes",
    "notes.subtitle": "View and manage notes across all your soils.",
    "notes.new": "New note",
    "notes.edit": "Edit note",
    "notes.searchPlaceholder": "Search notes",
    "notes.filterTag": "Tag",
    "notes.allTags": "All",
    "notes.loadError": "Could not load notes.",
    "notes.emptyTitle": "No notes found",
    "notes.emptyDescription": "Create your first note and attach it to a soil profile.",
    "notes.soil": "Soil profile",
    "notes.soilRequired": "Please select a soil profile.",
    "notes.deleteConfirm": "Delete this note? This cannot be undone.",
    "notes.deleteTitle": "Delete note",
    "notes.deleteDescription":
      'Are you sure you want to delete "{title}"? This action cannot be undone.',
    "notes.deleted": "Note deleted",
    "notes.deleteFailed": "Could not delete the note.",
    "notes.details.created": "Created",
    "notes.details.updated": "Last updated",

    "soils.details.notes.title": "Field notes",
    "soils.details.notes.subtitle":
      "Keep private observations, plans, and reminders for this soil profile.",
    "soils.details.notes.add": "Add note",
    "soils.details.notes.emptyTitle": "No notes yet",
    "soils.details.notes.emptyDescription":
      "Record treatments, sampling notes, or anything you want to remember about this soil.",
    "soils.details.notes.createFirst": "Add your first note",
    "soils.details.notes.edit": "Edit note",
    "soils.details.notes.newTitle": "New note",
    "soils.details.notes.noteTitle": "Title",
    "soils.details.notes.noteDescription": "Description",
    "soils.details.notes.lastUpdated": "Last updated",
    "soils.details.notes.tags": "Tags",
    "soils.details.notes.tagsPlaceholder": "Type a tag and press Enter",
    "soils.details.notes.addTag": "Add",
    "soils.details.notes.removeTag": "Remove tag",
    "soils.details.notes.deleteConfirm": "Delete this note? This cannot be undone.",
    "soils.details.notes.deleted": "Note deleted",
    "soils.details.notes.deleteFailed": "Could not delete the note.",
    "soils.details.notes.loadError": "Could not load notes.",
    "soils.details.notes.titleRequired": "Please enter a title.",
    "soils.details.notes.saveSuccess": "Note updated",
    "soils.details.notes.createSuccess": "Note created",
    "soils.details.notes.saveFailed": "Could not save the note.",
  },
  mk: {
    // Auth
    "auth.login": "Најава",
    "auth.register": "Регистрација",
    "auth.name": "Име и презиме",
    "auth.email": "Email",
    "auth.password": "Лозинка",
    "auth.signInWithGoogle": "Продолжи со Google",
    "auth.signInWithApple": "Продолжи со Apple",
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
    "nav.notes": "Белешки",
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
    "soils.never": "Никогаш",
    "soils.lastAnalysis": "Последна анализа",
    "soils.coordinates": "Координати",
    "soils.newProfileTitle": "Нов профил на почва",
    "soils.editProfileTitle": "Уреди профил на почва",
    "soils.stepLocation": "Локација",
    "soils.stepLocationDescription": "Изберете место на мапата или пребарајте адреса.",
    "soils.stepDetails": "Инфо за почва",
    "soils.stepDetailsDescription": "Дајте име на профилот и додадете краток опис.",
    "soils.name": "Име на почва",
    "soils.description": "Опис",
    "soils.descriptionPlaceholder": "Додадете белешки за овој профил на почва...",
    "soils.location": "Локација",
    "soils.unknownLocation": "Непозната локација",
    "soils.latitude": "Географска ширина",
    "soils.longitude": "Географска должина",
    "soils.searchPlaceholder": "Пребарај адреса или место",
    "soils.search": "Пребарај",
    "soils.manageDescription": "Управувајте со вашите зачувани локации и примероци на почва",
    "soils.mapHelpTitle": "Избор на мапа",
    "soils.mapHelpDescription":
      "Пребарајте по адреса, кликнете на мапата или рачно прецизирајте ги координатите.",
    "soils.summaryTitle": "Резиме",
    "soils.next": "Следно",
    "soils.back": "Назад",
    "soils.create": "Креирај профил на почва",
    "soils.update": "Ажурирај профил на почва",
    "soils.deleteConfirmTitle": "Избриши профил на почва",
    "soils.deleteConfirmDescription":
      'Дали сте сигурни дека сакате да го избришете профилот на почва "{name}"? Ова дејство не може да се врати.',
    "soils.deleteSuccess": "Профилот на почва е избришан успешно",
    "soils.createSuccess": "Профилот на почва е креиран успешно",
    "soils.updateSuccess": "Профилот на почва е ажуриран успешно",
    "soils.details.backToSoils": "Назад кон почви",
    "soils.details.editSoil": "Уреди почва",
    "soils.details.created": "Креирано",
    "soils.details.notFoundTitle": "Почвата не е пронајдена",
    "soils.details.notFoundDescription":
      "Овој профил на почва не постои или немате пристап до него.",
    "soils.details.tabs.overview": "Преглед",
    "soils.details.tabs.analyses": "Анализи",
    "soils.details.tabs.notes": "Белешки",
    "soils.details.tabs.chat": "AI сесии",
    "soils.details.totalAnalyses": "Вкупно анализи",
    "soils.details.recentAnalyses": "Неодамнешни анализи",
    "soils.details.viewAll": "Види ги сите",
    "soils.details.allAnalyses": "Сите анализи",
    "soils.details.noAnalysesDescription":
      "Креирајте ја вашата прва анализа за да добиете увид во почвата и препораки за растенија",
    "soils.details.createAnalysis": "Креирај анализа",
    "soils.details.analysis.creating": "Се креира анализа за длабочина {depth}...",
    "soils.details.analysis.created": "Анализата е креирана успешно!",
    "soils.details.analysis.autoLoad": "Откриј параметри",
    "soils.details.analysis.autoLoadLabel": "Откриј параметри",
    "soils.details.analysis.autoLoadDescription":
      "Изберете слој на длабочина и автоматски ќе ги користиме најновите параметри за оваа локација.",
    "soils.details.chat.title": "AI чат сесии",
    "soils.details.chat.subtitle": "Преглед и управување со разговорите за оваа почва",
    "soils.details.chat.newSession": "Нова чат сесија",
    "soils.details.chat.session": "Чат сесија",
    "soils.details.chat.emptyTitle": "Нема чат сесии",
    "soils.details.chat.emptyDescription":
      "Започнете разговор со AI асистентот за да добиете совет за оваа почва",
    "soils.details.chat.startChat": "Започни чат",
    "soils.details.chat.messages": "пораки",
    "soils.details.chat.deleteConfirm": "Да се избрише оваа чат сесија?",
    "soils.details.chat.deleted": "Чат сесијата е избришана",
    "soils.details.chat.assistantReply":
      "Одлично прашање! Дозволете да ги анализирам податоците за вашата почва и да дадам конкретни препораки...",
    "soils.details.import.fromCsv": "Увези параметри",
    "soils.details.import.fromCsvLabel": "Увези параметри",
    "soils.details.import.description":
      "Прикачете CSV датотека со параметри за почва. Анализата ќе биде креирана со вашите точни податоци.",
    "soils.details.import.dropCsv": "Пуштете CSV датотека тука",
    "soils.details.import.orBrowse": "или кликнете за избор",
    "soils.details.import.importing": "Се увезуваат параметри за почва...",
    "soils.details.import.importingShort": "Се увезува...",
    "soils.details.import.parametersImported": "Параметрите се увезени! Се креира анализа...",
    "soils.details.import.invalidCsv": "Прикачете валидна CSV датотека",
    "soils.details.import.templateDownloaded": "Шаблонот е преземен",
    "soils.details.import.requirementsTitle": "Барања за CSV формат",
    "soils.details.import.requirement.depth":
      "Вклучете колона за длабочина (пр. „0-5 cm“, „5-15 cm“)",
    "soils.details.import.requirement.required":
      "Задолжително: pH, Текстура, Азот, Органски јаглерод",
    "soils.details.import.requirement.optional": "Опционално: Густина, CEC, Влажност",
    "soils.details.import.requirement.headers": "Првиот ред мора да содржи заглавија на колони",
    "soils.details.import.downloadTemplate": "Преземи CSV шаблон",

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
    "common.delete": "Избриши",
    "common.retry": "Обиди се повторно",
    "common.edit": "Уреди",

    "notes.title": "Белешки",
    "notes.subtitle": "Преглед и управување со белешките за сите ваши почви.",
    "notes.new": "Нова белешка",
    "notes.edit": "Уреди белешка",
    "notes.searchPlaceholder": "Пребарај белешки",
    "notes.filterTag": "Таг",
    "notes.allTags": "Сите",
    "notes.loadError": "Не можевме да ги вчитаме белешките.",
    "notes.emptyTitle": "Нема белешки",
    "notes.emptyDescription": "Креирајте ја првата белешка и поврзете ја со профил на почва.",
    "notes.soil": "Профил на почва",
    "notes.soilRequired": "Изберете профил на почва.",
    "notes.deleteConfirm": "Да се избрише оваа белешка? Ова не може да се врати.",
    "notes.deleteTitle": "Избриши белешка",
    "notes.deleteDescription":
      "Дали сте сигурни дека сакате да ја избришете „{title}“? Ова дејство не може да се врати.",
    "notes.deleted": "Белешката е избришана",
    "notes.deleteFailed": "Не можевме да ја избришеме белешката.",
    "notes.details.created": "Креирано",
    "notes.details.updated": "Последна промена",

    "soils.details.notes.title": "Белешки од полето",
    "soils.details.notes.subtitle":
      "Приватни забелешки, планови и потсетници за овој профил на почва.",
    "soils.details.notes.add": "Додај белешка",
    "soils.details.notes.emptyTitle": "Сè уште нема белешки",
    "soils.details.notes.emptyDescription":
      "Запишете третмани, примероци или сè што сакате да го запомните за оваа почва.",
    "soils.details.notes.createFirst": "Додајте ја првата белешка",
    "soils.details.notes.edit": "Уреди белешка",
    "soils.details.notes.newTitle": "Нова белешка",
    "soils.details.notes.noteTitle": "Наслов",
    "soils.details.notes.noteDescription": "Опис",
    "soils.details.notes.lastUpdated": "Последна промена",
    "soils.details.notes.tags": "Тагови",
    "soils.details.notes.tagsPlaceholder": "Внесете таг и притиснете Enter",
    "soils.details.notes.addTag": "Додај",
    "soils.details.notes.removeTag": "Тргни таг",
    "soils.details.notes.deleteConfirm": "Да се избрише оваа белешка? Ова не може да се врати.",
    "soils.details.notes.deleted": "Белешката е избришана",
    "soils.details.notes.deleteFailed": "Не можевме да ја избришеме белешката.",
    "soils.details.notes.loadError": "Не можевме да ги вчитаме белешките.",
    "soils.details.notes.titleRequired": "Внесете наслов.",
    "soils.details.notes.saveSuccess": "Белешката е ажурирана",
    "soils.details.notes.createSuccess": "Белешката е креирана",
    "soils.details.notes.saveFailed": "Не можевме да ја зачуваме белешката.",
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
