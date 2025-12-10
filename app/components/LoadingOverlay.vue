<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="loading-overlay">
        <div class="d-flex flex-column align-center ga-4">
          <v-progress-circular
            indeterminate
            color="white"
            :size="60"
            :width="4"
          />
          <p v-if="message" class="text-white text-body-1 ma-0 text-center">
            {{ message }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  isVisible: boolean;
  message?: string;
}>();

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: all;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
