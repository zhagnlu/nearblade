import pages from "../../content/seo/pages.json";

export interface PageSeo {
  intent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  title: string;
  description: string;
}

export const seoPages: Record<string, PageSeo> = pages;
