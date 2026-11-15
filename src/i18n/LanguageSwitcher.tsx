import { FaGlobe } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { languages } from './languages';
import { languageTarget } from './paths';
import { useLanguage, useTranslate } from './LanguageProvider';

export function LanguageSwitcher() {
  const { language, loading, error, changeLanguage } = useLanguage();
  const location = useLocation();
  const t = useTranslate();
  return <div className="language-switcher" translate="no" data-no-translate>
    <FaGlobe aria-hidden="true" className="language-icon" />
    <details className="language-menu" id="site-language">
      <summary aria-label={t('Language')} aria-busy={loading}>{languages.find(item => item.code === language)?.name}</summary>
      <nav aria-label={t('Language')}>
        {languages.map(item => <a key={item.code} lang={item.code} hrefLang={item.code}
          href={languageTarget(location.pathname, location.search, location.hash, item.code)}
          aria-current={item.code === language ? 'page' : undefined}
          onClick={event => {
            if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            event.currentTarget.closest('details')?.removeAttribute('open');
            void changeLanguage(item.code);
          }}>{item.name}</a>)}
      </nav>
    </details>
    <span className="language-status" role="status" aria-live="polite">{loading ? t('Loading language…') : error ? t('Language could not be loaded. Please try again.') : ''}</span>
  </div>;
}
