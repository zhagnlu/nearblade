import type { Product } from "@/data/products";

export function ProductTypeGroups({ groups, inCatalog = false }: { groups: Product["variantGroups"]; inCatalog?: boolean }) {
  if (!groups?.length) return null;
  return (
    <div className="product-type-groups grid grid-cols-1 sm:grid-cols-2 gap-4">
      {groups.map(group => (
        <div key={group.title} className="min-w-0 border border-border rounded-card p-3">
          {inCatalog ? <h4 className="text-sm font-semibold text-metal-text mb-2">{group.title}</h4> : <h3 className="text-sm font-semibold text-metal-text mb-2">{group.title}</h3>}
          <ul className="space-y-1 text-sm text-metal-subtext break-words">
            {group.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
