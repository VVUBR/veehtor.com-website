import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Language, type Translations } from "./translations";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "veehtor-lang";

function setMetaDescription(content: string) {
  let el = document.querySelector('meta[name="description"]');
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "description");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", content);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", content);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "pt" || saved === "en") setLanguageState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const t = translations[language];
    document.title = t.meta.title;
    setMetaDescription(t.meta.description);
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
