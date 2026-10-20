import { PageHero } from "@/components/common/PageHero";
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { PageMeta } from "@/components/common/PageMeta";
import { getProductById, productCategories } from "@/data/products";
import { ContactForm } from "@/components/generated/ContactForm";
import { ProductSelectionGuide } from "@/components/common/ProductSelectionGuide";
import { productGuides } from "@/data/productGuides";
import { BladeDimensionDrawing } from "@/components/common/BladeDimensionDrawing";
import { ToolingProfileDrawing } from "@/components/common/ToolingProfileDrawing";
import NotFound from "./NotFound";
import { FaArrowLeft, FaCheck, FaArrowRight, FaTimes, FaSearchPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const category = productCategories.find((c) => c.products.some((p) => p.id === id));
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const zoomDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsZoomed(false);
  }, [id]);

  useEffect(() => {
    if (!isZoomed) return;
    zoomDialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isZoomed]);

  if (!product) {
    return <NotFound />;
  }

  const parent = getProductById(product.parentId || "");
  const children = category?.products.filter(item => item.parentId === product.id) || [];
  const baseGuide = productGuides[product.id] || productGuides[product.parentId || ""];
  const guide = baseGuide && product.id === "cp-thin-slitter" ? productGuides["sk-001"] : baseGuide;
  const productImages = [...new Set(product.images?.length ? product.images : [product.image])];
  const currentImage = productImages[currentImageIndex] || productImages[0];
  const relatedProducts = category?.products.filter((p) => p.id !== product.id).slice(0, 3) || [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <PageMeta
        image={product.image}
        breadcrumbs={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }, ...(parent ? [{ name: parent.name, path: `/products/${parent.id}` }] : []), { name: product.name, path: `/products/${product.id}` }]}
        structuredData={{ "@type": "Product", name: product.name, description: product.description, image: [product.image], sku: product.id, brand: { "@type": "Brand", name: "Nearblade" }, category: category?.name, material: product.materials }}
      />

      <PageHero
        image={product.heroImage || product.image}
        productVisual={!product.heroImage}
        title={product.searchName || product.name}
        accent="Made to Your Drawing"
        description={product.description}
        contentId="product-content"
        primaryAction={{ label: "View Specifications", to: "#product-content" }}
        secondaryAction={{ label: "Request Quote", to: "/contact" }}
        visual={product.toolingProfile ? <ToolingProfileDrawing profile={product.toolingProfile} dark /> : undefined}
      />

      <section id="product-content" className="product-detail-surface scroll-mt-20 py-section-mobile md:py-section bg-industrial">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/products"
            className="inline-flex items-center text-metal-subtext hover:text-steel transition-colors mb-8"
          >
            <FaArrowLeft className="mr-2" size={12} />
            Back to Products
          </Link>
          {parent && <Link to={`/products/${parent.id}`} className="block text-steel mb-8 hover:underline">{parent.name}</Link>}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              {product.mediaMode === "specification" ? (
                <div className="rounded-card border border-border p-5 sm:p-8 bg-industrial-secondary">
                  <h2 className="text-2xl text-metal-text mb-4">Dimensions &amp; Fit</h2>
                  {guide?.toolingProfile ? <ToolingProfileDrawing profile={guide.toolingProfile} /> : guide && !["pb-quick-clamps", "db-holders"].includes(product.id) && <BladeDimensionDrawing kind={guide.drawing === "toothed" && product.id === "cp-thin-slitter" ? "circular" : product.id.startsWith("sk-") ? "circular" : guide.drawing} />}
                  <p className="text-metal-subtext text-sm leading-relaxed mb-6">Dimension reference, not to scale. Letters identify dimensions to include in your drawing; they do not define a standard size or manufacturing drawing.</p>
                  <h3 className="text-metal-text font-semibold mb-3">Selection Requirements</h3>
                  <ul className="space-y-3">{product.selectionFields?.map(field => <li key={field} className="border-b border-border pb-3 text-metal-subtext">{field}</li>)}</ul>
                </div>
              ) : <>
              <div className="relative group">
                <div
                  className={`aspect-[3/2] ${product.heroImage ? "product-photo-stage" : "product-stage"} rounded-card overflow-hidden border border-border relative cursor-pointer`}
                  onClick={() => setIsZoomed(true)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Enlarge ${product.name} image`}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setIsZoomed(true);
                    }
                  }}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={currentImage}
                    alt={`${product.name} product overview`}
                    className={`w-full h-full ${product.galleryFit === "cover" ? "object-cover" : "object-contain"} group-hover:scale-105 transition-transform duration-500`}
                  />
                  <div className="absolute inset-0 bg-industrial/0 group-hover:bg-industrial/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-steel/90 rounded-full w-14 h-14 flex items-center justify-center">
                      <FaSearchPlus className="text-white" size={20} />
                    </div>
                  </div>
                </div>

                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-industrial-secondary/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-metal-text hover:text-steel hover:border-steel transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-industrial-secondary/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center text-metal-text hover:text-steel hover:border-steel transition-all duration-200 lg:opacity-0 lg:group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Next image"
                    >
                      <FaChevronRight size={14} />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-industrial-secondary/80 backdrop-blur-sm border border-border rounded-full">
                      <span className="text-metal-subtext text-xs">
                        {currentImageIndex + 1} / {productImages.length}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      aria-label="Show product overview"
                      aria-pressed={index === currentImageIndex}
                      className={`flex-shrink-0 w-20 h-20 rounded-card overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? "border-steel shadow-lg shadow-steel/20"
                          : "border-border hover:border-steel/50"
                      }`}
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={img}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              <p className="text-metal-subtext text-sm mt-3 text-center">{"Product overview"}. Select image to enlarge.</p>
              </>}
            </div>

            <div>
              {category && (
                <span className="text-steel text-sm font-medium uppercase tracking-wider">
                  {category.name}
                </span>
              )}
              <h2 className="text-3xl lg:text-h2 text-metal-text mt-2 mb-4">{product.name}</h2>
              <p className="text-metal-subtext leading-relaxed mb-8">{product.description}</p>
              {guide?.role && <p className="text-steel font-medium mb-4">{guide.role}</p>}
              {guide?.process && <p className="text-metal-subtext leading-relaxed mb-8">{guide.process}</p>}

              <div className="space-y-6">
                {!product.mediaMode && !!product.selectionFields?.length && <div>
                  <h3 className="text-metal-text font-semibold mb-3">Selection Requirements</h3>
                  <ul className="space-y-2 text-metal-subtext">{product.selectionFields.map(field => <li key={field}>{field}</li>)}</ul>
                </div>}
                {!!product.variants?.length && (
                  <div>
                    <h3 className="text-metal-text font-semibold mb-3">Product Types</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-metal-subtext">
                      {product.variants.map(type => <li key={type} className="border border-border rounded-card px-3 py-2">{type}</li>)}
                    </ul>
                  </div>
                )}
                {!!product.machineModels?.length && (
                  <div>
                    <h3 className="text-metal-text font-semibold mb-3">Machine Models</h3>
                    <p className="text-metal-subtext leading-relaxed" translate="no">{product.machineModels.join(" · ")}</p>
                  </div>
                )}
                {!!product.feedstocks?.length && (
                  <div>
                    <h3 className="text-metal-text font-semibold mb-3">Processed Materials</h3>
                    <ul className="flex flex-wrap gap-2 text-metal-subtext">{product.feedstocks.map(item => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
                <div>
                  <h3 className="text-metal-text font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-metal-subtext">
                        <FaCheck className="text-steel flex-shrink-0" size={12} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {!!product.materials.length && <div>
                  <h3 className="text-metal-text font-semibold mb-3">Materials Available</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material) => (
                      <span
                        key={material}
                        className="px-3 py-1.5 bg-industrial-secondary border border-border text-metal-subtext text-sm rounded"
                      >
                        {material}
                      </span>
                    ))}
                  </div>
                </div>}

                <div>
                  <h3 className="text-metal-text font-semibold mb-3">Precision &amp; Tolerance</h3>
                  <p className="text-steel font-mono text-2xl">{product.tolerance}</p>
                  <p className="text-sm text-metal-subtext leading-relaxed mt-2">Specify the controlled dimension, datum and inspection method on your drawing. The applicable tolerance is confirmed with your quotation.</p>
                </div>
              </div>

              <Link
                to="/contact"
                className="inline-flex items-center mt-8 px-8 py-4 bg-steel text-white font-medium rounded-card hover:bg-steel-light transition-all duration-200 hover:-translate-y-0.5"
              >
                Request Quote
                <FaArrowRight className="ml-2" size={14} />
              </Link>
            </div>
          </div>

          {!!children.length && <section className="mb-16" aria-label="Products in this series">
            <h2 className="text-2xl font-semibold text-metal-text mb-6">Products in This Series</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children.map(item => <Link key={item.id} to={`/products/${item.id}`} className="border border-border rounded-card p-6 hover:border-steel transition-colors">
              <h3 className="text-lg text-metal-text font-semibold mb-2">{item.name}</h3><p className="text-metal-subtext text-sm leading-relaxed mb-4">{item.description}</p><span className="text-steel text-sm">View Details</span>
            </Link>)}</div>
          </section>}

          <div className="product-detail-specs rounded-card border border-border p-5 sm:p-8 mb-16">
            <h2 className="text-2xl font-semibold text-metal-text mb-6">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-metal-text font-medium mb-4">Applications</h3>
                <ul className="space-y-2">
                  {product.applications.map((app, index) => (
                    <li key={index} className="flex items-center gap-3 text-metal-subtext">
                      <div className="w-1.5 h-1.5 bg-steel rounded-full" />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
              {!!product.materials.length ? <div>
                <h3 className="text-metal-text font-medium mb-4">Material Options</h3>
                <div className="space-y-3">
                  {product.materials.map((material) => (
                    <div key={material} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-metal-subtext">{material}</span>
                      <span className="text-steel text-sm">Available</span>
                    </div>
                  ))}
                </div>
              </div> : <div><h3 className="text-metal-text font-medium mb-4">Material Selection</h3><p className="text-metal-subtext leading-relaxed">Material and treatment are selected after reviewing the application, machine and approved drawing.</p></div>}
            </div>
          </div>

          {guide && product.id !== "db-holders" && <ProductSelectionGuide guide={guide} showDrawing={product.id !== "pb-001" && (!guide.toolingProfile || product.mediaMode !== "specification")} />}

          {relatedProducts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-semibold text-metal-text mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    to={`/products/${related.id}`}
                    className="product-detail-related group border border-border rounded-card overflow-hidden hover:border-steel/50 transition-all duration-300"
                  >
                    {related.mediaMode !== "specification" && <div className="aspect-[4/3] overflow-hidden product-stage">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>}
                    <div className="p-4">
                      <h3 className="text-metal-text font-medium group-hover:text-steel transition-colors">
                        {related.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-inquiry rounded-card border border-border p-5 sm:p-8">
            <h2 className="text-2xl font-semibold text-metal-text mb-2 text-center">Request a Quote</h2>
            <p className="text-metal-subtext text-center mb-8">
              Tell us about your requirements and we will get back to you within 24 hours.
            </p>
            <ContactForm key={product.id} initialSubject={`Quotation request: ${product.name}`} />
          </div>
        </div>
      </section>

      {isZoomed && (
        <dialog
          ref={zoomDialog}
          aria-label={`${product.name} enlarged image`}
          onCancel={() => setIsZoomed(false)}
          className="fixed inset-0 m-0 w-screen h-[100svh] max-w-none max-h-none border-0 z-[100] bg-industrial/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-industrial-secondary border border-border rounded-full flex items-center justify-center text-metal-text hover:text-steel hover:border-steel transition-all duration-200"
            aria-label="Close"
          >
            <FaTimes size={18} />
          </button>

          {productImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-industrial-secondary border border-border rounded-full flex items-center justify-center text-metal-text hover:text-steel hover:border-steel transition-all duration-200"
                aria-label="Previous image"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-industrial-secondary border border-border rounded-full flex items-center justify-center text-metal-text hover:text-steel hover:border-steel transition-all duration-200"
                aria-label="Next image"
              >
                <FaChevronRight size={16} />
              </button>
            </>
          )}

          <img

            loading="lazy"

            decoding="async"
            src={currentImage}
            alt={`${product.name} - View ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {productImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                    index === currentImageIndex ? "bg-steel w-8" : "bg-metal-subtext/50 hover:bg-metal-subtext"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </dialog>
      )}
    </>
  );
}
