<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-caption text-medium-emphasis mb-1">Warehouse</div>
        <h1 class="text-h5">Inventory</h1>
      </v-col>
    </v-row>

    <!-- Barcode Scanner Modal -->
    <BarcodeScannerModal
      v-model="showScannerModal"
      @product-found="handleProductFound"
      @create-product="handleCreateProduct"
      @link-product="handleLinkProduct"
    />

    <!-- Floating Action Button for Scanner -->
    <v-fab
      icon="mdi-barcode-scan"
      color="primary"
      size="large"
      location="bottom end"
      app
      appear
      @click="showScannerModal = true"
    />

    <!-- Inventory Table -->
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>Current Inventory</div>
        <v-btn
          icon
          variant="text"
          size="small"
          @click="loadInventory"
          :loading="loading"
        >
          <v-icon icon="mdi-refresh" />
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table-server
          :headers="headers"
          :items="inventoryItems"
          :loading="loading"
          :items-length="totalItems"
          :items-per-page="itemsPerPage"
          @update:options="handlePaginationChange"
          class="elevation-0"
          :items-per-page-options="[5, 10, 25, 50]"
        >
          <template #item.product="{ item }">
            <div class="d-flex align-center ga-2 py-2">
              <v-avatar size="40" rounded>
                <v-img :src="item.product.image" />
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.product.name }}</div>
                <div class="text-caption text-medium-emphasis">
                  <!--  {{
                    item.product.barcode ||
                    item.product.sku ||
                    `ID: ${item.product.id}`
                  }}
                  -->
                </div>
              </div>
            </div>
          </template>
          <template #item.quantity="{ item }">
            <v-chip
              :color="
                item.quantity === 0
                  ? 'error'
                  : item.quantity < 10
                    ? 'warning'
                    : 'success'
              "
              size="small"
            >
              {{ item.quantity }}
            </v-chip>
          </template>
          <template #item.restockStatus="{ item }">
            <div class="d-flex align-center ga-2">
              <v-chip
                :color="getRestockColor(item)"
                size="small"
                variant="tonal"
              >
                {{ getRestockLabel(item) }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">
                {{ getRestockInfo(item) }}
              </span>
            </div>
          </template>
          <template #item.lastCounted="{ item }">
            <span v-if="item.lastCounted" class="text-caption">
              {{ formatDate(item.lastCounted) }}
            </span>
            <span v-else class="text-caption text-medium-emphasis">Never</span>
          </template>
          <template #item.actions="{ item }">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="viewTransactions(item)"
            >
              <v-icon icon="mdi-history" />
            </v-btn>
          </template>
        </v-data-table-server>
      </v-card-text>
    </v-card>

    <!-- Update Inventory Dialog -->
    <v-dialog v-model="showUpdateDialog" max-width="500">
      <v-card>
        <v-card-title>Update Inventory</v-card-title>
        <v-card-text>
          <v-form ref="updateFormRef" @submit.prevent="handleUpdate">
            <v-text-field
              v-model.number="updateForm.quantity"
              label="Quantity"
              type="number"
              min="0"
              variant="outlined"
              :rules="[(v) => v >= 0 || 'Quantity must be positive']"
            />
            <v-text-field
              v-model="updateForm.location"
              label="Location (optional)"
              variant="outlined"
              placeholder="e.g., Warehouse A, Shelf 3"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showUpdateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="handleUpdate"
            :loading="isUpdating"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Transaction History Dialog -->
    <v-dialog v-model="showTransactionsDialog" max-width="700">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <div>Transaction History</div>
            <div
              v-if="selectedInventory"
              class="text-caption text-medium-emphasis font-weight-regular"
            >
              {{ selectedInventory.product.name }}
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            size="small"
            @click="loadTransactions"
            :loading="loadingTransactions"
          >
            <v-icon icon="mdi-refresh" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!-- Current Inventory Summary -->
          <v-card v-if="selectedInventory" variant="tonal" class="mb-4">
            <v-card-text>
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">
                    Current Quantity
                  </div>
                  <div class="text-h6 font-weight-bold">
                    {{ selectedInventory.quantity }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">Location</div>
                  <div class="text-body-1 font-weight-medium">
                    {{ selectedInventory.location || "N/A" }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">
                    Last Counted
                  </div>
                  <div class="text-body-2">
                    {{
                      selectedInventory.lastCounted
                        ? formatDate(selectedInventory.lastCounted)
                        : "Never"
                    }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">
                    Total Movements
                  </div>
                  <div class="text-body-2 font-weight-medium">
                    {{ transactionsTotal }}
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Transactions List -->
          <div class="text-subtitle-2 mb-2">Recent Movements (Last 10)</div>
          <v-list v-if="transactions.length > 0" lines="three">
            <v-list-item
              v-for="transaction in transactions"
              :key="transaction.id"
              class="px-0"
            >
              <template #prepend>
                <v-avatar
                  :color="
                    transaction.transactionType === 'in' ? 'success' : 'error'
                  "
                  size="40"
                >
                  <v-icon
                    :icon="
                      transaction.transactionType === 'in'
                        ? 'mdi-arrow-down'
                        : 'mdi-arrow-up'
                    "
                  />
                </v-avatar>
              </template>
              <v-list-item-title>
                <span class="font-weight-medium">
                  {{
                    transaction.transactionType === "in"
                      ? "Received"
                      : "Removed"
                  }}
                </span>
                <v-chip size="x-small" class="ml-2" variant="text">
                  {{ transaction.quantity }} units
                </v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                <div class="text-caption">
                  Before: {{ transaction.quantityBefore }} → After:
                  {{
                    transaction.quantityBefore +
                    (transaction.transactionType === "in"
                      ? transaction.quantity
                      : -transaction.quantity)
                  }}
                </div>
                <div
                  v-if="transaction.comments"
                  class="text-caption text-medium-emphasis"
                >
                  {{ transaction.comments }}
                </div>
              </v-list-item-subtitle>
              <template #append>
                <div class="text-caption text-right">
                  <div>{{ formatDate(transaction.createdAt) }}</div>
                  <div
                    v-if="transaction.createdBy"
                    class="text-medium-emphasis"
                  >
                    {{ transaction.createdBy }}
                  </div>
                </div>
              </template>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info" variant="tonal" class="mb-0">
            No transaction history available for this product.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showTransactionsDialog = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type {
  InventoryTransaction,
  InventoryTransactionsResponse,
} from "~~/types/warehouse";

definePageMeta({
  layout: "default",
});

interface Product {
  id: number;
  name: string;
  restockPoint?: number;
  shortDescription?: string;
  price?: number;
  currency?: string;
  inStock?: boolean;
  image?: string;
  barcode?: string;
  sku?: string;
}

interface InventoryWithProduct {
  id: number;
  productId: number;
  quantity: number;
  location?: string;
  lastCounted?: string;
  product: Product;
}

const warehouse = useWarehouse();
const router = useRouter();
const updateFormRef = ref();

// Scanner Modal
const showScannerModal = ref(false);
const loading = ref(false);
const isUpdating = ref(false);
const showUpdateDialog = ref(false);
const inventoryItems = ref<InventoryWithProduct[]>([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);

// Transaction History
const showTransactionsDialog = ref(false);
const loadingTransactions = ref(false);
const transactions = ref<InventoryTransaction[]>([]);
const transactionsTotal = ref(0);
const selectedInventory = ref<InventoryWithProduct | null>(null);

const updateForm = reactive({
  quantity: 0,
  location: "",
});

const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

const headers = [
  { title: "Product", key: "product", sortable: false },
  { title: "Quantity", key: "quantity", sortable: true },
  { title: "Restock", key: "restockStatus", sortable: false },
  { title: "Location", key: "location", sortable: true },
  { title: "Last Counted", key: "lastCounted", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

/**
 * Handle product found from scanner
 */
const handleProductFound = async (product: any) => {
  snackbar.message = `Product found: ${product.name}`;
  snackbar.color = "success";
  snackbar.show = true;
};

/**
 * Handle create new product
 */
const handleCreateProduct = (barcode: string) => {
  showScannerModal.value = false;
  router.push({
    path: "/products/new",
    query: { barcode },
  });
};

/**
 * Handle link barcode to existing product
 */
const handleLinkProduct = async (data: {
  barcode: string;
  productId: number;
}) => {
  try {
    // TODO: Implement API call to link barcode to product
    console.log("Linking barcode to product:", data);
    snackbar.message = "Barcode linked successfully";
    snackbar.color = "success";
    snackbar.show = true;
  } catch (error: any) {
    snackbar.message = error.message || "Error linking barcode";
    snackbar.color = "error";
    snackbar.show = true;
  }
};

const selectProduct = async (product: Product) => {
  // Navigate to product detail or open edit dialog
  router.push(`/products/${product.id}`);
};

const handleUpdate = async () => {
  // TODO: Implement inventory update logic
  console.log("Update inventory:", updateForm);
  showUpdateDialog.value = false;
};

const loadInventory = async (page = 1, perPage = 10) => {
  loading.value = true;
  try {
    // Get inventory items with nested product data
    const { data: response, error: fetchError } = await useFetch<{
      data: {
        items: InventoryWithProduct[];
        total: number;
        page: number;
        itemsPerPage: number;
        pageCount: number;
      };
    }>("/api/warehouse/inventory", {
      query: {
        page,
        itemsPerPage: perPage,
      },
    });

    if (fetchError.value) {
      throw new Error(fetchError.value.message);
    }

    if (response.value) {
      inventoryItems.value = response.value.data.items;
      totalItems.value = response.value.data.total;
      currentPage.value = response.value.data.page;
      itemsPerPage.value = response.value.data.itemsPerPage;
    }
  } catch (error: any) {
    snackbar.message = error.message || "Error loading inventory";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-MX").format(value);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("es-MX", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const getRestockLabel = (item: InventoryWithProduct) => {
  const restockPoint = item.product.restockPoint;
  if (restockPoint == null) return "No definido";
  if (restockPoint <= 0) return "Sin stock";
  if (item.quantity <= 0) return "Sin stock";
  if (item.quantity <= restockPoint) return "Reabastecer";
  return "OK";
};

const getRestockColor = (item: InventoryWithProduct) => {
  const restockPoint = item.product.restockPoint;
  if (restockPoint == null) return "grey";
  if (restockPoint <= 0) return "error";
  if (item.quantity <= 0) return "error";
  if (item.quantity <= restockPoint) return "warning";
  return "success";
};

const getRestockInfo = (item: InventoryWithProduct) => {
  const restockPoint = item.product.restockPoint;
  if (restockPoint == null || restockPoint <= 0) return "—";
  return `${item.quantity} / ${restockPoint}`;
};

/**
 * Handle pagination changes
 */
const handlePaginationChange = (options: any) => {
  const { page, itemsPerPage: perPage } = options;
  if (page && perPage) {
    loadInventory(page, perPage);
  }
};

/**
 * View transaction history for an inventory item
 */
const viewTransactions = async (item: InventoryWithProduct) => {
  selectedInventory.value = item;
  showTransactionsDialog.value = true;
  await loadTransactions();
};

/**
 * Load transaction history
 */
const loadTransactions = async () => {
  if (!selectedInventory.value) return;

  const inventoryId = selectedInventory.value.id;

  loadingTransactions.value = true;
  try {
    const { data: response, error: fetchError } =
      await useFetch<InventoryTransactionsResponse>(
        `/api/warehouse/inventory/${inventoryId}/transactions`,
        {
          query: { limit: 10, page: 1 },
        },
      );

    if (fetchError.value) {
      throw new Error(fetchError.value.message);
    }

    if (response.value) {
      transactions.value = response.value.data || [];
      transactionsTotal.value = response.value.total || 0;
    }
  } catch (error: any) {
    console.error("Error loading transactions:", error);
    transactions.value = [];
    transactionsTotal.value = 0;
  } finally {
    loadingTransactions.value = false;
  }
};

/**
 * Get inventory ID from product ID
 */
const getInventoryId = async (productId: number): Promise<number | null> => {
  try {
    const { data: response, error: fetchError } = await useFetch<{
      data: { items: Array<{ id: number; productId: number }> };
    }>("/api/warehouse/inventory", {
      query: { productId, itemsPerPage: 1 },
    });

    if (fetchError.value) {
      throw new Error(fetchError.value.message);
    }

    return response.value?.data.items[0]?.id || null;
  } catch (error) {
    console.error("Error fetching inventory ID:", error);
    return null;
  }
};

onMounted(() => {
  loadInventory();
});
</script>

<style scoped>
:deep(.v-data-table) {
  font-size: 0.875rem;
}
</style>
