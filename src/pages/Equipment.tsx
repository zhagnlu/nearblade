import { PageHero } from "@/components/common/PageHero";
import { Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { FaArrowRight, FaCheck } from "react-icons/fa";

const equipmentList = [
  {
    name: "CNC Machining Centers",
    description: "Enclosed CNC machining equipment shown in the Rucheng product manual, supporting industrial production and component manufacturing.",
    image: "/images/manual/cnc-machining-centers.jpg",
    capabilities: ["CNC-controlled machining", "Enclosed working area", "Production tooling support"],
  },
  {
    name: "Gantry Machining Equipment",
    description: "Large-format gantry equipment in the production workshop for machining large industrial components.",
    image: "/images/manual/gantry-machining.jpg",
    capabilities: ["Gantry structure", "Large-component machining", "Industrial production workshop"],
  },
  {
    name: "Laser Cutting Workshop",
    description: "Sheet metal laser cutting systems documented in the company's manufacturing and production facilities.",
    image: "/images/manual/laser-cutting-workshop.jpg",
    capabilities: ["Sheet metal processing", "Laser cutting systems", "Production workspace"],
  },
  {
    name: "Large-format Machining Station",
    description: "A second view of the company's heavy manufacturing equipment and machining workspace.",
    image: "/images/manual/gantry-machine-detail.jpg",
    capabilities: ["Heavy manufacturing equipment", "Large working area", "Component machining"],
  },
  {
    name: "Press Equipment Workshop",
    description: "Workshop photography from the product manual showing industrial presses and supporting production equipment.",
    image: "/images/manual/press-workshop.jpg",
    capabilities: ["Industrial press equipment", "Production organization", "Manufacturing support"],
  },
  {
    name: "Machine Assembly Workshop",
    description: "The manufacturing and assembly area shown in the Rucheng product manual, with machines organized for production and delivery.",
    image: "/images/manual/assembly-workshop.jpg",
    capabilities: ["Machine assembly", "Production preparation", "Delivery organization"],
  },
];

export default function Equipment() {
  return (
    <>
      <PageMeta
        title="Production Equipment - Rucheng Technology"
        description="Explore our state-of-the-art manufacturing equipment including CNC machining centers, gantry equipment, laser cutting systems, and assembly workshops."
        keywords={["manufacturing equipment", "CNC machining", "laser cutting", "assembly workshop"]}
      />

      <PageHero
        title="Precision Manufacturing"
        accent="& Equipment"
        description="Our advanced manufacturing facilities and precision equipment ensure consistent quality and tight tolerances across all product lines."
        contentId="equipment-content"
        image="/images/heroes/equipment-hero-v2.jpg"
        lightOverlay
        primaryAction={{ label: "Explore Our Equipment", to: "#equipment-content" }}
        secondaryAction={{ label: "Discuss Your Requirements", to: "/contact" }}
      />

      <section id="equipment-content" className="scroll-mt-20 py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-industrial border border-border rounded-card p-8 text-center">
              <div className="text-4xl font-mono font-bold text-steel mb-2">20+</div>
              <p className="text-metal-subtext">Production Equipment Sets</p>
            </div>
            <div className="bg-industrial border border-border rounded-card p-8 text-center">
              <div className="text-4xl font-mono font-bold text-steel mb-2">5000m²</div>
              <p className="text-metal-subtext">Production Facility Area</p>
            </div>
            <div className="bg-industrial border border-border rounded-card p-8 text-center">
              <div className="text-4xl font-mono font-bold text-steel mb-2">100%</div>
              <p className="text-metal-subtext">Quality Inspection Rate</p>
            </div>
          </div>

          <div className="space-y-12">
            {equipmentList.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-industrial border border-border rounded-card overflow-hidden"
              >
                <div className={`aspect-[4/3] lg:aspect-auto lg:h-full ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12">
                  <h3 className="text-xl lg:text-2xl font-semibold text-metal-text mb-4">{item.name}</h3>
                  <p className="text-metal-subtext mb-6 leading-relaxed">{item.description}</p>
                  <div className="space-y-3">
                    <h4 className="text-metal-text font-medium text-sm uppercase tracking-wider">Key Capabilities</h4>
                    {item.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <FaCheck className="text-steel flex-shrink-0" size={12} />
                        <span className="text-metal-subtext text-sm">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-industrial-secondary border border-border rounded-card p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl lg:text-h3 text-metal-text mb-4">Manufacturing Capability</h2>
                <p className="text-metal-subtext mb-6 leading-relaxed">
                  Our comprehensive manufacturing capabilities allow us to handle projects from prototype to mass production, ensuring consistent quality at every scale.
                </p>
                <ul className="space-y-3">
                  {[
                    "Custom blade design and engineering",
                    "Small batch to mass production",
                    "Material selection consultation",
                    "Technical support and after-sales service",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-metal-subtext">
                      <FaCheck className="text-steel flex-shrink-0" size={12} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-8 py-4 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5 group"
                >
                  Discuss Your Project
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
