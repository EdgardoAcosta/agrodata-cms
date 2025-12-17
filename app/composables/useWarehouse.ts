import type { Ref } from "vue";
import type {
  ScannedProduct,
  ScanResult,
  InventoryItem,
} from "~~/types/warehouse";

export type { ScannedProduct, ScanResult, InventoryItem };

/**
 * Composable for warehouse inventory management and product scanning
 */
export const useWarehouse = () => {
  const scanHistory = ref<ScanResult[]>([]);
  const currentProduct = ref<ScannedProduct | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Look up a product by barcode or SKU
   */
  const lookupProductByCode = async (
    code: string
  ): Promise<ScannedProduct | null> => {
    isLoading.value = true;
    error.value = null;

    try {
      // Look up product by barcode/SKU using warehouse endpoint
      const response = await $fetch<{ data: ScannedProduct }>(
        `/api/warehouse/inventory/barcode/${code}`,
        {
          method: "GET",
        }
      );

      return response.data;
    } catch (err: any) {
      if (err.statusCode === 404) {
        // Product not found
        return null;
      }
      error.value = err.message || "Error looking up product";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Get inventory information for a product
   */
  const getInventory = async (productId: number): Promise<InventoryItem> => {
    try {
      const response = await $fetch<{ data: InventoryItem }>(
        `/api/warehouse/inventory/${productId}`
      );
      return response.data;
    } catch (err: any) {
      // If no inventory record exists, return default
      return {
        productId,
        quantity: 0,
      };
    }
  };

  /**
   * Update inventory count for a product
   */
  const updateInventoryCount = async (
    productId: number,
    quantity: number,
    location?: string
  ): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      await $fetch(`/api/warehouse/inventory/${productId}`, {
        method: "PATCH",
        body: {
          quantity,
          location,
          lastCounted: new Date().toISOString(),
        },
      });
    } catch (err: any) {
      error.value = err.message || "Error updating inventory";
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Add a scan to the history
   */
  const addScanToHistory = (
    barcode: string,
    format: string,
    product?: ScannedProduct
  ) => {
    const scan: ScanResult = {
      barcode,
      format,
      timestamp: new Date().toISOString(),
      product,
    };

    // Add to beginning of array
    scanHistory.value.unshift(scan);

    // Keep only last 20 scans
    if (scanHistory.value.length > 20) {
      scanHistory.value = scanHistory.value.slice(0, 20);
    }
  };

  /**
   * Clear scan history
   */
  const clearHistory = () => {
    scanHistory.value = [];
    currentProduct.value = null;
  };

  /**
   * Handle a scanned code
   */
  const handleScan = async (code: string, format: string) => {
    try {
      const product = await lookupProductByCode(code);

      if (product) {
        // Get inventory information
        const inventory = await getInventory(product.id);
        product.inventory = inventory;
        currentProduct.value = product;
      } else {
        currentProduct.value = null;
      }

      addScanToHistory(code, format, product || undefined);

      return product;
    } catch (err) {
      console.error("Error handling scan:", err);
      throw err;
    }
  };

  return {
    // State
    scanHistory: readonly(scanHistory),
    currentProduct: readonly(currentProduct),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    lookupProductByCode,
    getInventory,
    updateInventoryCount,
    addScanToHistory,
    clearHistory,
    handleScan,
  };
};
