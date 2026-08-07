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

async function detectInitialLanguage(): Promise<"en" | "pt"> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1200);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timer);
    const data = await res.json();
    if (data && data.country_code) {
      return data.country_code === "BR" ? "pt" : "en";
    }
  } catch {
    // ignora e cai no fallback abaixo
  }
  try {
    const lang = (navigator.language || "en").toLowerCase();
    return lang.startsWith("pt") ? "pt" : "en";
  } catch {
    return "en";
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [langReady, setLangReady] = useState(false);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  };

  useEffect(() => {
    let cancelled = false;

    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      saved = null;
    }

    if (saved === "en" || saved === "pt") {
      setLanguage(saved);
      setLangReady(true);
      return;
    }

    detectInitialLanguage()
      .then((lang) => {
        if (cancelled) return;
        setLanguage(lang);
      })
      .catch(() => {
        if (cancelled) return;
        setLanguage("en");
      })
      .finally(() => {
        if (cancelled) return;
        setLangReady(true);
      });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const t = translations[language];
    const onRaioX = typeof window !== "undefined" && window.location.pathname.startsWith("/raio-x");
    if (onRaioX) {
      document.title = language === "pt" ? "Veehtor AI · Raio-X da Operação" : "Veehtor AI · Operations X-Ray";
    } else {
      document.title = t.meta.title;
    }
    setMetaDescription(t.meta.description);
    document.documentElement.lang = language === "pt" ? "pt-BR" : "en-US";
  }, [language]);

  if (!langReady) {
    const brand = translations.en.loader.brand;
    return (
      <div id="loader">
        <div className="loader-brand">{brand}</div>
        <div id="loader-bar-wrap">
          <div id="loader-bar" style={{ width: "30%" }} />
        </div>
      </div>
    );
  }

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
