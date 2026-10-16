import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { PropsWithChildren } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isLanguage, translateText } from "./languages";
import type { Dictionary, Language } from "./languages";

const dictionaries = new Map<Language, Promise<Dictionary>>([["en", Promise.resolve({})]]);
const storageKey = "nearblade-language";

async function loadDictionary(language: Language): Promise<Dictionary> {
  if (!dictionaries.has(language)) {
    const request = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(`/locales/${language}.json`, { signal: controller.signal });
        if (!response.ok) throw new Error("Language unavailable");
        const dictionary: unknown = await response.json();
        if (!dictionary || Array.isArray(dictionary) || typeof dictionary !== "object" || !Object.keys(dictionary).length || Object.values(dictionary).some(value => typeof value !== "string" || !value.trim())) throw new Error("Invalid language pack");
        return dictionary as Dictionary;
      } finally {
        window.clearTimeout(timeout);
      }
    })().catch(error => { dictionaries.delete(language); throw error; });
    dictionaries.set(language, request);
  }
  return dictionaries.get(language)!;
}

interface LanguageContextValue {
  language: Language;
  dictionary: Dictionary;
  loading: boolean;
  error: boolean;
  changeLanguage: (language: Language, updateUrl?: boolean) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue>({ language: "en", dictionary: {}, loading: false, error: false, changeLanguage: async () => {} });
export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: PropsWithChildren) {
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = useRef(location);
  locationRef.current = location;
  const [selection, setSelection] = useState<{ language: Language; dictionary: Dictionary }>({ language: "en", dictionary: {} });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const serial = useRef(0);
  const initialized = useRef(false);
  const mounted = useRef(false);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  const changeLanguage = useCallback(async (language: Language, updateUrl = true) => {
    if (!isLanguage(language)) return;
    const request = ++serial.current;
    setLoading(true);
    setError(false);
    try {
      const dictionary = await loadDictionary(language);
      if (!mounted.current || request !== serial.current) return;
      setSelection({ language, dictionary });
      try { localStorage.setItem(storageKey, language); } catch { /* Selection still works without storage. */ }
      if (updateUrl) {
        const current = locationRef.current;
        const params = new URLSearchParams(current.search);
        if (language === "en") params.delete("lang"); else params.set("lang", language);
        navigate({ pathname: current.pathname, search: params.toString(), hash: current.hash }, { replace: true });
      }
    } catch {
      if (mounted.current && request === serial.current) setError(true);
    } finally {
      if (mounted.current && request === serial.current) setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    const requested = new URLSearchParams(location.search).get("lang");
    if (!initialized.current) {
      initialized.current = true;
      let saved: string | null = null;
      try { saved = localStorage.getItem(storageKey); } catch { /* Use the default language. */ }
      const language = isLanguage(requested) ? requested : isLanguage(saved) ? saved : "en";
      void changeLanguage(language, false);
    } else if (isLanguage(requested) && requested !== selection.language) {
      void changeLanguage(requested, false);
    }
  }, [location.search, changeLanguage]);

  useEffect(() => {
    document.documentElement.lang = selection.language;
    document.documentElement.dir = selection.language === "ar" ? "rtl" : "ltr";
  }, [selection.language]);

  useEffect(() => () => { document.documentElement.lang = "en"; document.documentElement.dir = "ltr"; }, []);

  const value = useMemo(() => ({ ...selection, loading, error, changeLanguage }), [selection, loading, error, changeLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useTranslate() {
  const { dictionary } = useLanguage();
  return (source: string) => translateText(source, dictionary);
}
