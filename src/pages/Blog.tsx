import { PageHero } from "@/components/common/PageHero";
import { PageMeta } from "@/components/common/PageMeta";
import { BlogCard } from "@/components/common/BlogCard";
import { blogPosts } from "@/data/blog";

export default function Blog() {
  return <>
    <PageMeta title="Blog & Blade Guides - Rucheng Technology" description="Practical guides to industrial blade product families, custom inquiries and replacement planning." />
    <PageHero image="/images/heroes/blog-hero.jpg" title="Industrial Blade" accent="Insights & Guides" description="Practical ideas for product selection, custom tooling inquiries and production planning." contentId="blog-content" primaryAction={{ label: "Explore Articles", to: "#blog-content" }} secondaryAction={{ label: "Explore Products", to: "/products" }} lightOverlay />
    <section id="blog-content" className="blog-surface scroll-mt-20 py-section-mobile md:py-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-metal-text mb-4">From Our Knowledge Center</h2>
        <p className="text-metal-subtext mb-10 max-w-2xl">Explore our product range and prepare a clearer conversation about your next blade or tooling requirement.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{blogPosts.map(post => <BlogCard key={post.slug} post={post} />)}</div>
      </div>
    </section>
  </>;
}
