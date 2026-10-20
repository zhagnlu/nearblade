import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa";
import { BrandLogo } from "@/components/common/BrandLogo";
import { contactPhone, phoneUrl, whatsappContact, whatsappUrl } from "@/data/contact";
import { productCategories } from "@/data/products";

export function Footer() {
  return (
    <footer className="site-chrome border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <BrandLogo className="mb-6" />
            <p className="text-metal-subtext text-sm leading-relaxed">
              Nearblade specializes in precision industrial blades and tooling for global manufacturers.
            </p>
          </div>

          <div>
            <h4 className="text-metal-text font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "About Us", path: "/about" },
                { label: "Equipment", path: "/equipment" },
                { label: "Blog", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-metal-subtext text-sm hover:text-steel transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-metal-text font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {productCategories.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/products?category=${item.id}`}
                    className="text-metal-subtext text-sm hover:text-steel transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-metal-text font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaPhone className="text-steel mt-1 flex-shrink-0" size={14} />
                <a href={phoneUrl} translate="no" className="text-metal-subtext text-sm hover:text-steel transition-colors">{contactPhone.displayNumber}</a>
              </li>
              <li className="flex items-start gap-3">
                <FaWhatsapp className="text-steel mt-1 flex-shrink-0" size={16} aria-hidden="true" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-metal-subtext text-sm hover:text-steel transition-colors"
                >
                  WhatsApp: {whatsappContact.displayNumber}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-steel mt-1 flex-shrink-0" size={14} />
                <a
                  href="mailto:info@nearblade.com"
                  className="text-metal-subtext text-sm hover:text-steel transition-colors"
                >
                  info@nearblade.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-steel mt-1 flex-shrink-0" size={14} />
                <p className="text-metal-subtext text-sm">
                  Shiqiu Industrial Park, Lishui District, Nanjing, Jiangsu, China
                </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-metal-subtext text-sm">
              &copy; {new Date().getFullYear()} Nearblade All rights reserved.
            </p>
            <p className="text-metal-subtext text-xs">
              Mon - Fri: 8:30 - 17:30 (GMT+8)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
