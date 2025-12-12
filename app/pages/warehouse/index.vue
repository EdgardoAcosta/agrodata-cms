<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-caption text-medium-emphasis mb-1">Warehouse</div>
        <h1 class="text-h5">Inventory</h1>
      </v-col>
    </v-row>

    <!-- Quick Lookup Section -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row dense align="center">
          <v-col cols="12" md="6">
            <v-text-field v-model="manualCode" label="Product Code / Barcode / SKU"
              placeholder="Enter or scan product code" variant="outlined" density="comfortable"
              prepend-inner-icon="mdi-barcode" clearable hide-details @keyup.enter="handleManualLookup" autofocus>
              <template #append-inner>
                <v-btn icon variant="text" size="small" @click="showScanner = !showScanner"
                  :color="showScanner ? 'primary' : undefined">
                  <v-icon icon="mdi-camera" />
                </v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12" md="auto">
            <v-btn color="primary" variant="flat" @click="handleManualLookup" :loading="isLookingUp"
              :disabled="!manualCode">
              <v-icon start icon="mdi-magnify" />
              Lookup
            </v-btn>
          </v-col>
          <v-col cols="12" md="auto">
            <v-btn variant="outlined" @click="navigateTo('/warehouse/cycle-count')">
              <v-icon start icon="mdi-clipboard-list" />
              Cycle Count
            </v-btn>
          </v-col>
        </v-row>

        <!-- Camera Scanner -->
        <v-expand-transition>
          <div v-if="showScanner" class="mt-4">
            <v-divider class="mb-4" />
            <ScannerPanel ref="scannerRef" @detected="handleDetected" @new-session="clearCurrentProduct" />
          </div>
        </v-expand-transition>

        <!-- Product Info Card -->
        <div v-if="currentProduct" class="mt-4">
          <v-divider class="mb-4" />
          <v-row dense>
            <v-col cols="12" md="3">
              <v-img :src="currentProduct.image" height="150" cover class="rounded" />
            </v-col>
            <v-col cols="12" md="9">
              <div class="d-flex justify-space-between align-center mb-2">
                <h3 class="text-h6">{{ currentProduct.name }}</h3>
                <v-btn icon variant="text" size="small" @click="clearCurrentProduct">
                  <v-icon icon="mdi-close" />
                </v-btn>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-3">
                {{ currentProduct.shortDescription }}
              </p>
              <v-row dense>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">Price</div>
                  <div class="font-weight-medium">
                    {{ formatCurrency(currentProduct.price) }} {{ currentProduct.currency }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">Quantity</div>
                  <div class="text-h6 font-weight-bold">
                    {{ currentProduct.inventory?.quantity ?? 0 }}
                  </div>
                </v-col>
                <v-col cols="6" sm="3" v-if="currentProduct.inventory?.location">
                  <div class="text-caption text-medium-emphasis">Location</div>
                  <div class="font-weight-medium">{{ currentProduct.inventory.location }}</div>
                </v-col>
                <v-col cols="6" sm="3">
                  <div class="text-caption text-medium-emphasis">Status</div>
                  <v-chip :color="currentProduct.inStock ? 'success' : 'error'" size="small">
                    {{ currentProduct.inStock ? "In Stock" : "Out of Stock" }}
                  </v-chip>
                </v-col>
              </v-row>
              <v-btn color="primary" variant="outlined" size="small" class="mt-3" @click="openUpdateDialog">
                <v-icon start icon="mdi-pencil" />
                Update Inventory
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>

    <!-- Inventory Table -->
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>Current Inventory</div>
        <v-btn icon variant="text" size="small" @click="loadInventory" :loading="loading">
          <v-icon icon="mdi-refresh" />
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="inventoryItems" :loading="loading" :items-per-page="10"
          class="elevation-0">
          <template #item.product="{ item }">
            <div class="d-flex align-center ga-2 py-2">
              <v-avatar size="40" rounded>
                <v-img :src="item.product.image" />
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ item.product.name }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.product.barcode || item.product.sku || `ID: ${item.product.id}` }}
                </div>
              </div>
            </div>
          </template>
          <template #item.quantity="{ item }">
            <v-chip :color="item.quantity === 0 ? 'error' : item.quantity < 10 ? 'warning' : 'success'" size="small">
              {{ item.quantity }}
            </v-chip>
          </template>
          <template #item.lastCounted="{ item }">
            <span v-if="item.lastCounted" class="text-caption">
              {{ formatDate(item.lastCounted) }}
            </span>
            <span v-else class="text-caption text-medium-emphasis">Never</span>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon variant="text" size="small" @click="selectProduct(item.product)">
              <v-icon icon="mdi-eye" />
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Update Inventory Dialog -->
    <v-dialog v-model="showUpdateDialog" max-width="500">
      <v-card>
        <v-card-title>Update Inventory</v-card-title>
        <v-card-text>
          <v-form ref="updateFormRef" @submit.prevent="handleUpdate">
            <v-text-field v-model.number="updateForm.quantity" label="Quantity" type="number" min="0" variant="outlined"
              :rules="[(v) => v >= 0 || 'Quantity must be positive']" />
            <v-text-field v-model="updateForm.location" label="Location (optional)" variant="outlined"
              placeholder="e.g., Warehouse A, Shelf 3" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showUpdateDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="handleUpdate" :loading="isUpdating">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Unregistered Product Dialog -->
    <v-dialog v-model="showUnregisteredDialog" max-width="500">
      <v-card>
        <v-card-title>Product Not Found</v-card-title>
        <v-card-text>
          <div class="mb-4">
            <v-icon size="48" color="warning" icon="mdi-alert-circle" class="mb-2" />
            <p>The code <strong>{{ lastScannedCode }}</strong> is not registered in the system.</p>
          </div>
          <p>Would you like to create a new product with this code?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showUnregisteredDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="flat" @click="handleCreateNewProduct">Create Product</v-btn>
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

definePageMeta({
  layout: "default",
});

interface Product {
  id: number;
  name: string;
  shortDescription: string;
  price: number;
  currency: string;
  inStock: boolean;
  image: string;
  barcode?: string;
  sku?: string;
}

interface InventoryWithProduct {
  productId: number;
  quantity: number;
  location?: string;
  lastCounted?: string;
  product: Product;
}

const warehouse = useWarehouse();
const router = useRouter();
const scannerRef = ref();
const updateFormRef = ref();

const manualCode = ref("");
const showScanner = ref(false);
const currentProduct = ref<any>(null);
const isLookingUp = ref(false);
const loading = ref(false);
const isUpdating = ref(false);
const showUpdateDialog = ref(false);
const showUnregisteredDialog = ref(false);
const lastScannedCode = ref("");
const inventoryItems = ref<InventoryWithProduct[]>([]);

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
  { title: "Location", key: "location", sortable: true },
  { title: "Last Counted", key: "lastCounted", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const handleManualLookup = async () => {
  if (!manualCode.value) return;

  isLookingUp.value = true;
  lastScannedCode.value = manualCode.value;

  try {
    const product = await warehouse.lookupProductByCode(manualCode.value);

    if (product) {
      const inventory = await warehouse.getInventory(product.id);
      currentProduct.value = { ...product, inventory };
      snackbar.message = `Product found: ${product.name}`;
      snackbar.color = "success";
      snackbar.show = true;
    } else {
      showUnregisteredDialog.value = true;
    }
  } catch (error: any) {
    snackbar.message = error.message || "Error looking up product";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    isLookingUp.value = false;
  }
};

const handleDetected = async (result: { format: string; rawValue: string }[]) => {
  if (!result || result.length === 0) return;

  const firstCode = result[0];
  if (!firstCode) return;

  manualCode.value = firstCode.rawValue;
  await handleManualLookup();
};

const selectProduct = async (product: Product) => {
  const inventory = await warehouse.getInventory(product.id);
  currentProduct.value = { ...product, inventory };
};

const clearCurrentProduct = () => {
  currentProduct.value = null;
  manualCode.value = "";
};

const openUpdateDialog = () => {
  if (currentProduct.value?.inventory) {
    updateForm.quantity = currentProduct.value.inventory.quantity;
    updateForm.location = currentProduct.value.inventory.location || "";
  } else {
    updateForm.quantity = 0;
    updateForm.location = "";
  }
  showUpdateDialog.value = true;
};

const handleUpdate = async () => {
  if (!currentProduct.value) return;

  const { valid } = await updateFormRef.value?.validate();
  if (!valid) return;

  isUpdating.value = true;

  try {
    await warehouse.updateInventoryCount(
      currentProduct.value.id,
      updateForm.quantity,
      updateForm.location || undefined,
    );

    // Refresh data
    const inventory = await warehouse.getInventory(currentProduct.value.id);
    currentProduct.value.inventory = inventory;
    await loadInventory();

    snackbar.message = "Inventory updated successfully";
    snackbar.color = "success";
    snackbar.show = true;
    showUpdateDialog.value = false;
  } catch (error: any) {
    snackbar.message = error.message || "Error updating inventory";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    isUpdating.value = false;
  }
};

const handleCreateNewProduct = () => {
  showUnregisteredDialog.value = false;
  router.push({
    path: "/products",
    query: { create: "true", barcode: lastScannedCode.value },
  });
};

const loadInventory = async () => {
  loading.value = true;
  try {
    // Get all products
    const response = await $fetch<{
      data: Product[];
    }>("/api/products", {
      query: { itemsPerPage: -1 },
    });

    // Get inventory for each product
    const items: InventoryWithProduct[] = [];
    for (const product of response.data) {
      try {
        const inventory = await warehouse.getInventory(product.id);
        items.push({
          ...inventory,
          product,
        });
      } catch (error) {
        // If no inventory, add with 0 quantity
        items.push({
          productId: product.id,
          quantity: 0,
          product,
        });
      }
    }

    inventoryItems.value = items;
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

onMounted(() => {
  loadInventory();
});
</script>

<style scoped>
:deep(.v-data-table) {
  font-size: 0.875rem;
}
</style>
