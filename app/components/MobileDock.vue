<template>
  <nav class="mobile-dock d-md-none">
    <v-btn
      v-for="item in items"
      :key="item.label"
      variant="elevated"
      class="dock-item"
      @click="item.onClick()"
    >
      <div class="d-flex flex-column align-center ga-1">
        <v-icon :icon="item.iconClass" size="small" />
        <span class="text-caption">{{ item.label }}</span>
      </div>
    </v-btn>
  </nav>
</template>

<script setup lang="ts">
type DockItem = {
  label: string;
  iconClass: string; // mdi icon name like 'mdi-home'
  onClick: () => void;
};

defineProps<{ items: DockItem[] }>();
</script>

<style scoped>
.mobile-dock {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  padding: 0.75rem 0.75rem calc(0.75rem + env(safe-area-inset-bottom));
  background: rgb(var(--v-theme-surface));
  border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  box-shadow: 0 -6px 18px rgba(0, 0, 0, 0.08);
  z-index: 1030;
}

.dock-item {
  height: auto !important;
  min-height: 64px;
}
</style>
