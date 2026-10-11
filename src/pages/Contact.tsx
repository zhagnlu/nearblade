import { PageHero } from "@/components/common/PageHero";
import { PageMeta } from "@/components/common/PageMeta";
import { ContactForm } from "@/components/generated/ContactForm";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <PageMeta
        title="Contact Us - Rucheng Technology"
        description="Get in touch with our team for product inquiries, technical support, or custom solutions. We respond within 24 hours."
        keywords={["contact rucheng", "industrial blade inquiry", "request quote"]}
      />

      <PageHero
        title="Let’s Discuss"
        accent="Your Requirements"
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
              <h3 className="text-lg font-semibold text-metal-text mb-4">Phone</h3>
              <div className="space-y-2">
                <a
                  href="tel:+8613813096295"
                  className="block text-metal-subtext hover:text-steel transition-colors"
                >
                  +86-13813096295
                </a>
                <a
                  href="tel:4008866884"
                  className="block text-metal-subtext hover:text-steel transition-colors"
                >
                  400-886-6884 (China)
                </a>
              </div>
            </div>

            <div className="bg-industrial border border-border rounded-card p-8">
              <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center mb-6">
                <FaEnvelope className="text-steel" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-metal-text mb-4">Email</h3>
              <a
                href="mailto:sales@ruchengmachine.com"
                className="text-metal-subtext hover:text-steel transition-colors break-all"
              >
                sales@ruchengmachine.com
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
                Fill out the form below and our team will get back to you as soon as possible. For urgent inquiries, please call us directly.
              </p>
              <ContactForm />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-metal-text mb-6">Our Location</h2>
              <div className="bg-industrial border border-border rounded-card overflow-hidden mb-6">
                <div className="aspect-[4/3] bg-industrial-secondary flex items-center justify-center">
                  <div className="text-center p-8">
                    <FaMapMarkerAlt className="text-steel mx-auto mb-4" size={32} />
                    <p className="text-metal-text font-medium mb-2">Nanjing Rucheng Technology Co., Ltd.</p>
                    <p className="text-metal-subtext text-sm">
                      Shiqiu Industrial Park,<br />
                      Lishui District,<br />
                      Nanjing, Jiangsu, China
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-industrial border border-border rounded-card p-6">
                <h3 className="text-metal-text font-medium mb-3">Getting Here</h3>
                <p className="text-metal-subtext text-sm leading-relaxed">
                  Located in Lishui District, Nanjing, approximately 1 hour from Nanjing Lukou International Airport. We can arrange pickup for visiting customers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
