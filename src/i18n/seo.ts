import { getProductById } from '../data/products';
import { getBlogPost } from '../data/blog';
import { seoPages } from '../data/seo';
import { translateText, type Dictionary, type Language } from './languages';

const pageCopy: Record<string, [string[], string]> = {
  '/': [['Industrial Blade Manufacturer', '& Tooling Supplier'], 'Custom industrial blades and press brake tooling from Nanjing, China. Send your drawing and application details to discuss materials, fit and a quotation.'],
  '/products': [['Industrial Blades', '& Press Brake Tooling'], 'Compare industrial blades and tooling by cutting process, material and machine. Select a product to review dimensions, mounting details and quotation requirements.'],
  '/about': [['About', 'Nearblade'], 'A trusted partner for precision industrial blades and tooling, serving manufacturers across the globe with consistent quality and custom solutions.'],
  '/equipment': [['Blade Manufacturing', 'Equipment'], 'Our advanced manufacturing facilities and precision equipment ensure consistent quality and tight tolerances across all product lines.'],
  '/contact': [['Industrial Blade Quotes', '& Custom Tooling'], 'Have questions about our products or need a custom solution? Our team is ready to help. Reach out and we will respond within 24 hours.'],
  '/blog': [['Industrial Blade', 'Insights & Guides'], 'Practical ideas for product selection, custom tooling inquiries and production planning.'],
};
export function localizedSeo(path: string, language: Language, dictionary: Dictionary) {
  const source = seoPages[path];
  if (!source || language === 'en') return source;
  const t = (value: string) => translateText(value, dictionary);
  const product = path.startsWith('/products/') ? getProductById(path.split('/').slice(-1)[0]) : undefined;
  const post = path.startsWith('/blog/') ? getBlogPost(path.split('/').slice(-1)[0]) : undefined;
  const copy = pageCopy[path];
  const name = product ? t(product.searchName || product.name) : post ? t(post.title) : copy?.[0].map(t).join(' ');
  const description = product ? t(product.description) : post ? t(post.excerpt) : copy ? t(copy[1]) : undefined;
  if (!name || !description) throw new Error(`Missing localized SEO copy for ${path}`);
  return { ...source, title: `${name} | Nearblade`, description, primaryKeyword: name, secondaryKeywords: [] };
}
