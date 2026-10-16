import { BladeDimensionDrawing } from "./BladeDimensionDrawing";
import type { ProductGuide } from "@/data/productGuides";

export function ProductSelectionGuide({ guide }: { guide: ProductGuide }) {
  return (
    <section className="border border-border rounded-card p-5 sm:p-8 mb-16" aria-label="Product dimensions and fit">
      <h2 className="text-2xl font-semibold text-metal-text mb-3">Dimensions &amp; Fit</h2>
      <p className="text-metal-subtext leading-relaxed mb-8">Made to your application and approved drawing. Share the following dimensions so we can confirm a suitable size, material and quotation.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <figure className="bg-industrial-secondary rounded-card p-3 sm:p-5">
          <BladeDimensionDrawing kind={guide.drawing} />
          <figcaption className="text-metal-subtext text-sm leading-relaxed">Dimension reference, not to scale. Letters identify dimensions to include in your drawing; they do not define a standard size or manufacturing drawing.</figcaption>
        </figure>
        <dl className="divide-y divide-border">
          {guide.dimensions.map(item => <div key={item.label} className="py-4 first:pt-0"><dt className="font-semibold text-metal-text mb-2">{item.label}</dt><dd className="text-metal-subtext text-sm leading-relaxed">{item.detail}</dd></div>)}
        </dl>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-border">
        <div><h3 className="font-semibold text-metal-text mb-3">Machine Compatibility</h3><p className="text-sm text-metal-subtext leading-relaxed">{guide.compatibility}</p></div>
        <div><h3 className="font-semibold text-metal-text mb-3">Tolerance &amp; Inspection</h3><ul className="list-disc pl-5 space-y-2 text-sm text-metal-subtext leading-relaxed">{guide.inspection.map(item => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </section>
  );
}
