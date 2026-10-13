import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { BlogPost } from "@/data/blog";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="blog-card group overflow-hidden rounded-card border border-border transition-all hover:-translate-y-1">
      <div className="aspect-[3/2] product-stage overflow-hidden">
        <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-contain p-5 transition-transform group-hover:scale-105" />
      </div>
      <div className="p-6">
        <span className="text-steel text-xs uppercase tracking-wider">{post.category}</span>
        <h3 className="text-xl text-metal-text font-semibold mt-3 mb-3">{post.title}</h3>
        <p className="text-metal-subtext text-sm leading-relaxed mb-5">{post.excerpt}</p>
        <span className="inline-flex items-center gap-2 text-steel text-sm font-medium">Read Article <FaArrowRight size={12} /></span>
      </div>
    </Link>
  );
}
