/**
 * CMS Type Definitions
 * Shared types for categories, labels, products, and related entities
 */

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type Label = {
  id: number;
  name: string;
  description: string;
};

export type ProductPicture = {
  id: number;
  productId: number;
  imageUrl: string;
  displayOrder: number;
};

export type ProductFeature = {
  id: number;
  productId: number;
  featureText: string;
  displayOrder: number;
  feature_text?: string; // backward compat
};

export type ProductSpecification = {
  id: number;
  productId: number;
  specName: string;
  specValue: string;
  createdAt: string;
  spec_name?: string; // backward compat
  spec_value?: string; // backward compat
};

export type ProductTechnicalSpec = {
  id: number;
  productId: number;
  specName: string;
  specValue: string;
  createdAt: string;
  spec_name?: string; // backward compat
  spec_value?: string; // backward compat
};

export type ProductSeoKeyword = {
  id: number;
  productId: number;
  keyword: string;
  createdAt: string;
};

export type ProductRecord = {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  inStock: boolean;
  featured: boolean;
  image: string;
  restockPoint?: number;
  barcode?: string;
  sku?: string;
};

export type Product = ProductRecord & {
  categories: Category[];
  labels: Label[];
  pictures: ProductPicture[];
  features: ProductFeature[];
  specifications: ProductSpecification[];
  technicalSpecs: ProductTechnicalSpec[];
  relatedProductIds: number[];
  seoKeywords: Array<string | { id: number; keyword: string }>;
};

export type Inventory = {
  id: number;
  productId: number;
  quantity: number;
  location?: string;
  lastCounted: string;
};
