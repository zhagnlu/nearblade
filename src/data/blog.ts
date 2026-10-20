export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  productId: string;
  relatedProductIds: string[];
  sections: { heading: string; paragraphs: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "custom-blade-inquiry-guide",
    title: "Custom Industrial Blade Quote: What to Include",
    category: "Buying Guide",
    excerpt: "Prepare the application details, drawings and quantities that help a supplier understand your blade requirements.",
    image: "/images/products/guillotine.webp",
    productId: "sb-001",
    relatedProductIds: ["sb-001", "pb-001", "sk-001"],
    sections: [
      { heading: "Start with the application", paragraphs: ["Describe the material being cut and the machine on which the blade will be used. Include the machine manufacturer and model when available. A replacement part number can provide context, but a drawing or clear photographs help communicate the actual component.", "Explain what you want to improve: replacement availability, cut appearance, installation fit or maintenance planning. Giving that context makes the conversation more useful than requesting a material grade alone."] },
      { heading: "Make the geometry clear", paragraphs: ["Provide a dimensioned drawing showing the overall size, mounting holes, slots and cutting-edge profile. If you only have a sample, photograph both faces and the edge, and identify which dimensions are known and which still need confirmation.", "Mark the drawing revision and units. For a set of upper and lower knives, identify each component separately. Website illustrations describe a product family; they should not be used as manufacturing drawings."] },
      { heading: "Include the purchasing details", paragraphs: ["State the quantity, whether you need individual knives or complete sets, and the delivery destination. Include your preferred delivery window and any packaging, inspection or documentation requirements.", "When a material or treatment is specified by the machine manufacturer, attach that requirement. Otherwise, explain the operating conditions and ask the supplier to propose an option for review."] },
      { heading: "Confirm before ordering", paragraphs: ["Review the proposed drawing, material, quantity and inspection requirements together before placing an order. Keep the approved revision with the quotation so future replacements can reference the same specification."] },
    ],
  },
  {
    slug: "blade-product-families",
    title: "Types of Industrial Blades: Shear, Slitter & Doctor Blades",
    category: "Product Guide",
    excerpt: "Explore the differences between straight shear blades, circular knives, toothed blades and doctor blades in our catalog.",
    image: "/images/products/slitting.webp",
    productId: "sk-001",
    relatedProductIds: ["sb-001", "rs-001", "sk-001", "sr-001", "cp-001", "tb-002", "db-001", "cb-001", "cr-001", "pb-001"],
    sections: [
      { heading: "Straight shear blades", paragraphs: ["Our shear-blade range includes guillotine and swing-beam knife sets for sheet-metal shearing applications. The long rectangular profile is only a starting point: mounting details, edge geometry and machine compatibility need to be confirmed for each order."] },
      { heading: "Circular shear and slitting knives", paragraphs: ["The catalog groups circular shear blades and rotary slitting knives separately. Both have circular forms, but their intended applications and specified geometry differ. Compare the relevant product information and send your drawing rather than selecting a knife by appearance alone."] },
      { heading: "Toothed and doctor blades", paragraphs: ["Our toothed-blade family serves cutting applications associated with packaging and converting. Tooth pattern and mounting configuration are important details to include in an inquiry.", "Doctor blades are listed for printing, coating and ink-management applications. Specify the blade format and the requirements of your printing or coating equipment when discussing an order."] },
      { heading: "Press brake tooling", paragraphs: ["Press brake punches and dies form a separate tooling family for bending operations. Share the machine interface, required profile and your application with the supplier. The product categories help you navigate the range; the final drawing defines the component you order."] },
    ],
  },
  {
    slug: "blade-replacement-planning",
    title: "Industrial Blade Replacement Planning for Production Lines",
    category: "Operations",
    excerpt: "Organize part records, drawing revisions and spare quantities to make replacement purchasing more predictable.",
    image: "/images/products/swing-beam.webp",
    productId: "sb-001",
    relatedProductIds: ["sb-001"],
    sections: [
      { heading: "Build a clear part record", paragraphs: ["Create a record for each blade position on a machine. Include the equipment model, internal part number, approved drawing revision and supplier reference. Label the components of a matched set so purchasing and maintenance teams can identify them consistently."] },
      { heading: "Keep a history of replacements", paragraphs: ["Record when a replacement was installed, the application it served and why it was replaced. This history gives the team a practical basis for discussing spare quantities and purchasing schedules.", "Avoid treating one replacement interval as a universal rule. Operating conditions and machine requirements should remain part of the discussion with your equipment and blade suppliers."] },
      { heading: "Coordinate stock and delivery", paragraphs: ["Review on-hand quantities and current supplier lead times before planned maintenance. Distinguish ready-to-use spares from parts awaiting inspection or supplier work so the stock record reflects what is available."] },
      { heading: "Share useful feedback", paragraphs: ["When discussing a replacement, include photographs, the relevant drawing and a concise description of the operating conditions. Separate confirmed observations from assumptions. Follow the equipment manufacturer's procedures for inspection, installation and adjustment."] },
    ],
  },
];

export const getBlogPost = (slug: string) => blogPosts.find(post => post.slug === slug);
