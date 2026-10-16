export const languages = [
  { code: "en", name: "English" },
  { code: "zh-CN", name: "简体中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ru", name: "Русский" },
  { code: "ar", name: "العربية" },
  { code: "ja", name: "日本語" },
] as const;

export type Language = typeof languages[number]["code"];
export type Dictionary = Record<string, string>;
export const isLanguage = (value: string | null): value is Language => languages.some(item => item.code === value);

export function translateText(source: string, dictionary: Dictionary) {
  const key = source.trim();
  return key && Object.prototype.hasOwnProperty.call(dictionary, key)
    ? source.replace(key, () => dictionary[key])
    : source;
}
