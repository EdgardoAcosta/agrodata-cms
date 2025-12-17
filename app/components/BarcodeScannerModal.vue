<template>
  <v-dialog v-model="isOpen" fullscreen transition="dialog-bottom-transition" scrim="black">
    <v-card class="scanner-modal">
      <!-- Header -->
      <v-toolbar color="primary" dark>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Barcode Scanner</v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="showSettings = true">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </v-toolbar>

      <!-- Content -->
      <v-card-text class="pa-0 fill-height modal-content">
        <v-container fluid class="fill-height pa-4 modal-container">
          <v-row class="fill-height">
            <v-col cols="12" md="6" class="d-flex flex-column">
              <!-- Camera Section -->
              <v-card class="flex-grow-1 d-flex flex-column">
                <v-card-text class="flex-grow-1 pa-0">
                  <!-- Camera Controls -->
                  <div class="pa-3 d-flex align-center justify-space-between">
                    <div>
                      <div class="text-caption text-medium-emphasis">Camera Stream</div>
                      <div class="font-weight-medium">
                        {{ cameraStatusText }}
                      </div>
                    </div>
                    <div class="d-flex ga-2">
                      <v-btn v-if="torchSupported" icon variant="text" size="small"
                        @click="torchEnabled = !torchEnabled">
                        <v-icon :icon="torchEnabled ? 'mdi-flashlight' : 'mdi-flashlight-off'" />
                      </v-btn>
                      <v-btn icon :color="cameraActive ? 'error' : 'success'" size="small" @click="toggleCamera">
                        <v-icon :icon="cameraActive ? 'mdi-stop' : 'mdi-play'" />
                      </v-btn>
                    </div>
                  </div>

                  <!-- Camera View -->
                  <div class="camera-container">
                    <div v-if="!cameraActive" class="camera-placeholder">
                      <v-icon icon="mdi-camera-off" size="64" color="grey-lighten-1" />
                      <div class="text-body-2 text-medium-emphasis mt-3">
                        Camera is off
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        Click play to start scanning
                      </div>
                    </div>

                    <QrcodeStream v-else :paused="cameraPaused" :formats="formats" :track="paintOutline"
                      :constraints="cameraConstraints" :torch="torchEnabled && torchSupported" @decode="onDecode"
                      @init="onInit" @error="onError" @detect="onDetect" @camera-on="onCameraReady"
                      class="camera-stream">
                      <!-- Debug Info -->
                      <div v-if="!cameraPaused" class="scan-status">
                        <v-chip size="small" color="success" variant="elevated">
                          Scanning Active
                        </v-chip>
                      </div>

                      <!-- Scanning Overlay -->
                      <div v-if="scanner.isLoading.value" class="scan-overlay">
                        <v-progress-circular indeterminate color="white" size="64" />
                        <div class="text-white mt-3">Processing...</div>
                      </div>

                      <!-- Success Flash -->
                      <div v-if="showSuccessFlash" class="scan-overlay success-flash">
                        <v-icon icon="mdi-check-circle" color="success" size="64" />
                      </div>
                    </QrcodeStream>
                  </div>

                  <!-- Manual Input -->
                  <div class="pa-3">
                    <v-text-field v-model="manualBarcode" label="Or enter barcode manually"
                      prepend-inner-icon="mdi-barcode" variant="outlined" density="comfortable" hide-details
                      @keyup.enter="handleManualEntry">
                      <template #append-inner>
                        <v-btn icon size="small" variant="text" :disabled="!manualBarcode" @click="handleManualEntry">
                          <v-icon>mdi-arrow-right</v-icon>
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Scan History (Mobile) -->
              <v-card v-if="scanner.scanHistory.value.length > 0" class="mt-3 d-md-none">
                <v-card-text>
                  <div class="text-caption text-medium-emphasis mb-2">Recent Scans</div>
                  <div class="d-flex flex-wrap ga-1">
                    <v-chip v-for="item in scanner.scanHistory.value.slice(0, 5)" :key="item.id" size="small"
                      variant="tonal" :color="item.product ? 'success' : 'warning'" @click="reloadScan(item)">
                      {{ item.barcode }}
                    </v-chip>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Results Section -->
            <v-col cols="12" md="6" class="d-flex flex-column">
              <!-- Product Found -->
              <ProductFoundCard v-if="scanner.state.value === 'found' && scanner.currentProduct.value"
                :product="scanner.currentProduct.value" :barcode="scanner.currentBarcode.value"
                :show-scan-again="scanner.continuousMode.value" @edit-product="handleEditProduct"
                @view-inventory="handleViewInventory" @scan-again="scanner.scanAgain()" />

              <!-- Product Not Found -->
              <ProductNotFoundCard v-else-if="scanner.state.value === 'not-found'"
                :barcode="scanner.currentBarcode.value" @create-new="handleCreateNew"
                @link-existing="handleLinkExisting" @scan-again="scanner.scanAgain()"
                @manual-search="handleManualSearch" />

              <!-- Error State -->
              <v-card v-else-if="scanner.state.value === 'error'" elevation="2">
                <v-card-text>
                  <div class="d-flex align-center mb-3">
                    <v-icon icon="mdi-alert-circle" color="error" size="32" class="mr-2" />
                    <div>
                      <div class="text-h6 font-weight-medium">Error</div>
                      <div class="text-caption text-medium-emphasis">
                        {{ scanner.error.value || 'Something went wrong' }}
                      </div>
                    </div>
                  </div>
                  <v-btn color="primary" block @click="scanner.scanAgain()">
                    Try Again
                  </v-btn>
                </v-card-text>
              </v-card>

              <!-- Idle State -->
              <v-card v-else class="text-center pa-8" elevation="0" variant="tonal">
                <v-icon icon="mdi-barcode-scan" size="64" color="grey-lighten-1" />
                <div class="text-h6 mt-4 mb-2">Ready to Scan</div>
                <div class="text-body-2 text-medium-emphasis">
                  Point your camera at a barcode or enter it manually
                </div>
              </v-card>

              <!-- Scan History (Desktop) -->
              <v-card v-if="scanner.scanHistory.value.length > 0" class="mt-3 d-none d-md-block">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <div class="text-caption text-medium-emphasis">Scan History</div>
                    <v-btn size="x-small" variant="text" @click="scanner.clearHistory()">
                      Clear
                    </v-btn>
                  </div>
                  <v-list density="compact">
                    <v-list-item v-for="item in scanner.scanHistory.value" :key="item.id" :title="item.barcode"
                      :subtitle="item.product?.name || 'Not found'" @click="reloadScan(item)">
                      <template #prepend>
                        <v-icon :icon="item.product ? 'mdi-check-circle' : 'mdi-alert-circle'"
                          :color="item.product ? 'success' : 'warning'" size="small" />
                      </template>
                      <template #append>
                        <div class="text-caption text-medium-emphasis">
                          {{ formatTime(item.timestamp) }}
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <!-- Settings Dialog -->
    <v-dialog v-model="showSettings" max-width="420">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="font-weight-medium">Scanner Settings</div>
          <v-btn icon variant="text" @click="showSettings = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-select v-model="selectedCameraId" :items="availableCameras" item-title="label" item-value="deviceId"
            label="Camera" variant="outlined" density="compact" :hint="`${availableCameras.length} camera(s) detected`"
            persistent-hint class="mb-3" />

          <v-switch v-model="scanner.continuousMode.value" label="Continuous scanning mode" color="primary" hide-details
            class="mb-2" disabled />

          <v-switch v-model="scanner.audioEnabled.value" label="Audio feedback" color="primary" hide-details
            class="mb-2" />

          <v-switch v-model="scanner.vibrationEnabled.value" label="Vibration feedback" color="primary" hide-details />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="outlined" @click="showSettings = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import type { BarcodeFormat } from 'vue-qrcode-reader'
import { useProductScanner } from '~/composables/useProductScanner'
import type { ScanHistory } from '~/composables/useProductScanner'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'product-found', data: any): void
  (e: 'create-product', barcode: string): void
  (e: 'link-product', data: { barcode: string; productId: number }): void
}>()

// Scanner composable
const scanner = useProductScanner()

// Dialog state
const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// Camera state
const cameraActive = ref(false)
const cameraPaused = ref(false)
const selectedCameraId = ref<string | null>(null)
const availableCameras = ref<MediaDeviceInfo[]>([])
const torchEnabled = ref(false)
const torchSupported = ref(false)
const manualBarcode = ref('')
const showSettings = ref(false)
const showSuccessFlash = ref(false)

// Barcode formats to detect
const formats = ref<BarcodeFormat[]>([
  'qr_code',
  'code_128',
  'code_39',
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e'
])

const cameraConstraints = computed(() => ({
  facingMode: 'environment',
  ...(selectedCameraId.value && { deviceId: selectedCameraId.value })
}))

const cameraStatusText = computed(() => {
  if (!cameraActive.value) return 'Camera off'
  if (cameraPaused.value) return 'Paused'
  return 'Scanning...'
})

/**
 * Handle barcode decode
 */
async function onDecode(result: any) {
  console.log('=== DECODE EVENT FIRED ===', result)
  
  if (cameraPaused.value) {
    console.log('Camera is paused, ignoring decode')
    return
  }

  const barcode = result.rawValue || result
  const format = result.format || 'unknown'

  console.log('Processing barcode:', { barcode, format, result })

  // Pause camera during processing if not in continuous mode
  if (!scanner.continuousMode.value) {
    cameraPaused.value = true
    console.log('Camera paused for processing')
  }

  // Show success flash
  showSuccessFlash.value = true
  setTimeout(() => {
    showSuccessFlash.value = false
  }, 500)

  // Process the barcode
  await scanner.processBarcode(barcode, format)

  // Resume camera after delay in non-continuous mode
  if (!scanner.continuousMode.value) {
    setTimeout(() => {
      cameraPaused.value = false
      console.log('Camera resumed')
    }, 2000)
  }
}

/**
 * Handle camera initialization
 */
async function onInit(promise: Promise<any>) {
  try {
    const capabilities = await promise
    torchSupported.value = !!capabilities?.torch
    
    // Get available cameras after permission is granted
    await enumerateCameras()
  } catch (error) {
    console.error('Camera initialization error:', error)
    scanner.state.value = 'error'
    scanner.error.value = 'Failed to initialize camera'
  }
}

/**
 * Enumerate available cameras
 */
async function enumerateCameras() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices()
    availableCameras.value = devices.filter(d => d.kind === 'videoinput')
    console.log('Available cameras:', availableCameras.value.length, availableCameras.value)
  } catch (error) {
    console.error('Failed to enumerate cameras:', error)
  }
}

/**
 * Handle camera errors
 */
function onError(error: any) {
  console.error('Camera error:', error)
  scanner.state.value = 'error'
  scanner.error.value = error.message || 'Camera error occurred'
}

/**
 * Handle detection
 */
async function onDetect(detectedCodes: any[]) {
  // Log when codes are detected in frame
  if (detectedCodes && detectedCodes.length > 0) {
    console.log('Codes detected in frame:', detectedCodes.length, detectedCodes)
    
    // Process the first detected code
    const firstCode = detectedCodes[0]
    if (firstCode && firstCode.rawValue) {
      // Call onDecode with the detected code
      await onDecode(firstCode)
    }
  }
}

/**
 * Handle camera ready
 */
async function onCameraReady() {
  console.log('Camera is ready')
  // Enumerate cameras again after camera is fully ready
  await enumerateCameras()
}

/**
 * Paint outline around detected codes
 */
function paintOutline(detectedCodes: any[], ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

    ctx.strokeStyle = '#00E676'
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.moveTo(firstPoint.x, firstPoint.y)
    for (const { x, y } of otherPoints) {
      ctx.lineTo(x, y)
    }
    ctx.lineTo(firstPoint.x, firstPoint.y)
    ctx.closePath()
    ctx.stroke()
  }
}

/**
 * Toggle camera on/off
 */
function toggleCamera() {
  cameraActive.value = !cameraActive.value
  if (!cameraActive.value) {
    scanner.reset()
  }
}

/**
 * Handle manual barcode entry
 */
async function handleManualEntry() {
  if (manualBarcode.value) {
    await scanner.processBarcode(manualBarcode.value, 'manual')
    manualBarcode.value = ''
  }
}

/**
 * Reload a scan from history
 */
function reloadScan(item: ScanHistory) {
  scanner.currentBarcode.value = item.barcode
  scanner.currentProduct.value = item.product || null
  scanner.state.value = item.product ? 'found' : 'not-found'
}

/**
 * Handle edit product
 */
function handleEditProduct(product: any) {
  console.log('Edit product:', product)
  emit('product-found', product)
  close()
  navigateTo(`/products?id=${product.id}`)
}

/**
 * Handle view inventory
 */
function handleViewInventory(product: any) {
  console.log('View inventory:', product)
  emit('product-found', product)
  close()
  navigateTo(`/warehouse?productId=${product.id}`)
}

/**
 * Handle create new product
 */
function handleCreateNew(barcode: string) {
  emit('create-product', barcode)
  // Navigate to products page which has the create functionality
  navigateTo(`/products?create=true&barcode=${encodeURIComponent(barcode)}`)
  close()
}

/**
 * Handle link to existing product
 */
async function handleLinkExisting(data: { barcode: string; productId: number }) {
  emit('link-product', data)
  // TODO: Call API to link barcode to product
  console.log('Link barcode to product:', data)
}

/**
 * Handle manual search
 */
function handleManualSearch(query: string) {
  close()
  navigateTo(`/products?search=${encodeURIComponent(query)}`)
}

/**
 * Format timestamp
 */
function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)
}

/**
 * Close modal
 */
function close() {
  cameraActive.value = false
  scanner.reset()
  isOpen.value = false
}

// Auto-start camera when modal opens
watch(isOpen, (val) => {
  if (val) {
    setTimeout(() => {
      cameraActive.value = true
    }, 300)
  }
})
</script>

<style scoped>
.scanner-modal {
  background: rgb(var(--v-theme-surface)) !important;
  opacity: 1 !important;
}

.modal-content {
  background: rgb(var(--v-theme-surface)) !important;
}

.modal-container {
  background: rgb(var(--v-theme-surface)) !important;
}

.camera-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.camera-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.camera-stream {
  width: 100%;
  height: 100%;
}

.scan-status {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 5;
}

.scan-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
}

.success-flash {
  background: rgba(0, 230, 118, 0.3);
  animation: flash 0.5s ease-out;
}

@keyframes flash {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
