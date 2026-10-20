import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import type { ReactNode } from "react";

interface HeroAction {
  label: string;
  to: string;
}

interface PageHeroProps {
  title: string;
  accent: string;
  description: string;
  contentId: string;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  image: string;
  productVisual?: boolean;
  lightOverlay?: boolean;
  visual?: ReactNode;
}

export function PageHero({ title, accent, description, contentId, primaryAction, secondaryAction, image, productVisual = false, lightOverlay = false, visual }: PageHeroProps) {
  const primaryClass = "inline-flex items-center px-8 py-4 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5 group";
  const secondaryClass = "inline-flex items-center px-8 py-4 border border-metal-subtext/30 text-metal-text font-medium rounded-card hover:border-steel hover:text-steel transition-all duration-200";
  const action = ({ label, to }: HeroAction, primary: boolean) => {
    const content = <>{label}{primary && <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />}</>;
    const className = primary ? primaryClass : secondaryClass;
    return to.startsWith("#")
      ? <a href={to} className={className}>{content}</a>
      : <Link to={to} className={className}>{content}</Link>;
  };

  return (
    <section className={`relative min-h-screen min-h-[100svh] flex items-center justify-center overflow-hidden ${productVisual ? "hero-product-scene" : "hero-scene"}`}>
      <div className="absolute inset-0" aria-hidden="true">
        {visual ? <div className="absolute inset-0 bg-gradient-to-br from-[#172536] via-[#263b4f] to-[#34495B]" /> : <img src={image} alt="" className={productVisual ? "hero-product-visual" : "w-full h-full object-cover"} {...{ fetchpriority: "high" }} />}
        <div className={productVisual ? "absolute inset-0 bg-gradient-to-b from-[#263440]/35 via-[#263440]/65 to-[#293640]" : lightOverlay ? "absolute inset-0 bg-gradient-to-b from-[#101820]/20 via-[#101820]/25 to-[#34495B]/75" : "absolute inset-0 bg-gradient-to-b from-[#101820]/30 via-[#101820]/35 to-[#34495B]/80"} />
      </div>
      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 ${visual ? "grid grid-cols-1 lg:grid-cols-2 items-center gap-10" : "text-center"}`}>
        <div>
        <h1 className={`text-4xl sm:text-5xl ${visual ? "lg:text-5xl" : "lg:text-hero animate-fade-in-up"} text-metal-text mb-6`}>
          {title}<span className="block text-[#8CC6D7]">{accent}</span>
        </h1>
        <p className="text-lg lg:text-xl text-metal-subtext max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>{description}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          {action(primaryAction, true)}
          {secondaryAction && action(secondaryAction, false)}
        </div>
        </div>
        {visual && <div className="min-w-0">{visual}</div>}
      </div>
      <a href={`#${contentId}`} aria-label="Scroll to page content" className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce motion-reduce:animate-none">
        <span className="w-6 h-10 border-2 border-metal-subtext/30 rounded-full flex items-start justify-center p-2">
          <span className="w-1 h-2 bg-steel rounded-full" />
        </span>
      </a>
    </section>
  );
}
