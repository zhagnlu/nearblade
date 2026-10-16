import config from "../../site.config.json";
import { contactEmail, contactPhone } from "./contact";

export const site = { ...config, url: config.url.replace(/\/$/, "") };
export const siteUrl = (path: string) => new URL(path, `${site.url}/`).href;

export const pageImages: Record<string, string> = {
  "/": site.defaultImage,
  "/products": "/images/catalog-hero.jpg",
  "/about": "/images/heroes/about-hero-v3.webp",
  "/equipment": "/images/heroes/equipment-hero-v2.jpg",
  "/contact": "/images/heroes/contact-hero-v2.jpg",
  "/blog": "/images/heroes/blog-hero.jpg",
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: `${site.url}/`,
  logo: siteUrl("/images/brand/nearblade-logo.webp"),
  email: contactEmail,
  telephone: contactPhone.e164,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Shiqiu Industrial Park, Lishui District",
    addressLocality: "Nanjing",
    addressRegion: "Jiangsu",
    addressCountry: "CN",
  },
};
