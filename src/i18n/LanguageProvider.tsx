import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isLanguage, translateText, type Dictionary, type Language } from './languages';
import { languageTarget, splitLocalePath } from './paths';

export const InitialLanguageContext = createContext<{ language: Language; dictionary: Dictionary }>({ language: 'en', dictionary: {} });
export function readInitialLanguage() {
  if (typeof document === 'undefined') return { language: 'en' as const, dictionary: {} };
  const data = document.getElementById('language-data')?.textContent;
  try {
    const initial = JSON.parse(data || '{}');
    if (isLanguage(initial.language) && initial.dictionary && typeof initial.dictionary === 'object') return initial as { language: Language; dictionary: Dictionary };
  } catch { /* Development shell has no bootstrap dictionary. */ }
  return { language: 'en' as const, dictionary: {} };
}
interface LanguageContextValue {
  language: Language; dictionary: Dictionary; loading: boolean; error: boolean;
  changeLanguage: (language: Language) => Promise<void>;
}
const LanguageContext = createContext<LanguageContextValue>({ language: 'en', dictionary: {}, loading: false, error: false, changeLanguage: async () => {} });
export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: PropsWithChildren) {
  const initial = useContext(InitialLanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const language = splitLocalePath(location.pathname).language || 'en';
  const [packs, setPacks] = useState<Partial<Record<Language, Dictionary>>>(() => ({ en: {}, [initial.language]: initial.dictionary }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const serial = useRef(0);
  const locationRef = useRef(location);
  locationRef.current = location;
  const pending = useRef(new Map<Language, Promise<Dictionary>>());
  const load = useCallback(async (code: Language): Promise<Dictionary> => {
    if (packs[code]) return packs[code]!;
    if (!pending.current.has(code)) {
      const promise = (async () => {
        const response = await fetch(`/locales/${code}.json`, { signal: AbortSignal.timeout(12000) });
        if (!response.ok) throw new Error('Language unavailable');
        const dictionary = await response.json();
        if (!dictionary || Array.isArray(dictionary) || typeof dictionary !== 'object' || !Object.keys(dictionary).length || Object.values(dictionary).some(value => typeof value !== 'string' || !value.trim())) throw new Error('Invalid language pack');
        setPacks(current => ({ ...current, [code]: dictionary }));
        return dictionary as Dictionary;
      })().finally(() => pending.current.delete(code));
      pending.current.set(code, promise);
    }
    return pending.current.get(code)!;
  }, [packs]);
  const changeLanguage = useCallback(async (code: Language) => {
    if (!isLanguage(code)) return;
    const request = ++serial.current;
    const from = locationRef.current;
    setLoading(true); setError(false);
    try {
      await load(code);
      if (request !== serial.current || from !== locationRef.current) return;
      navigate(languageTarget(from.pathname, from.search, from.hash, code));
    } catch { if (request === serial.current) setError(true); }
    finally { if (request === serial.current) setLoading(false); }
  }, [load, navigate]);
  useEffect(() => {
    let active = true;
    if (!packs[language]) {
      setLoading(true); setError(false);
      void load(language).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    }
    return () => { active = false; };
  }, [language, packs, load]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('nearblade-language', language); } catch { /* URL remains authoritative. */ }
  }, [language]);
  const dictionary = packs[language] || {};
  const value = useMemo(() => ({ language, dictionary, loading, error, changeLanguage }), [language, dictionary, loading, error, changeLanguage]);
  return <LanguageContext.Provider value={value}>{packs[language] ? children : <p role="status">{error ? 'Language could not be loaded. Please try again.' : 'Loading language…'}{error && <button onClick={() => { setError(false); void load(language).catch(() => setError(true)); }}>↻</button>}</p>}</LanguageContext.Provider>;
}
export function useTranslate() {
  const { dictionary } = useLanguage();
  return (source: string) => translateText(source, dictionary);
}
