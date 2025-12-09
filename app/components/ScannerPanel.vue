<template>
  <v-card class="h-100">
    <v-card-text>
      <div class="d-flex align-center justify-space-between flex-wrap ga-2 mb-3">
        <div>
          <div class="text-caption text-medium-emphasis mb-1">Camera stream</div>
          <div class="font-weight-medium">Scan codes live</div>
        </div>
        <v-btn size="small" variant="outlined" class="d-none d-md-inline-flex" @click="showSettingsModal = true">
          Scanner settings
        </v-btn>
      </div>

      <div class="d-md-none mb-3">
        <v-btn color="primary" block :disabled="cameraPrimaryDisabled" :loading="loading" @click="handleCameraPrimary">
          {{ cameraPrimaryLabel }}
        </v-btn>
        <div class="d-flex ga-2 mt-2">
          <v-btn variant="text" block @click="handleStartNewSession">
            New session
          </v-btn>
        </div>
      </div>

      <div class="qr-shell rounded-lg overflow-hidden">
        <div v-if="!cameraActive"
          class="scanner-placeholder h-100 d-flex flex-column align-center justify-center text-center text-medium-emphasis pa-4">
          <p class="mb-1 font-weight-medium">Camera is idle</p>
          <div class="text-caption">Start the camera to request permission and begin scanning.</div>
        </div>
        <QrcodeStream v-else :paused="cameraPaused" @decode="onDecode" @init="onInit" @error="onError"
          :formats="formats" :track="paintOutline" :constraints="cameraConstraints"
          :torch="torchEnabled && torchSupported" @detect="onDetect" @camera-on="onCameraReady" class="qr-stream">
          <div v-if="validationPending" class="validation-pending">
            Processing QR code...
          </div>
          <div v-if="validationSuccess" class="validation-success">
            ✓ QR Code Scanned Successfully!
          </div>
        </QrcodeStream>
      </div>

      <div v-if="decodedContent" class="status-card mt-3">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="text-caption text-medium-emphasis">Last read</div>
            <div class="font-weight-medium">{{ decodedContent }}</div>
          </div>
          <v-chip color="success" size="small">OK</v-chip>
        </div>
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showSettingsModal" max-width="420">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <div class="font-weight-medium">Scanner settings</div>
          <div class="text-caption text-medium-emphasis">Select camera and flashlight</div>
        </div>
        <v-btn icon variant="text" @click="showSettingsModal = false">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-select v-model="selectedCameraId" :items="availableCameras" item-title="label" item-value="deviceId"
          label="Camera" density="compact" variant="outlined" :hint="`${availableCameras.length} detected`"
          persistent-hint>
          <template #item="{ props, item }">
            <v-list-item v-bind="props" :title="item.raw.label || `Camera ${availableCameras.indexOf(item.raw) + 1}`" />
          </template>
        </v-select>

        <v-switch v-model="torchEnabled" :disabled="!torchSupported"
          :label="`Flashlight ${torchSupported ? '' : '(not supported)'}`" color="primary" class="mt-3" />
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="outlined" @click="showSettingsModal = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { BarcodeFormat } from 'vue-qrcode-reader'
import { QrcodeStream } from 'vue-qrcode-reader'
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps<{
  formats?: BarcodeFormat[]
}>()

const emit = defineEmits<{
  (e: 'detected', payload: { format: string; rawValue: string }[]): void
  (e: 'decoded', payload: string): void
  (e: 'new-session'): void
}>()

const decodedContent = ref('')
const loading = ref(false)
const cameraActive = ref(false)
const cameraPaused = ref(true)
const isValid = ref<boolean | undefined>(undefined)
const formats = ref<BarcodeFormat[]>(props.formats || ['qr_code', 'code_128', 'ean_13', 'upc_a', 'upc_e'])
const availableCameras = ref<MediaDeviceInfo[]>([])
const selectedCameraId = ref<string | undefined>(undefined)
const torchSupported = ref(false)
const torchEnabled = ref(false)
const showSettingsModal = ref(false)

const validationPending = computed(() => isValid.value === undefined && cameraPaused.value)
const validationSuccess = computed(() => isValid.value === true)

const cameraConstraints = computed<MediaTrackConstraints>(() => {
  const constraints: MediaTrackConstraints = {}
  if (selectedCameraId.value) {
    constraints.deviceId = { exact: selectedCameraId.value }
  }
  return constraints
})

const cameraPrimaryLabel = computed(() => {
  if (!cameraActive.value) return 'Start camera'
  if (cameraPaused.value) return 'Resume'
  return 'Pause'
})

const cameraPrimaryDisabled = computed(() => loading.value)

const loadCameras = async () => {
  if (!navigator?.mediaDevices?.enumerateDevices) return
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoInputs = devices.filter((d) => d.kind === 'videoinput')
  availableCameras.value = videoInputs
  if (!selectedCameraId.value && videoInputs.length > 0) {
    selectedCameraId.value = videoInputs[0]?.deviceId
  }
}

const onCameraReady = async (capabilities?: Partial<MediaTrackCapabilities>) => {
  loading.value = false
  isValid.value = undefined
  cameraActive.value = true
  torchSupported.value = Boolean((capabilities as any)?.torch)
  await loadCameras()
}

const startCamera = () => {
  cameraActive.value = true
  cameraPaused.value = false
  loading.value = true
  isValid.value = undefined
}

const handleCameraPrimary = () => {
  if (!cameraActive.value || cameraPaused.value) {
    startCamera()
  } else {
    cameraPaused.value = true
  }
}

const onDetect = async (result: { format: string; rawValue: string }[]) => {
  if (!cameraActive.value || result.length === 0 || cameraPaused.value) return

  cameraPaused.value = true
  isValid.value = undefined

  await timeout(400)
  emit('detected', result)
  decodedContent.value = result.map((el) => `${el.rawValue} (${el.format})`).join(' • ')
  isValid.value = true

  await timeout(1200)
  cameraPaused.value = false
  isValid.value = undefined
}

const onDecode = (content: string) => {
  decodedContent.value = content
  emit('decoded', content)
  cameraPaused.value = true
  setTimeout(() => {
    cameraPaused.value = false
    isValid.value = undefined
  }, 800)
}

const onInit = (promise: Promise<unknown>) => {
  promise.catch((error: Error & { name?: string }) => {
    alert(error.message)
    loading.value = false
    cameraActive.value = false
    cameraPaused.value = true
  })
}

const onError = (err: Error & { name?: string }) => {
  alert(`Error: ${err.message}`)
  loading.value = false
  cameraActive.value = false
  cameraPaused.value = true
}

function paintOutline(detectedCodes: { cornerPoints?: { x: number; y: number }[] }[], ctx: CanvasRenderingContext2D) {
  if (!Array.isArray(detectedCodes) || detectedCodes.length === 0) return

  ctx.lineWidth = 3
  ctx.strokeStyle = '#0d6efd'

  for (const detectedCode of detectedCodes) {
    if (!detectedCode?.cornerPoints || detectedCode.cornerPoints.length === 0) continue

    const [firstPoint, ...otherPoints] = detectedCode.cornerPoints
    if (!firstPoint) continue

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

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const handleStartNewSession = () => {
  emit('new-session')
}

watch(torchSupported, (supported) => {
  if (!supported) {
    torchEnabled.value = false
  }
})

onMounted(async () => {
  await loadCameras()
})

defineExpose({
  startCamera,
  pauseCamera: () => {
    cameraPaused.value = true
  },
  resumeCamera: () => {
    if (cameraActive.value) cameraPaused.value = false
  }
})
</script>

<style scoped>
.qr-shell {
  min-height: 32vh;
  background: radial-gradient(circle at 30% 30%, rgba(var(--v-theme-primary), 0.07), transparent 45%),
    radial-gradient(circle at 80% 20%, rgba(var(--v-theme-success), 0.08), transparent 35%),
    rgb(var(--v-theme-surface));
  position: relative;
  border-radius: 8px;
}

.qr-stream {
  width: 100%;
  height: 100%;
  display: block;
}

.validation-success,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  padding: 20px;
  text-align: center;
  font-weight: bold;
  font-size: 1.5rem;
  color: white;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.validation-success {
  color: #28a745;
  font-size: 2rem;
}

.validation-pending {
  color: #ffc107;
}

.status-card {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: rgb(var(--v-theme-surface));
}

.scanner-placeholder {
  min-height: 240px;
}
</style>
