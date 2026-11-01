import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getProductGroups } from "@/data/products";
import type { Product } from "@/data/products";

export function ProductSeriesNavigation({ family, inCatalog = false }: { family: Product; inCatalog?: boolean }) {
  const groups = getProductGroups(family);
  if (!groups.length) return null;

  return (
    <section id={`${family.id}-products`} className={`product-series-navigation scroll-mt-24 ${inCatalog ? "mt-6" : "mb-16"}`} aria-label="Products in this series">
      {!inCatalog && <h2 className="text-2xl font-semibold text-metal-text mb-6">Products in This Series</h2>}
      <div className="space-y-6">
        {groups.map(group => (
          <div key={group.title} className="product-series-group min-w-0">
            {inCatalog ? <h4 className="font-semibold text-metal-text mb-3">{group.title}</h4> : <h3 className="text-lg font-semibold text-metal-text mb-3">{group.title}</h3>}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.products.map(product => (
                <li key={product.id} className="min-w-0">
                  <Link to={`/products/${product.id}`} className="catalog-subproduct group flex h-full min-w-0 flex-col rounded-card border border-border p-5 text-metal-text hover:border-steel focus-visible:outline focus-visible:outline-2 focus-visible:outline-steel transition-colors">
                    {inCatalog ? <h5 className="font-semibold break-words mb-2">{product.name}</h5> : <h4 className="font-semibold break-words mb-2">{product.name}</h4>}
                    <p className="text-sm text-metal-subtext leading-relaxed mb-4">{product.description}</p>
                    <ul className="flex flex-wrap gap-2 mb-4 text-xs text-metal-subtext">
                      {product.selectionFields?.map(field => <li key={field} className="max-w-full rounded border border-border px-2 py-1 break-words">{field}</li>)}
                    </ul>
                    <span className="mt-auto flex items-center gap-2 text-steel text-sm"><span>View Details</span><FaArrowRight size={12} aria-hidden="true" /></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
