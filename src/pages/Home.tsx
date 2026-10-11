import { PageHero } from "@/components/common/PageHero";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { productCategories } from "@/data/products";
import { StatCounter } from "@/components/generated/StatCounter";
import { ContactForm } from "@/components/generated/ContactForm";
import { FaArrowRight, FaIndustry, FaCogs, FaShieldAlt } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Nanjing Rucheng Technology - Precision Industrial Blades & Tooling"
        description="Leading manufacturer of high-precision industrial blades, shear blades, press brake tooling, and slitting knives for global manufacturers."
        keywords={["industrial blades", "shear blades", "press brake tooling", "slitting knives", "precision cutting"]}
      />

      <PageHero
        image="/images/blades-tooling-hero-v2.jpg"
        title="Precision Industrial"
        accent="Blades & Tooling"
        description="High-performance cutting solutions for global manufacturers. Engineered for precision, built for durability."
        contentId="home-content"
        primaryAction={{ label: "Explore Products", to: "/products" }}
        secondaryAction={{ label: "Request Quote", to: "/contact" }}
      />

      <section id="home-content" className="scroll-mt-20 py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-h2 text-metal-text mb-4">Our Product Range</h2>
            <p className="text-metal-subtext max-w-2xl mx-auto">
              Comprehensive solutions across 10+ product series, serving diverse industrial applications worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="group bg-industrial-secondary border border-border rounded-card overflow-hidden hover:border-steel/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-steel/5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-[3/2] overflow-hidden product-stage">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-metal-text mb-2 group-hover:text-steel transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-metal-subtext text-sm line-clamp-2">{category.description}</p>
                  <div className="mt-4 flex items-center text-steel text-sm font-medium">
                    <span>View Products</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-h2 text-metal-text mb-4">Manufacturing Excellence</h2>
            <p className="text-metal-subtext max-w-2xl mx-auto">
              Decades of precision engineering, delivering consistent quality to manufacturers worldwide.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <StatCounter value={10} suffix="+" label="Product Series" />
            <StatCounter value={0.001} prefix="±" suffix="mm" label="Tolerance Precision" />
            <StatCounter value={8} suffix="+" label="Industries Served" />
            <StatCounter value={15} suffix="+" label="Years Experience" />
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-h2 text-metal-text mb-4">Production Equipment</h2>
            <p className="text-metal-subtext max-w-2xl mx-auto">
              State-of-the-art manufacturing facilities ensuring precision and consistency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "CNC Machining Centers", desc: "Precision machining and production capability", img: "/images/manual/cnc-machining-centers.jpg" },
              { title: "Gantry Machining", desc: "Large-format manufacturing equipment", img: "/images/manual/gantry-machining.jpg" },
              { title: "Laser Cutting Systems", desc: "Sheet metal processing facilities", img: "/images/manual/laser-cutting-workshop.jpg" },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-card bg-industrial-secondary border border-border"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-industrial via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-lg font-semibold text-metal-text mb-1">{item.title}</h3>
                  <p className="text-metal-subtext text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/equipment"
              className="inline-flex items-center px-6 py-3 border border-steel text-steel font-medium rounded-card hover:bg-steel hover:text-white transition-all duration-200"
            >
              View All Equipment
              <FaArrowRight className="ml-2" size={14} />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-h2 text-metal-text mb-6">About Rucheng Technology</h2>
              <p className="text-metal-subtext mb-6 leading-relaxed">
                Located in Nanjing, China, we specialize in manufacturing high-precision industrial blades and tooling. Our commitment to quality and innovation has made us a trusted supplier for manufacturers across 8+ industries worldwide.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: FaIndustry, title: "Advanced Manufacturing", desc: "Modern facilities with CNC precision" },
                  { icon: FaCogs, title: "Custom Solutions", desc: "Tailored to your specific requirements" },
                  { icon: FaShieldAlt, title: "Quality Assured", desc: "Rigorous testing and certification" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-steel/10 rounded-card flex items-center justify-center flex-shrink-0">
                      <item.icon className="text-steel" size={18} />
                    </div>
                    <div>
                      <h4 className="text-metal-text font-medium">{item.title}</h4>
                      <p className="text-metal-subtext text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/about"
                className="inline-flex items-center text-steel font-medium hover:text-steel-light transition-colors group"
              >
                Learn More About Us
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
              </Link>
            </div>

            <div className="relative">
              <img
                loading="lazy"
                decoding="async"
                src="/images/manual/factory-exterior.jpg"
                alt="Rucheng factory"
                className="rounded-card shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-steel/10 rounded-card -z-10" />
              <div className="absolute -top-6 -right-6 w-24 h-24 border-2 border-steel/20 rounded-card -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl lg:text-h2 text-metal-text mb-4">Ready to Discuss Your Requirements?</h2>
            <p className="text-metal-subtext">
              Our engineering team is ready to help you find the perfect cutting solution for your application.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
