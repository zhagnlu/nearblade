import catalog from "../../content/catalog/products.json";
import type { ToolingProfile } from "@/components/common/ToolingProfileDrawing";
import type { BladeProfile } from "@/components/common/BladeProfileDrawing";

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
  variants?: string[];
  machineModels?: string[];
  feedstocks?: string[];
  parentId?: string;
  mediaMode?: "specification";
  selectionFields?: string[];
  toolingProfile?: ToolingProfile;
  bladeProfile?: BladeProfile;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string;
  image: string;
  products: Product[];
}

export const productCategories: ProductCategory[] = catalog as ProductCategory[];

export const getAllProducts = (): Product[] => productCategories.flatMap(category => category.products);
export const getProductById = (id: string): Product | undefined => getAllProducts().find(product => product.id === id);
export const getCategoryById = (id: string): ProductCategory | undefined => productCategories.find(category => category.id === id);
