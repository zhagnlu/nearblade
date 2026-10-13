import { Link, useParams } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { BlogCard } from "@/components/common/BlogCard";
import { blogPosts, getBlogPost } from "@/data/blog";

export default function BlogDetail() {
  const { slug = "" } = useParams();
  const post = getBlogPost(slug);
  if (!post) return <section className="blog-surface min-h-screen pt-40 px-6 text-center"><h1 className="text-3xl text-metal-text mb-6">Article Not Found</h1><Link to="/blog" className="text-steel">Back to Blog</Link></section>;
  return <>
    <PageMeta title={`${post.title} - Rucheng Blog`} description={post.excerpt} />
    <article className="blog-surface pt-28 lg:pt-36 pb-section-mobile md:pb-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-block text-steel mb-8">← Back to Blog</Link>
        <header className="mb-10"><p className="text-steel text-sm uppercase tracking-wider mb-4">{post.category}</p><h1 className="text-3xl sm:text-4xl lg:text-5xl text-metal-text font-bold leading-tight mb-6">{post.title}</h1><p className="text-xl text-metal-subtext leading-relaxed">{post.excerpt}</p></header>
        <div className="blog-article-image product-stage aspect-[3/2] rounded-card overflow-hidden border border-border mb-12"><img src={post.image} alt={post.title} className="w-full h-full object-contain p-8" /></div>
        <nav aria-label="Article contents" className="blog-card border border-border rounded-card p-6 mb-12"><h2 className="text-metal-text font-semibold mb-4">In This Guide</h2><ul className="space-y-2">{post.sections.map((section, index) => <li key={section.heading}><a href={`#section-${index}`} className="text-metal-subtext hover:text-steel">{section.heading}</a></li>)}</ul></nav>
        <div className="space-y-10">{post.sections.map((section, index) => <section id={`section-${index}`} key={section.heading} className="scroll-mt-28"><h2 className="text-2xl font-semibold text-metal-text mb-5">{section.heading}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="text-metal-subtext leading-loose mb-4">{paragraph}</p>)}</section>)}</div>
        <aside className="blog-card border border-border rounded-card p-6 sm:p-8 mt-12"><h2 className="text-2xl text-metal-text font-semibold mb-3">Discuss Your Application</h2><p className="text-metal-subtext mb-6">Share your drawing, machine details and requirements with our team.</p><div className="flex flex-wrap gap-4"><Link to="/contact" className="px-6 py-3 bg-steel text-white rounded-card">Request Quote</Link><Link to={`/products/${post.productId}`} className="px-6 py-3 border border-border text-metal-text rounded-card">View Related Product</Link></div></aside>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"><h2 className="text-2xl text-metal-text font-semibold mb-8">More Articles</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{blogPosts.filter(item => item.slug !== slug).map(item => <BlogCard key={item.slug} post={item} />)}</div></div>
    </article>
  </>;
}
