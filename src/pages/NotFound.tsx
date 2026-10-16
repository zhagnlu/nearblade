import { Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";

export default function NotFound() {
  return <>
    <PageMeta title="Page Not Found - Nearblade" description="The page you requested could not be found. Browse our industrial blades and tooling or contact our team." noindex />
    <section className="min-h-screen flex items-center justify-center px-6 py-32 text-center">
      <div><p className="text-steel font-mono mb-4">404</p><h1 className="text-3xl text-metal-text font-semibold mb-5">Page Not Found</h1><p className="text-metal-subtext mb-8">Browse our product range or contact us for help finding a blade.</p><Link to="/products" className="inline-flex px-6 py-3 bg-steel text-white rounded-card">Browse Products</Link></div>
    </section>
  </>;
}
