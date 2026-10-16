import { FaGlobe } from "react-icons/fa";
import { languages, isLanguage } from "./languages";
import { useLanguage, useTranslate } from "./LanguageProvider";

export function LanguageSwitcher() {
  const { language, loading, error, changeLanguage } = useLanguage();
  const t = useTranslate();
  return (
    <div className="language-switcher" translate="no" data-no-translate>
      <FaGlobe aria-hidden="true" className="language-icon" />
      <select
        id="site-language"
        aria-label={t("Language")}
        aria-busy={loading}
        value={language}
        onChange={event => { if (isLanguage(event.target.value)) void changeLanguage(event.target.value); }}
      >
        {languages.map(item => <option key={item.code} value={item.code} lang={item.code}>{item.name}</option>)}
      </select>
      <span className="language-status" role="status" aria-live="polite">{loading ? t("Loading language…") : error ? t("Language could not be loaded. Please try again.") : ""}</span>
    </div>
  );
}
