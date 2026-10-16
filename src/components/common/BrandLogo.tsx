import { Link } from "react-router-dom";

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`brand-logo ${className}`} aria-label="Nearblade home">
      <img
        src="/images/brand/nearblade-logo.webp"
        alt="Nearblade"
        width={2172}
        height={724}
        decoding="async"
      />
    </Link>
  );
}
