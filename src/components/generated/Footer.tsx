import { Link } from "react-router-dom";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaFacebook } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="site-chrome bg-[#34495B] border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-steel rounded-card flex items-center justify-center">
                <span className="text-white font-bold text-lg">RC</span>
              </div>
              <div>
                <p className="text-metal-text font-semibold text-sm">RUCHENG</p>
                <p className="text-metal-subtext text-xs">TECHNOLOGY</p>
              </div>
            </div>
            <p className="text-metal-subtext text-sm leading-relaxed">
              Nanjing Rucheng Technology Co., Ltd. Specializing in precision industrial blades and tooling for global manufacturers.
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
              {[
                "Shear Blades",
                "Press Brake Tooling",
                "Rolling Shear Blades",
                "Slitting Knives",
                "Doctor Blades",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-metal-subtext text-sm hover:text-steel transition-colors duration-200"
                  >
                    {item}
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
                <div className="text-metal-subtext text-sm">
                  <p>+86-13813096295</p>
                  <p>400-886-6884</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <FaEnvelope className="text-steel mt-1 flex-shrink-0" size={14} />
                <a
                  href="mailto:sales@ruchengmachine.com"
                  className="text-metal-subtext text-sm hover:text-steel transition-colors"
                >
                  sales@ruchengmachine.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-steel mt-1 flex-shrink-0" size={14} />
                <p className="text-metal-subtext text-sm">
                  Shiqiu Industrial Park, Lishui District, Nanjing, Jiangsu, China
                </p>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-card flex items-center justify-center text-metal-subtext hover:text-steel hover:bg-white/5 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-card flex items-center justify-center text-metal-subtext hover:text-steel hover:bg-white/5 transition-all duration-200"
                aria-label="Facebook"
              >
                <FaFacebook size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-metal-subtext text-sm">
              &copy; {new Date().getFullYear()} Nanjing Rucheng Technology Co., Ltd. All rights reserved.
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
