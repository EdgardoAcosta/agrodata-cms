<template>
  <v-card class="product-found-card" elevation="2">
    <v-card-text>
      <!-- Success Banner -->
      <div class="d-flex align-center mb-3">
        <v-icon icon="mdi-check-circle" color="success" size="32" class="mr-2" />
        <div class="flex-grow-1">
          <div class="text-h6 font-weight-medium">{{ product.name }}</div>
          <div class="text-caption text-medium-emphasis">
            Barcode: {{ barcode }}
          </div>
        </div>
      </div>

      <v-divider class="mb-3" />

      <!-- Product Info -->
      <v-row dense>
        <v-col v-if="product.image" cols="12" sm="4">
          <v-img :src="product.image" height="120" cover class="rounded">
            <template #placeholder>
              <div class="d-flex align-center justify-center fill-height">
                <v-icon icon="mdi-image-off" size="48" color="grey-lighten-1" />
              </div>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" :sm="product.image ? 8 : 12">
          <div class="text-h6 mb-1">{{ product.name }}</div>
          <div v-if="product.shortDescription" class="text-body-2 text-medium-emphasis mb-2">
            {{ product.shortDescription }}
          </div>

          <!-- Categories & Labels -->
          <div v-if="product.categories?.length" class="mb-2">
            <v-chip v-for="cat in product.categories" :key="cat.id" size="x-small" variant="tonal" class="mr-1">
              {{ cat.name }}
            </v-chip>
          </div>
          <div v-if="product.labels?.length" class="mb-2">
            <v-chip v-for="label in product.labels" :key="label.id" size="x-small" color="primary" class="mr-1">
              {{ label.name }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <!-- Inventory Details -->
      <v-card variant="tonal" class="mt-3">
        <v-card-text>
          <div class="text-caption text-medium-emphasis mb-2">Inventory Status</div>
          <v-row dense>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Price</div>
              <div class="font-weight-bold">
                {{ formatCurrency(product.price) }} {{ product.currency }}
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Stock</div>
              <div class="text-h6 font-weight-bold" :class="stockColor">
                {{ product.inventory?.quantity ?? 0 }}
              </div>
            </v-col>
            <v-col v-if="product.inventory?.location" cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Location</div>
              <div class="font-weight-medium">{{ product.inventory.location }}</div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-caption text-medium-emphasis">Status</div>
              <v-chip :color="product.inStock ? 'success' : 'error'" size="small">
                {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="px-4 pb-4">
      <v-btn color="primary" variant="elevated" block prepend-icon="mdi-pencil" @click="$emit('edit-product', product)">
        Edit Product
      </v-btn>
    </v-card-actions>
    <v-card-actions class="px-4 pt-0 pb-4">
      <v-btn variant="outlined" block prepend-icon="mdi-package-variant" @click="$emit('view-inventory', product)">
        View Full Inventory
      </v-btn>
    </v-card-actions>
    <v-card-actions v-if="showScanAgain" class="px-4 pt-0 pb-4">
      <v-btn variant="text" block prepend-icon="mdi-camera" @click="$emit('scan-again')">
        Scan Another Item
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScannedProduct } from '~/composables/useProductScanner'

const props = defineProps<{
  product: ScannedProduct
  barcode: string
  showScanAgain?: boolean
}>()

defineEmits<{
  (e: 'edit-product', product: ScannedProduct): void
  (e: 'view-inventory', product: ScannedProduct): void
  (e: 'scan-again'): void
}>()

const stockColor = computed(() => {
  const qty = props.product.inventory?.quantity ?? 0
  const minStock = props.product.inventory?.minStock ?? 10
  
  if (qty === 0) return 'text-error'
  if (qty < minStock) return 'text-warning'
  return 'text-success'
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
</script>

<style scoped>
.product-found-card {
  width: 100%;
}
</style>
