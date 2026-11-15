import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { organizationSchema, pageImages, site, siteUrl } from '@/data/site';
import { localizedSeo } from '@/i18n/seo';
import { useLanguage, useTranslate } from '@/i18n/LanguageProvider';
import { languages } from '@/i18n/languages';
import { localizedPath, splitLocalePath } from '@/i18n/paths';

const pageNames: Record<string, string> = {
  '/products': 'Products', '/about': 'About', '/equipment': 'Equipment', '/contact': 'Contact', '/blog': 'Blog',
};

interface PageMetaProps {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  noindex?: boolean;
  image?: string;
  type?: 'website' | 'article';
  breadcrumbs?: { name: string; path: string }[];
  structuredData?: Record<string, unknown>;
}

function localizeSchema(data: Record<string, unknown>, t: (value: string) => string) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key,
    ['name', 'description', 'headline', 'category', 'articleSection', 'material'].includes(key)
      ? typeof value === 'string' ? t(value) : Array.isArray(value) ? value.map(item => typeof item === 'string' ? t(item) : item) : value
      : value]));
}

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const {
    noindex = false,
    image,
    type = 'website',
    breadcrumbs,
    structuredData,
  } = props;
  const location = useLocation();
  const pathname = splitLocalePath(location.pathname).path;
  const { language, dictionary } = useLanguage();
  const t = useTranslate();
  const pageSeo = localizedSeo(pathname, language, dictionary);
  const title = noindex ? `${t('Page Not Found')} | Nearblade` : (props.title ? t(props.title) : pageSeo?.title) ?? site.name;
  const description = noindex ? t('Browse our product range or contact us for help finding a blade.') : (props.description ? t(props.description) : pageSeo?.description) ?? '';
  const keywords = props.keywords ?? (pageSeo ? [pageSeo.primaryKeyword, ...pageSeo.secondaryKeywords] : undefined);
  const canonical = siteUrl(localizedPath(pathname, language));
  const shareImage = siteUrl(image || pageImages[pathname] || site.defaultImage);
  const trail = breadcrumbs || [{ name: 'Home', path: '/' }, ...(pathname === '/' ? [] : [{ name: pageNames[pathname] || title, path: pathname }])];
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      { '@type': 'WebSite', '@id': `${siteUrl(localizedPath('/', language))}#website`, url: siteUrl(localizedPath('/', language)), name: site.name, inLanguage: language, publisher: { '@id': organizationSchema['@id'] } },
      { '@type': pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: language, ...(pageSeo ? { keywords: [pageSeo.primaryKeyword, ...pageSeo.secondaryKeywords] } : {}), isPartOf: { '@id': `${siteUrl(localizedPath('/', language))}#website` }, primaryImageOfPage: { '@type': 'ImageObject', url: shareImage }, ...(structuredData ? { mainEntity: { '@id': `${canonical}#main` } } : {}) },
      ...(trail.length > 1 ? [{ '@type': 'BreadcrumbList', itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: t(item.name), item: siteUrl(localizedPath(item.path, language)) })) }] : []),
      ...(structuredData ? [{ ...localizeSchema(structuredData, t), ...(structuredData['@type'] === 'Article' ? { inLanguage: language } : {}), ...(Array.isArray(structuredData.image) ? { image: structuredData.image.map(value => typeof value === 'string' ? siteUrl(value) : value) } : {}), '@id': `${canonical}#main` }] : []),
    ],
  };
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;

  return (
    <Helmet defer={false}>
      <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      {!noindex && <link rel='canonical' href={canonical} />}
      {!noindex && languages.map(item => <link key={item.code} rel='alternate' hrefLang={item.code} href={siteUrl(localizedPath(pathname, item.code))} />)}
      {!noindex && <link rel='alternate' hrefLang='x-default' href={siteUrl(localizedPath(pathname, 'en'))} />}
      <meta name='description' content={description} />
      {!!keywords?.length && <meta name='keywords' content={keywordsContent} />}
      <meta
        name='robots'
        content={noindex ? 'noindex, nofollow' : 'index, follow'}
      />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={description} />
      <meta property='og:type' content={type} />
      <meta property='og:site_name' content={site.name} />
      <meta property='og:locale' content={{ en: 'en_US', 'zh-CN': 'zh_CN', es: 'es_ES', fr: 'fr_FR', de: 'de_DE', pt: 'pt_PT', ru: 'ru_RU', ar: 'ar_SA', ja: 'ja_JP' }[language]} />
      <meta property='og:url' content={canonical} />
      <meta property='og:image' content={shareImage} />
      <meta property='og:image:alt' content={title} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={shareImage} />
      {!noindex && <script id='site-structured-data' type='application/ld+json'>{JSON.stringify(graph).replace(/</g, '\\u003c')}</script>}
    </Helmet>
  );
};

export const HelmetProviderWrapper: React.FC<React.PropsWithChildren> = (
  props,
) => {
  return <HelmetProvider>{props.children}</HelmetProvider>;
};
