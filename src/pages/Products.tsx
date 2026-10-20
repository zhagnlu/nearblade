import { PageHero } from "@/components/common/PageHero";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { productCategories } from "@/data/products";
import { FaArrowRight, FaFilter } from "react-icons/fa";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get("category");
    setSelectedCategory(productCategories.some(item => item.id === category) ? category : null);
  }, [searchParams]);

  const handleCategoryChange = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const filteredCategories = selectedCategory
    ? productCategories.filter((c) => c.id === selectedCategory)
    : productCategories;

  return (
    <>
      <PageMeta />

      <PageHero
        image="/images/catalog-hero.jpg"
        title="Industrial Blades"
        accent="& Press Brake Tooling"
        description="Compare industrial blades and tooling by cutting process, material and machine. Select a product to review dimensions, mounting details and quotation requirements."
        contentId="products-content"
        primaryAction={{ label: "Browse Products", to: "#products-content" }}
        secondaryAction={{ label: "Request Quote", to: "/contact" }}
      />

      <section id="products-content" className="catalog-surface scroll-mt-20 py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="catalog-filter mb-12 p-5 sm:p-7 rounded-card border border-border">
            <div className="flex items-center gap-2 mb-4">
              <FaFilter className="text-steel" size={14} />
              <span className="text-metal-subtext text-sm">Filter by Category</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-4 py-2 rounded-card text-sm font-medium transition-all duration-200 ${
                  !selectedCategory
                    ? "bg-steel text-white"
                    : "bg-industrial-secondary text-metal-subtext hover:text-metal-text border border-border hover:border-steel/50"
                }`}
              >
                All Products
              </button>
              {productCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-card text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-steel text-white"
                      : "bg-industrial-secondary text-metal-subtext hover:text-metal-text border border-border hover:border-steel/50"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-16">
            {filteredCategories.map((category, index) => (
              <div key={category.id} id={category.id} className={`catalog-category catalog-tone-${index % 2} scroll-mt-24 p-5 sm:p-8 lg:p-10 rounded-card`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-steel/10 rounded-card flex items-center justify-center">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain rounded-card"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-metal-text">{category.name}</h2>
                    <p className="text-metal-subtext text-sm">{category.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {category.products.filter(product => !product.parentId).map((product) => (
                    <div key={product.id}>
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className="catalog-card group grid grid-cols-1 md:grid-cols-2 bg-industrial-secondary border border-border rounded-card overflow-hidden hover:border-steel/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-steel/5"
                    >
                      <div className="aspect-[4/3] overflow-hidden product-stage">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="catalog-card-content p-6">
                        <h3 className="text-lg font-semibold text-metal-text mb-2 group-hover:text-steel transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-metal-subtext text-sm line-clamp-2 mb-4">{product.description}</p>
                        {!!product.variants?.length && <div className="mb-4"><h4 className="text-sm font-semibold text-metal-text mb-2">Product Types</h4><ul className="flex flex-wrap gap-2">{product.variants.map(type => <li key={type} className="text-xs border border-border rounded px-2 py-1 text-metal-subtext">{type}</li>)}</ul></div>}
                        {!!product.machineModels?.length && <div className="mb-4"><h4 className="text-sm font-semibold text-metal-text mb-2">Machine Models</h4><p className="text-xs text-metal-subtext leading-relaxed" translate="no">{product.machineModels.join(" · ")}</p></div>}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.materials.slice(0, 2).map((material) => (
                            <span
                              key={material}
                              className="px-2 py-1 bg-industrial text-metal-subtext text-xs rounded"
                            >
                              {material}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-steel text-sm font-medium">
                          <span>View Details</span>
                          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                        </div>
                      </div>
                    </Link>
                    {category.products.some(item => item.parentId === product.id) && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {category.products.filter(item => item.parentId === product.id).map(item => (
                          <Link key={item.id} to={`/products/${item.id}`} className="catalog-subproduct flex items-center justify-between gap-4 rounded-card border border-border p-5 text-metal-text hover:border-steel transition-colors">
                            <span className="font-medium">{item.name}</span><FaArrowRight className="text-steel shrink-0" size={12} />
                          </Link>
                        ))}
                      </div>
                    )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
