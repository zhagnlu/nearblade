import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Equipment", path: "/equipment" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path + "/"));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`site-chrome fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "site-header-scrolled backdrop-blur-sm shadow-lg"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-steel rounded-card flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-metal-text font-semibold text-sm leading-tight">RUCHENG</p>
              <p className="text-metal-subtext text-xs">TECHNOLOGY</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 relative group ${
                  isActive(item.path)
                    ? "text-steel"
                    : "text-metal-subtext hover:text-metal-text"
                }`}
              >
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-steel transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link
              to="/contact"
              className="inline-flex items-center px-5 py-2.5 bg-steel text-white text-sm font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Quote
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-metal-text p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-industrial border-t border-border">
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-card text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-steel/10 text-steel"
                    : "text-metal-subtext hover:text-metal-text hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="block mt-4 px-4 py-3 bg-steel text-white text-sm font-medium rounded-card text-center"
            >
              Get Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
