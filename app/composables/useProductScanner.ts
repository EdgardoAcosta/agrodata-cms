/**
 * Product Scanner Composable
 * Handles barcode scanning logic, product lookup, and scanner state management
 */
import type { Ref } from "vue";
import { ref, computed } from "vue";
import type {
  ScannedProduct,
  ScanResult,
  ScanHistory,
} from "~~/types/warehouse";

export type ScannerState =
  | "idle"
  | "scanning"
  | "found"
  | "not-found"
  | "error";

export type { ScannedProduct, ScanResult, ScanHistory };

export function useProductScanner() {
  // State
  const state = ref<ScannerState>("idle");
  const currentBarcode = ref<string>("");
  const currentProduct = ref<ScannedProduct | null>(null);
  const scanHistory = ref<ScanHistory[]>([]);
  const error = ref<string>("");
  const isLoading = ref(false);

  // Settings
  const continuousMode = ref(false);
  const audioEnabled = ref(true);
  const vibrationEnabled = ref(true);

  // Computed
  const hasProduct = computed(
    () => state.value === "found" && currentProduct.value !== null
  );
  const hasError = computed(
    () => state.value === "error" || state.value === "not-found"
  );

  /**
   * Look up product by barcode
   */
  async function lookupProduct(
    barcode: string
  ): Promise<ScannedProduct | null> {
    try {
      isLoading.value = true;
      error.value = "";

      // Try warehouse inventory lookup first
      const { data, error: fetchError } = await useFetch(
        `/api/warehouse/inventory/barcode/${encodeURIComponent(barcode)}`
      );

      if (fetchError.value) {
        console.error("Lookup error:", fetchError.value);
        return null;
      }

      // Extract product and inventory from nested response
      // Response structure: { data: { id, productId, quantity, location, ..., product: { id, name, sku, barcode } } }
      // Note: Product object only contains minimal data (id, name, sku, barcode)
      const responseData = data.value as any;
      const inventoryData = responseData?.data;
      const productData = inventoryData?.product;

      if (!productData) {
        console.log("No product data in response");
        return null;
      }

      // Build ScannedProduct with minimal product data from API
      // Only includes fields returned by the warehouse inventory endpoint
      const scannedProduct: ScannedProduct = {
        id: productData.id,
        name: productData.name,
        slug: productData.name.toLowerCase(),
        sku: productData.sku,
        barcode: productData.barcode,
        price: 0, // Not provided by inventory endpoint
        currency: "MXN", // Default
        inStock: (inventoryData?.quantity || 0) > 0,
        inventory: inventoryData
          ? {
              id: inventoryData.id,
              productId: inventoryData.productId,
              quantity: inventoryData.quantity,
              location: inventoryData.location,
              lastCounted: inventoryData.lastCounted,
            }
          : undefined,
      };

      console.log("Parsed product:", scannedProduct);
      return scannedProduct;
    } catch (err) {
      console.error("Product lookup failed:", err);
      error.value = "Failed to lookup product";
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Process a scanned barcode
   */
  async function processBarcode(barcode: string, format: string = "unknown") {
    if (!barcode || barcode === currentBarcode.value) {
      return; // Ignore empty or duplicate scans
    }

    state.value = "scanning";
    currentBarcode.value = barcode;
    error.value = "";

    // Provide immediate feedback
    provideFeedback();

    // Look up the product
    const product = await lookupProduct(barcode);

    if (product) {
      state.value = "found";
      currentProduct.value = product;
      addToHistory({
        barcode,
        format,
        timestamp: new Date(),
        product,
      });
    } else {
      state.value = "not-found";
      currentProduct.value = null;
      addToHistory({
        barcode,
        format,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Add scan to history
   */
  function addToHistory(result: ScanResult) {
    const historyItem: ScanHistory = {
      ...result,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp:
        result.timestamp instanceof Date
          ? result.timestamp
          : new Date(result.timestamp),
    };

    scanHistory.value.unshift(historyItem);

    // Keep only last 10 items
    if (scanHistory.value.length > 10) {
      scanHistory.value = scanHistory.value.slice(0, 10);
    }
  }

  /**
   * Provide haptic and audio feedback
   */
  function provideFeedback() {
    // Haptic feedback (mobile)
    if (vibrationEnabled.value && "vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // Audio feedback
    if (audioEnabled.value) {
      playBeep();
    }
  }

  /**
   * Play beep sound
   */
  function playBeep() {
    try {
      const audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (err) {
      console.warn("Audio feedback failed:", err);
    }
  }

  /**
   * Reset scanner state
   */
  function reset() {
    state.value = "idle";
    currentBarcode.value = "";
    currentProduct.value = null;
    error.value = "";
  }

  /**
   * Clear current scan result and prepare for next scan
   */
  function scanAgain() {
    currentBarcode.value = "";
    currentProduct.value = null;
    state.value = "scanning";
  }

  /**
   * Clear scan history
   */
  function clearHistory() {
    scanHistory.value = [];
  }

  /**
   * Get product from history by ID
   */
  function getHistoryItem(id: string): ScanHistory | undefined {
    return scanHistory.value.find((item: ScanHistory) => item.id === id);
  }

  return {
    // State
    state,
    currentBarcode,
    currentProduct,
    scanHistory,
    error,
    isLoading,

    // Settings
    continuousMode,
    audioEnabled,
    vibrationEnabled,

    // Computed
    hasProduct,
    hasError,

    // Methods
    processBarcode,
    lookupProduct,
    reset,
    scanAgain,
    clearHistory,
    getHistoryItem,
    provideFeedback,
  };
}
