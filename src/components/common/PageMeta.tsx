import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { organizationSchema, pageImages, site, siteUrl } from '@/data/site';
import { seoPages } from '@/data/seo';

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

export const PageMeta: React.FC<PageMetaProps> = (props) => {
  const {
    noindex = false,
    image,
    type = 'website',
    breadcrumbs,
    structuredData,
  } = props;
  const { pathname } = useLocation();
  const pageSeo = seoPages[pathname.replace(/\/$/, '') || '/'];
  const title = props.title ?? pageSeo?.title ?? site.name;
  const description = props.description ?? pageSeo?.description ?? '';
  const keywords = props.keywords ?? (pageSeo ? [pageSeo.primaryKeyword, ...pageSeo.secondaryKeywords] : undefined);
  const canonical = siteUrl(pathname === '/' ? '/' : pathname.replace(/\/$/, ''));
  const shareImage = siteUrl(image || pageImages[pathname] || site.defaultImage);
  const trail = breadcrumbs || [{ name: 'Home', path: '/' }, ...(pathname === '/' ? [] : [{ name: pageNames[pathname] || title, path: pathname }])];
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      organizationSchema,
      { '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, publisher: { '@id': organizationSchema['@id'] } },
      { '@type': pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: title, description, ...(pageSeo ? { keywords: [pageSeo.primaryKeyword, ...pageSeo.secondaryKeywords] } : {}), isPartOf: { '@id': `${site.url}/#website` }, primaryImageOfPage: { '@type': 'ImageObject', url: shareImage }, ...(structuredData ? { mainEntity: { '@id': `${canonical}#main` } } : {}) },
      ...(trail.length > 1 ? [{ '@type': 'BreadcrumbList', itemListElement: trail.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: siteUrl(item.path) })) }] : []),
      ...(structuredData ? [{ ...structuredData, ...(Array.isArray(structuredData.image) ? { image: structuredData.image.map(value => typeof value === 'string' ? siteUrl(value) : value) } : {}), '@id': `${canonical}#main` }] : []),
    ],
  };
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;

  return (
    <Helmet defer={false}>
      <title>{title}</title>
      {!noindex && <link rel='canonical' href={canonical} />}
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
