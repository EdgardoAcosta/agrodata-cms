<template>
  <v-container fluid class="pa-4">
    <v-row>
      <!-- Scanner Panel -->
      <v-col cols="12" md="6">
        <ScannerPanel ref="scannerRef" @detected="handleDetected" @new-session="handleNewSession" />
      </v-col>

      <!-- Cycle Count Panel -->
      <v-col cols="12" md="6">
        <v-card class="h-100">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <div class="font-weight-medium">Cycle Count Session</div>
              <div class="text-caption text-medium-emphasis">
                {{ sessionActive ? "Session active" : "Start a new session" }}
              </div>
            </div>
            <v-chip :color="sessionActive ? 'success' : 'default'" size="small">
              {{ sessionItems.length }} items
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Session Controls -->
            <div class="d-flex ga-2 mb-4">
              <v-btn v-if="!sessionActive" color="primary" block @click="startSession">
                <v-icon start icon="mdi-play" />
                Start Session
              </v-btn>
              <template v-else>
                <v-btn color="success" block @click="completeSession">
                  <v-icon start icon="mdi-check" />
                  Complete
                </v-btn>
                <v-btn color="error" variant="outlined" @click="cancelSession">
                  <v-icon icon="mdi-close" />
                </v-btn>
              </template>
            </div>

            <!-- Current Item -->
            <div v-if="currentItem" class="current-item-card rounded-lg pa-4 mb-4">
              <div class="text-caption text-medium-emphasis mb-1">
                Currently Counting
              </div>
              <h4 class="text-h6 mb-2">{{ currentItem.name }}</h4>
              <v-row dense>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">
                    Expected Qty
                  </div>
                  <div class="font-weight-bold">
                    {{ currentItem.expectedQty }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-caption text-medium-emphasis">
                    Scanned
                  </div>
                  <div class="font-weight-bold">{{ currentItem.scannedQty }}</div>
                </v-col>
              </v-row>

              <v-text-field v-model.number="manualCount" label="Manual Count" type="number" min="0" variant="outlined"
                density="compact" class="mt-3" hide-details>
                <template #append>
                  <v-btn size="small" color="primary" variant="flat" @click="setManualCount">
                    Set
                  </v-btn>
                </template>
              </v-text-field>
            </div>

            <!-- Session Items List -->
            <div v-if="sessionItems.length > 0">
              <div class="text-subtitle-2 mb-2">Counted Items</div>
              <v-list density="compact">
                <v-list-item v-for="item in sessionItems" :key="item.productId" class="mb-1 rounded" :class="{
                    'bg-success-lighten-5': item.status === 'matched',
                    'bg-warning-lighten-5': item.status === 'variance',
                    'bg-grey-lighten-4': item.status === 'pending',
                  }">
                  <template #prepend>
                    <v-icon :icon="
                        item.status === 'matched'
                          ? 'mdi-check-circle'
                          : item.status === 'variance'
                            ? 'mdi-alert'
                            : 'mdi-clock-outline'
                      " :color="
                        item.status === 'matched'
                          ? 'success'
                          : item.status === 'variance'
                            ? 'warning'
                            : 'grey'
                      " size="small" />
                  </template>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    Expected: {{ item.expectedQty }} | Counted:
                    {{ item.countedQty ?? "—" }}
                    <span v-if="item.variance !== 0 && item.variance !== undefined" class="font-weight-bold" :class="
                        item.variance > 0 ? 'text-success' : 'text-error'
                      ">
                      ({{ item.variance > 0 ? "+" : ""
                      }}{{ item.variance }})
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </div>
            <div v-else-if="sessionActive" class="text-center py-8 text-medium-emphasis">
              <v-icon size="48" icon="mdi-barcode-scan" class="mb-2" />
              <div>Start scanning products</div>
            </div>
            <div v-else class="text-center py-8 text-medium-emphasis">
              <v-icon size="48" icon="mdi-clipboard-list-outline" class="mb-2" />
              <div>No active session</div>
              <div class="text-caption">Click "Start Session" to begin</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Session Summary Dialog -->
    <v-dialog v-model="showSummaryDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>Cycle Count Summary</v-card-title>
        <v-card-text>
          <v-row dense class="mb-4">
            <v-col cols="4">
              <v-card variant="tonal" color="primary">
                <v-card-text class="text-center">
                  <div class="text-h4">{{ sessionItems.length }}</div>
                  <div class="text-caption">Total Items</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="tonal" color="success">
                <v-card-text class="text-center">
                  <div class="text-h4">{{ matchedCount }}</div>
                  <div class="text-caption">Matched</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card variant="tonal" color="warning">
                <v-card-text class="text-center">
                  <div class="text-h4">{{ varianceCount }}</div>
                  <div class="text-caption">Variances</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-list v-if="varianceItems.length > 0">
            <v-list-subheader>Items with Variance</v-list-subheader>
            <v-list-item v-for="item in varianceItems" :key="item.productId" class="mb-1">
              <v-list-item-title>{{ item.name }}</v-list-item-title>
              <v-list-item-subtitle>
                Expected: {{ item.expectedQty }} | Counted:
                {{ item.countedQty }}
                <span class="font-weight-bold" :class="item.variance! > 0 ? 'text-success' : 'text-error'">
                  ({{ item.variance! > 0 ? "+" : "" }}{{ item.variance }})
                </span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="discardSession">Cancel</v-btn>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="confirmSession" :loading="isSubmitting">
            Confirm & Save
          </v-btn>
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
import { ref, reactive, computed, watch } from "vue";

definePageMeta({
  layout: "default",
});

interface CycleCountItem {
  productId: number;
  name: string;
  barcode?: string;
  sku?: string;
  expectedQty: number;
  scannedQty: number;
  countedQty?: number;
  variance?: number;
  status: "pending" | "matched" | "variance";
}

const warehouse = useWarehouse();
const scannerRef = ref();
const sessionActive = ref(false);
const sessionItems = ref<CycleCountItem[]>([]);
const currentItem = ref<CycleCountItem | null>(null);
const manualCount = ref(0);
const showSummaryDialog = ref(false);
const isSubmitting = ref(false);

const snackbar = reactive({
  show: false,
  message: "",
  color: "success",
});

const matchedCount = computed(
  () => sessionItems.value.filter((item) => item.status === "matched").length,
);

const varianceCount = computed(
  () => sessionItems.value.filter((item) => item.status === "variance").length,
);

const varianceItems = computed(() =>
  sessionItems.value.filter((item) => item.status === "variance"),
);

const startSession = () => {
  sessionActive.value = true;
  sessionItems.value = [];
  currentItem.value = null;
  snackbar.message = "Cycle count session started";
  snackbar.color = "success";
  snackbar.show = true;
};

const handleDetected = async (
  result: { format: string; rawValue: string }[],
) => {
  if (!sessionActive.value || !result || result.length === 0) return;

  const firstCode = result[0];
  if (!firstCode) return;

  try {
    const product = await warehouse.handleScan(
      firstCode.rawValue,
      firstCode.format,
    );

    if (product) {
      const inventory = await warehouse.getInventory(product.id);

      // Check if already in session
      const existingItem = sessionItems.value.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        // Increment scanned count
        existingItem.scannedQty++;
        currentItem.value = existingItem;
        snackbar.message = `${product.name} scanned (${existingItem.scannedQty})`;
      } else {
        // Add new item
        const newItem: CycleCountItem = {
          productId: product.id,
          name: product.name,
          barcode: product.barcode,
          sku: product.sku,
          expectedQty: inventory.quantity,
          scannedQty: 1,
          status: "pending",
        };
        sessionItems.value.push(newItem);
        currentItem.value = newItem;
        snackbar.message = `${product.name} added to count`;
      }
      snackbar.color = "success";
      snackbar.show = true;
    } else {
      snackbar.message = "Product not found";
      snackbar.color = "error";
      snackbar.show = true;
    }
  } catch (error: any) {
    snackbar.message = error.message || "Error scanning product";
    snackbar.color = "error";
    snackbar.show = true;
  }
};

const setManualCount = () => {
  if (!currentItem.value) return;

  currentItem.value.countedQty = manualCount.value;
  currentItem.value.variance = manualCount.value - currentItem.value.expectedQty;
  currentItem.value.status =
    currentItem.value.variance === 0 ? "matched" : "variance";

  snackbar.message = "Count updated";
  snackbar.color = "success";
  snackbar.show = true;

  manualCount.value = 0;
  currentItem.value = null;
};

const handleNewSession = () => {
  if (sessionActive.value && sessionItems.value.length > 0) {
    if (
      confirm(
        "Starting a new session will clear the current count. Continue?",
      )
    ) {
      cancelSession();
      startSession();
    }
  } else {
    startSession();
  }
};

const completeSession = () => {
  // Auto-set counted qty for items that were only scanned
  sessionItems.value.forEach((item) => {
    if (item.countedQty === undefined) {
      item.countedQty = item.scannedQty;
      item.variance = item.scannedQty - item.expectedQty;
      item.status = item.variance === 0 ? "matched" : "variance";
    }
  });

  showSummaryDialog.value = true;
};

const confirmSession = async () => {
  isSubmitting.value = true;

  try {
    // Update inventory for all items
    for (const item of sessionItems.value) {
      if (item.countedQty !== undefined) {
        await warehouse.updateInventoryCount(item.productId, item.countedQty);
      }
    }

    snackbar.message = `Cycle count completed. ${sessionItems.value.length} items updated.`;
    snackbar.color = "success";
    snackbar.show = true;

    // Reset session
    sessionActive.value = false;
    sessionItems.value = [];
    currentItem.value = null;
    showSummaryDialog.value = false;
  } catch (error: any) {
    snackbar.message = error.message || "Error saving cycle count";
    snackbar.color = "error";
    snackbar.show = true;
  } finally {
    isSubmitting.value = false;
  }
};

const cancelSession = () => {
  sessionActive.value = false;
  sessionItems.value = [];
  currentItem.value = null;
  showSummaryDialog.value = false;
};

const discardSession = () => {
  if (
    confirm(
      "Are you sure you want to discard this cycle count? All data will be lost.",
    )
  ) {
    cancelSession();
    snackbar.message = "Session cancelled";
    snackbar.color = "info";
    snackbar.show = true;
  }
};

// Update manual count when current item changes
watch(currentItem, (item) => {
  if (item) {
    manualCount.value = item.countedQty ?? item.scannedQty;
  }
});
</script>

<style scoped>
.current-item-card {
  border: 2px solid rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.05);
}

.bg-success-lighten-5 {
  background-color: rgba(76, 175, 80, 0.1);
}

.bg-warning-lighten-5 {
  background-color: rgba(255, 152, 0, 0.1);
}

.bg-grey-lighten-4 {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
