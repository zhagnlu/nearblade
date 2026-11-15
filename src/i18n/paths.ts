import { languages, type Language } from './languages';

export const languagePrefix = (language: Language) => language.toLowerCase();
export const languageFromPrefix = (prefix: string): Language | undefined => languages.find(item => languagePrefix(item.code) === prefix.toLowerCase())?.code;
export function splitLocalePath(pathname: string) {
  const parts = pathname.split('/');
  const language = languageFromPrefix(parts[1] || '');
  return { language, path: (language ? '/' + parts.slice(2).join('/') : pathname).replace(/\/+$/, '') || '/' };
}
export function localizedPath(path: string, language: Language): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const match = path.match(/^([^?#]*)(.*)$/)!;
  const bare = splitLocalePath(match[1]).path;
  return `/${languagePrefix(language)}${bare === '/' ? '/' : `${bare}/`}${match[2]}`;
}
export function languageTarget(pathname: string, search: string, hash: string, language: Language) {
  const params = new URLSearchParams(search);
  params.delete('lang');
  const query = params.toString();
  return localizedPath(pathname, language) + (query ? `?${query}` : '') + hash;
}
