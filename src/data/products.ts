export interface Product {
  id: string;
  name: string;
  searchName?: string;
  category: string;
  description: string;
  features: string[];
  materials: string[];
  tolerance: string;
  applications: string[];
  image: string;
  heroImage?: string;
  images?: string[];
  galleryFit?: "contain" | "cover";
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

const SHEAR_BLADES_IMG = "/images/products/photo-pilot/guillotine-overview-clear-v2.webp";

const PRESS_BRAKE_IMG = "/images/products/category-photos/pb-overview-white-v2.webp";

const ROLLING_SHEAR_IMG = "/images/products/category-photos/rs-001-sego-01-white-v1.webp";

const SLITTING_IMG = "/images/products/category-photos/sk-overview-white-v1.webp";

const TOOTHED_IMG = "/images/products/toothed.webp";

const DOCTOR_IMG = "/images/products/doctor.webp";

export const productCategories: ProductCategory[] = [
  {
    id: "shear-blades",
    name: "Shear Blades",
    description: "High-precision blades for sheet metal shearing machines, delivering clean cuts across various materials.",
    image: SHEAR_BLADES_IMG,
    products: [
      {
        id: "sb-001",
        name: "Guillotine Shear Blades",
        category: "shear-blades",
        description: "Guillotine shear blades for sheet metal cutting and replacement knife sets. Send your Q11 or QC12Y machine details, mounting-hole pattern and blade drawing for a quotation.",
        features: ["Sharp edge with wear resistance", "Clean cuts without burrs", "Up to 8 meters length", "HRC 58-62 hardness"],
        materials: ["9CrSi", "5CrW2Si", "6CrW2Si", "CrWMn", "Cr12MoV", "H13", "H13K", "W18Cr4V"],
        tolerance: "±0.003mm",
        applications: ["Sheet metal fabrication", "Automotive manufacturing", "HVAC ductwork", "Steel processing"],
        image: SHEAR_BLADES_IMG,
        heroImage: "/images/products/photo-pilot/guillotine-hero-navy-v4.webp",
        images: [SHEAR_BLADES_IMG, "/images/products/photo-pilot/guillotine-three-white-v3.webp", "/images/products/photo-pilot/guillotine-hero-white-v3.webp"],
      },
      {
        id: "sb-002",
        name: "Swing Beam Shear Blades",
        category: "shear-blades",
        description: "Swing beam shear blades for replacement knife sets in sheet-metal production. Confirm the machine model, mounting face and cutting-edge geometry with your drawing.",
        features: ["Long service life", "Consistent cutting quality", "Easy installation", "Precision ground edge"],
        materials: ["6CrW2Si", "Cr12MoV", "H13"],
        tolerance: "±0.003mm",
        applications: ["Metal processing centers", "Steel service centers", "Heavy plate cutting"],
        image: SHEAR_BLADES_IMG,
        heroImage: "/images/products/category-photos/sb-002-hero-navy-v1.webp",
        images: [SHEAR_BLADES_IMG, "/images/products/photo-pilot/guillotine-three-white-v3.webp"],
      },
    ],
  },
  {
    id: "press-brake-tooling",
    name: "Press Brake Tooling",
    description: "Complete range of press brake dies and punches for precise sheet metal bending operations.",
    image: PRESS_BRAKE_IMG,
    products: [
      {
        id: "pb-001",
        name: "Standard V-Die Set",
        searchName: "Press Brake V Dies",
        category: "press-brake-tooling",
        description: "Press brake V dies for sheet-metal bending, with tooling specified to your drawing. Share the V opening, working height and clamping interface for a quotation.",
        features: ["85° included angle", "Multiple V openings", "Precision ground", "Quick clamp system available"],
        materials: ["42CrMo", "Cr12MoV"],
        tolerance: "±0.01mm",
        applications: ["General sheet metal bending", "Box and pan forming", "90°/60°/45°/30° bending", "Container manufacturing"],
        image: PRESS_BRAKE_IMG,
        heroImage: "/images/products/category-photos/pb-hero-v1.webp",
        images: [PRESS_BRAKE_IMG],
      },
    ],
  },
  {
    id: "rolling-shear-blades",
    name: "Rolling Shear Blades",
    description: "Circular and curved blades for rolling shear machines used in plate cutting operations.",
    image: ROLLING_SHEAR_IMG,
    products: [
      {
        id: "rs-001",
        name: "Circular Shear Blades",
        category: "rolling-shear-blades",
        description: "Circular shear blades for rolling-shear and plate-cutting applications. Request custom diameters and confirm the complete knife-set arrangement with your machine drawing.",
        features: ["Balanced rotation", "Wear-resistant edge", "Custom diameters", "High precision thickness tolerance"],
        materials: ["Cr12MoV", "H13", "SKD-11"],
        tolerance: "±0.005mm",
        applications: ["Plate cutting", "Coil processing lines", "Steel rolling mills"],
        image: ROLLING_SHEAR_IMG,
        heroImage: "/images/products/category-photos/rs-hero-v1.webp",
        galleryFit: "cover",
        images: [ROLLING_SHEAR_IMG, "/images/products/category-photos/rs-001-sego-02-white-v1.webp"],
      },
    ],
  },
  {
    id: "slitting-knives",
    name: "Slitting Knives",
    description: "Rotary slitting knives for paper, film and foil converting applications.",
    image: SLITTING_IMG,
    products: [
      {
        id: "sk-001",
        name: "Rotary Slitting Knives",
        category: "slitting-knives",
        description: "Rotary slitting knives, also called rotary slitter knives, for paper, film, aluminum foil, copper foil and tape. Share your drawing for a custom quotation.",
        features: ["Precision edge geometry", "Extended tool life", "Low cutting resistance", "Micron-level accuracy available"],
        materials: ["SKD-11", "SKH-51", "Cr12MoV", "W6Mo5Cr4V2", "W18Cr4V", "LD"],
        tolerance: "±0.001mm",
        applications: ["Paper slitting", "Film cutting", "Foil processing", "Tube manufacturing lines"],
        image: SLITTING_IMG,
        heroImage: "/images/products/category-photos/sk-hero-v1.webp",
        images: [SLITTING_IMG, "/images/products/category-photos/sk-edge-white-v1.webp"],
      },
    ],
  },
  {
    id: "toothed-blades",
    name: "Toothed Blades",
    description: "Serrated and toothed blades for corrugated packaging, paper converting, and textile industries.",
    image: TOOTHED_IMG,
    products: [
      {
        id: "tb-001",
        name: "Corrugated Cutting Blades",
        category: "toothed-blades",
        description: "Corrugated cutting blades for board trimming and slotting. Share the tooth profile, mounting dimensions and machine details for replacement or custom toothed blades.",
        features: ["Precision tooth profile", "Heat-treated edge", "Custom tooth counts", "Clean edge cutting"],
        materials: ["SK2", "SUS-440C", "420-J2", "TC", "SKD-11", "SKH"],
        tolerance: "±0.02mm",
        applications: ["Corrugated packaging", "Paper converting", "Packaging machinery", "Food processing machinery"],
        image: "/images/products/toothed.webp",
        images: [TOOTHED_IMG],
      },
    ],
  },
  {
    id: "doctor-blades",
    name: "Doctor Blades",
    description: "Precision doctor blades for printing, coating, and ink management systems.",
    image: DOCTOR_IMG,
    products: [
      {
        id: "db-001",
        name: "Lamella Doctor Blades",
        category: "doctor-blades",
        description: "Lamella doctor blades for flexographic and gravure printing, coating and ink metering. Specify the blade holder, edge profile and strip or coil delivery format.",
        features: ["Consistent ink film", "Corrosion resistant", "Long blade life", "Multiple material options"],
        materials: ["Stainless steel", "Carbon steel", "Blue steel", "Ceramic"],
        tolerance: "±0.005mm",
        applications: ["Flexographic printing", "Gravure printing", "UV coating", "Decorative printing", "Coating lines"],
        image: DOCTOR_IMG,
        images: [DOCTOR_IMG],
      },
    ],
  },
];

export const getAllProducts = (): Product[] => {
  return productCategories.flatMap((cat) => cat.products);
};

export const getProductById = (id: string): Product | undefined => {
  return getAllProducts().find((p) => p.id === id);
};

export const getCategoryById = (id: string): ProductCategory | undefined => {
  return productCategories.find((c) => c.id === id);
};
