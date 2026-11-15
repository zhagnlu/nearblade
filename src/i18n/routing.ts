import { seoPages } from '../data/seo';
import { languageFromPrefix, localizedPath, splitLocalePath } from './paths';
import { isLanguage } from './languages';

export const publicPaths = Object.keys(seoPages);
export const retiredPaths: Record<string, string> = { '/products/sb-002': '/products/sb-001', '/products/tb-001': '/products/cp-001' };
// Shared by preview, the browser fallback and generated migration rules.
export function resolvePageRequest(pathname: string, search = '') {
  const normalized = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  const { language, path } = splitLocalePath(normalized);
  const targetPath = retiredPaths[path] || path;
  if (!publicPaths.includes(targetPath)) return null;
  const params = new URLSearchParams(search);
  const requested = params.get('lang');
  const legacyLanguage = isLanguage(requested) ? requested : languageFromPrefix(requested || '');
  const targetLanguage = language || legacyLanguage || 'en';
  const canonical = localizedPath(targetPath, targetLanguage);
  const hadLang = params.has('lang');
  params.delete('lang');
  const query = hadLang ? params.toString() : search.replace(/^\?/, '');
  return { language: targetLanguage, path: targetPath, canonical, redirect: pathname !== canonical || hadLang ? canonical + (query ? `?${query}` : '') : null };
}
