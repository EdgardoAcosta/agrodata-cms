<template>
  <v-card class="product-not-found-card" elevation="2">
    <v-card-text>
      <!-- Warning Banner -->
      <div class="d-flex align-center mb-3">
        <v-icon icon="mdi-alert-circle" color="warning" size="32" class="mr-2" />
        <div>
          <div class="text-h6 font-weight-medium">Product Not Found</div>
          <div class="text-caption text-medium-emphasis">
            Barcode: {{ barcode }}
          </div>
        </div>
      </div>

      <v-divider class="mb-3" />

      <!-- Info message -->
      <v-alert type="info" variant="tonal" density="compact" class="mb-3">
        This barcode is not associated with any product in the inventory.
      </v-alert>

      <!-- Options -->
      <div class="text-body-2 font-weight-medium mb-2">What would you like to do?</div>

      <v-list density="compact" class="bg-transparent">
        <v-list-item prepend-icon="mdi-plus-box" title="Create New Product"
          subtitle="Add a new product with this barcode" @click="$emit('create-new', barcode)" class="rounded mb-2"
          variant="tonal" />

        <v-list-item prepend-icon="mdi-link-variant" title="Link to Existing Product"
          subtitle="Associate this barcode with an existing product" @click="showProductSearch = true"
          class="rounded mb-2" variant="tonal" />

        <v-list-item prepend-icon="mdi-magnify" title="Manual Search" subtitle="Search products by name or SKU"
          @click="showManualSearch = true" class="rounded" variant="tonal" />
      </v-list>
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-btn variant="text" block prepend-icon="mdi-camera" @click="$emit('scan-again')">
        Scan Another Item
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Product Search Dialog -->
  <v-dialog v-model="showProductSearch" max-width="600" scrollable>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="font-weight-medium">Link to Existing Product</div>
          <div class="text-caption text-medium-emphasis">
            Select a product to associate with barcode: {{ barcode }}
          </div>
        </div>
        <v-btn icon variant="text" @click="showProductSearch = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" placeholder="Search products..."
          variant="outlined" density="comfortable" clearable autofocus hide-details class="mb-3"
          @update:model-value="searchProducts" />

        <div v-if="searchLoading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <v-list v-else-if="searchResults.length > 0" density="compact">
          <v-list-item v-for="product in searchResults" :key="product.id" :title="product.name"
            :subtitle="product.shortDescription || product.slug" @click="selectProduct(product)" class="mb-1 rounded">
            <template #prepend>
              <v-avatar rounded>
                <v-img v-if="product.image" :src="product.image" />
                <v-icon v-else icon="mdi-package-variant" />
              </v-avatar>
            </template>
            <template #append>
              <v-icon icon="mdi-chevron-right" />
            </template>
          </v-list-item>
        </v-list>

        <v-alert v-else-if="searchQuery" type="info" variant="tonal" density="compact">
          No products found matching "{{ searchQuery }}"
        </v-alert>

        <div v-else class="text-center text-medium-emphasis py-8">
          Start typing to search for products
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

  <!-- Manual Search Dialog -->
  <v-dialog v-model="showManualSearch" max-width="500">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="font-weight-medium">Manual Product Search</div>
        <v-btn icon variant="text" @click="showManualSearch = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="manualSearchQuery" label="Product Name, SKU, or Code" prepend-inner-icon="mdi-magnify"
          variant="outlined" density="comfortable" autofocus @keyup.enter="handleManualSearch" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="showManualSearch = false">Cancel</v-btn>
        <v-btn color="primary" variant="elevated" :disabled="!manualSearchQuery" @click="handleManualSearch">
          Search
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ScannedProduct } from '~/composables/useProductScanner'

const props = defineProps<{
  barcode: string
}>()

const emit = defineEmits<{
  (e: 'create-new', barcode: string): void
  (e: 'link-existing', data: { barcode: string; productId: number }): void
  (e: 'scan-again'): void
  (e: 'manual-search', query: string): void
}>()

// Product Search State
const showProductSearch = ref(false)
const searchQuery = ref('')
const searchResults = ref<ScannedProduct[]>([])
const searchLoading = ref(false)

// Manual Search State
const showManualSearch = ref(false)
const manualSearchQuery = ref('')

let searchTimeout: NodeJS.Timeout | null = null

/**
 * Search products with debounce
 */
async function searchProducts() {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }

  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }

  searchTimeout = setTimeout(async () => {
    try {
      searchLoading.value = true
      const { data, error } = await useFetch('/api/products', {
        query: {
          search: searchQuery.value,
          limit: 20
        }
      })

      if (error.value) {
        console.error('Product search error:', error.value)
        searchResults.value = []
      } else {
        // Handle both possible response structures
        const responseData = data.value as any
        searchResults.value = responseData?.data?.items || responseData?.items || responseData?.data || []
        console.log('Search results:', searchResults.value)
      }
    } catch (err) {
      console.error('Product search failed:', err)
      searchResults.value = []
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

/**
 * Select a product to link
 */
function selectProduct(product: ScannedProduct) {
  emit('link-existing', {
    barcode: props.barcode,
    productId: product.id
  })
  showProductSearch.value = false
  searchQuery.value = ''
  searchResults.value = []
}

/**
 * Handle manual search
 */
function handleManualSearch() {
  if (manualSearchQuery.value) {
    emit('manual-search', manualSearchQuery.value)
    showManualSearch.value = false
    manualSearchQuery.value = ''
  }
}
</script>

<style scoped>
.product-not-found-card {
  max-width: 600px;
  margin: 0 auto;
}
</style>
