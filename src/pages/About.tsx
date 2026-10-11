import { PageHero } from "@/components/common/PageHero";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowRight, FaIndustry, FaCogs, FaShieldAlt, FaGlobe, FaAward, FaUsers } from "react-icons/fa";

export default function About() {
  return (
    <>
      <PageMeta
        title="About Us - Nanjing Rucheng Technology"
        description="Learn about Nanjing Rucheng Technology, a leading manufacturer of precision industrial blades and tooling with over 15 years of experience."
        keywords={["about rucheng", "industrial blade manufacturer", "china blade factory"]}
      />

      <PageHero
        title="About Rucheng"
        accent="Technology"
        description="A trusted partner for precision industrial blades and tooling, serving manufacturers across the globe with consistent quality and custom solutions."
        contentId="about-content"
        image="/images/heroes/about-hero-v2.jpg"
        lightOverlay
        primaryAction={{ label: "Discover Our Story", to: "#about-content" }}
        secondaryAction={{ label: "Explore Products", to: "/products" }}
      />

      <section id="about-content" className="scroll-mt-20 py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl lg:text-h3 text-metal-text mb-6">Our Story</h2>
              <div className="space-y-4 text-metal-subtext leading-relaxed">
                <p>
                  Founded in Nanjing, China, Rucheng Technology has grown from a specialized blade manufacturer to a comprehensive industrial tooling solutions provider. Our journey began with a simple mission: to deliver precision cutting tools that meet the exacting standards of modern manufacturing.
                </p>
                <p>
                  Over the years, we have invested heavily in advanced manufacturing equipment and quality control systems. Today, our products serve customers across 8+ industries, including sheet metal fabrication, packaging, steel processing, and precision manufacturing.
                </p>
                <p>
                  Our commitment to quality is reflected in every blade we produce. From material selection to final inspection, each step of our manufacturing process is carefully controlled to ensure consistent performance and reliability.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                loading="lazy"
                decoding="async"
                src="/images/manual/factory-exterior.jpg"
                alt="Rucheng factory"
                className="rounded-card shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-steel/20 rounded-card -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-h3 text-metal-text mb-4">Why Choose Rucheng</h2>
            <p className="text-metal-subtext max-w-2xl mx-auto">
              Our competitive advantages that set us apart in the industrial blade manufacturing industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaIndustry,
                title: "Advanced Manufacturing",
                desc: "State-of-the-art CNC grinding machines and heat treatment facilities ensure precision and consistency in every blade we produce.",
              },
              {
                icon: FaCogs,
                title: "Custom Solutions",
                desc: "Our engineering team works closely with customers to develop tailored solutions for unique cutting applications and requirements.",
              },
              {
                icon: FaShieldAlt,
                title: "Quality Assurance",
                desc: "Rigorous quality control at every stage, from raw material inspection to final testing, guarantees reliable performance.",
              },
              {
                icon: FaGlobe,
                title: "Global Service",
                desc: "Serving customers worldwide with responsive communication, timely delivery, and comprehensive technical support.",
              },
              {
                icon: FaAward,
                title: "Proven Expertise",
                desc: "Over 15 years of specialized experience in industrial blade manufacturing across diverse applications and materials.",
              },
              {
                icon: FaUsers,
                title: "Customer Focus",
                desc: "We prioritize long-term partnerships, understanding each customer's unique needs and providing ongoing support.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-industrial-secondary border border-border rounded-card p-8 hover:border-steel/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center mb-6">
                  <item.icon className="text-steel" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-metal-text mb-3">{item.title}</h3>
                <p className="text-metal-subtext text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                loading="lazy"
                decoding="async"
                src="/images/manual/production-workshop.jpg"
                alt="Production workshop shown in the Rucheng product manual"
                className="rounded-card shadow-xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl lg:text-h3 text-metal-text mb-6">Quality Commitment</h2>
              <div className="space-y-4 text-metal-subtext leading-relaxed">
                <p>
                  Quality is at the heart of everything we do. Our comprehensive quality management system covers every aspect of production, from incoming material inspection to final product testing.
                </p>
                <p>
                  We employ advanced measurement equipment including coordinate measuring machines (CMM), optical comparators, and hardness testers to ensure every blade meets our stringent specifications.
                </p>
                <p>
                  Our tolerance capabilities reach ±0.001mm for precision slitting knives, demonstrating our commitment to delivering tools that perform at the highest level.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-h3 text-metal-text mb-4">Ready to Work Together?</h2>
          <p className="text-metal-subtext max-w-2xl mx-auto mb-8">
            Contact our team to discuss your industrial blade requirements and discover how we can support your manufacturing needs.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5 group"
          >
            Contact Our Team
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
          </Link>
        </div>
      </section>
    </>
  );
}
