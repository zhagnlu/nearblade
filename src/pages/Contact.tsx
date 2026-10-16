import { PageHero } from "@/components/common/PageHero";
import { PageMeta } from "@/components/common/PageMeta";
import { ContactForm } from "@/components/generated/ContactForm";
import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaClock, FaWhatsapp, FaCheckCircle, FaFileAlt, FaArrowRight } from "react-icons/fa";
import { contactPhone, phoneUrl, whatsappUrl } from "@/data/contact";

export default function Contact() {
  return (
    <>
      <PageMeta />

      <PageHero
        title="Industrial Blade Quotes"
        accent="& Custom Tooling"
        description="Have questions about our products or need a custom solution? Our team is ready to help. Reach out and we will respond within 24 hours."
        contentId="contact-content"
        image="/images/heroes/contact-hero-v2.jpg"
        lightOverlay
        primaryAction={{ label: "Get in Touch", to: "#contact-content" }}
        secondaryAction={{ label: "Explore Products", to: "/products" }}
      />

      <section id="contact-content" className="scroll-mt-20 py-section-mobile md:py-section bg-industrial-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-industrial border border-border rounded-card p-8">
              <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center mb-6">
                <FaPhone className="text-steel" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-metal-text mb-4">Phone &amp; WhatsApp</h3>
              <div className="space-y-2">
                <a
                  href={phoneUrl}
                  translate="no"
                  className="block text-metal-subtext hover:text-steel transition-colors"
                >
                  {contactPhone.displayNumber}
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-steel font-medium hover:underline"
                >
                  <FaWhatsapp size={20} aria-hidden="true" />
                  Chat on WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>

            <div className="bg-industrial border border-border rounded-card p-8">
              <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center mb-6">
                <FaEnvelope className="text-steel" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-metal-text mb-4">Email</h3>
              <a
                href="mailto:info@nearblade.com"
                className="text-metal-subtext hover:text-steel transition-colors break-all"
              >
                info@nearblade.com
              </a>
            </div>

            <div className="bg-industrial border border-border rounded-card p-8">
              <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center mb-6">
                <FaClock className="text-steel" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-metal-text mb-4">Business Hours</h3>
              <div className="text-metal-subtext">
                <p>Monday - Friday</p>
                <p className="text-steel font-medium">8:30 - 17:30 (GMT+8)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold text-metal-text mb-6">Send Us a Message</h2>
              <p className="text-metal-subtext mb-8">
                Share your contact details and requirements below, then send the prepared inquiry from your email app. For urgent inquiries, please call us directly.
              </p>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-metal-text mb-6">For a Faster Quotation</h2>
              <div className="bg-industrial border border-border rounded-card p-6 sm:p-8 mb-6">
                <p className="text-metal-subtext leading-relaxed mb-6">
                  Share these details so our team can understand your application and prepare a suitable blade or tooling proposal.
                </p>
                <ul className="space-y-6">
                  {[
                    { title: "Application & Machine", description: "What you are cutting or forming, plus the machine manufacturer and model." },
                    { title: "Dimensions & Drawing", description: "Blade size, mounting holes, cutting-edge profile and any critical tolerances." },
                    { title: "Material & Working Conditions", description: "Material grade and thickness, operating conditions and preferred blade material, if known." },
                    { title: "Quantity & Delivery", description: "Number of pieces or sets, delivery destination and your preferred delivery window." },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <FaCheckCircle className="text-steel shrink-0 mt-1" size={18} aria-hidden="true" />
                      <div>
                        <h3 className="text-metal-text font-medium mb-1">{item.title}</h3>
                        <p className="text-metal-subtext text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-steel/5 border border-steel/20 rounded-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <FaFileAlt className="text-steel shrink-0" size={20} aria-hidden="true" />
                  <h3 className="text-metal-text font-medium">Have a Drawing or Sample?</h3>
                </div>
                <p className="text-metal-subtext text-sm leading-relaxed">
                  Attach drawings or photos in your email app before sending the inquiry. If you only have a sample, describe it in the form and tell us which dimensions still need confirmation.
                </p>
                <Link to="/blog/custom-blade-inquiry-guide" className="inline-flex items-center gap-2 text-steel font-medium text-sm mt-5 hover:underline">
                  Read Our Inquiry Guide <FaArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
