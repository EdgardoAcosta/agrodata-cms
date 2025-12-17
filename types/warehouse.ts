/**
 * Warehouse and Scanner Type Definitions
 * Shared types for inventory, products, and scanning functionality
 */

export interface InventoryItem {
  id?: number;
  productId: number;
  quantity: number;
  location?: string;
  minStock?: number;
  maxStock?: number;
  lastCounted?: string;
  restockPoint?: number;
}

export interface ScannedProduct {
  // Core fields from warehouse inventory endpoint
  id: number;
  name: string;
  sku: string;
  barcode: string;

  // Computed/derived fields
  slug: string;
  inStock: boolean;

  // Default fields (not from API)
  price: number;
  currency: string;

  // Optional fields (may be added later or from different endpoints)
  shortDescription?: string;
  description?: string;
  image?: string;
  inventory?: InventoryItem;
  categories?: Array<{ id: number; name: string }>;
  labels?: Array<{ id: number; name: string }>;
}

export interface ScanResult {
  barcode: string;
  format: string;
  timestamp: Date | string;
  product?: ScannedProduct;
}

export interface ScanHistory extends ScanResult {
  id: string;
  timestamp: Date;
}

export interface InventoryTransaction {
  id: number;
  inventoryId: number;
  transactionType: "in" | "out" | "adjustment" | "waste" | "transfer" | "count";
  quantityBefore: number;
  quantity: number;
  comments?: string;
  createdBy?: string;
  createdAt: string;
}

export interface InventoryTransactionsResponse {
  data: InventoryTransaction[];
  limit: number;
  page: number;
  total: number;
}
