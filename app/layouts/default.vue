<template>
  <v-app>
    <NuxtRouteAnnouncer />
    <v-app-bar elevation="0" class="topbar" height="72">
      <v-container fluid class="px-6">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-3">
            <NuxtLink class="brand-logo d-flex align-center ga-2" to="/">
              <v-avatar color="primary" size="40" class="brand-avatar">
                <v-icon icon="mdi-warehouse" size="24" />
              </v-avatar>
              <div class="d-none d-sm-block">
                <div class="brand-name">WarehouseOps</div>
                <div class="brand-tagline">Warehouse CRM</div>
              </div>
            </NuxtLink>
          </div>
          <div class="d-flex align-center ga-2">
            <div class="d-none d-md-flex align-center ga-1">
              <v-menu offset="8" transition="slide-y-transition">
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="text" class="nav-menu-btn" prepend-icon="mdi-view-dashboard"
                    append-icon="mdi-chevron-down">
                    {{ t("nav.cms") }}
                  </v-btn>
                </template>
                <v-list class="nav-menu-list" density="comfortable">
                  <v-list-item to="/products" prepend-icon="mdi-package-variant" :title="t('nav.products')">
                    <template #append>
                      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis" />
                    </template>
                  </v-list-item>
                  <v-list-item to="/cms/categories" prepend-icon="mdi-tag-multiple" :title="t('nav.categories')">
                    <template #append>
                      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis" />
                    </template>
                  </v-list-item>
                  <v-list-item to="/cms/labels" prepend-icon="mdi-label" :title="t('nav.labels')">
                    <template #append>
                      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis" />
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-menu offset="8" transition="slide-y-transition">
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="text" class="nav-menu-btn" prepend-icon="mdi-warehouse"
                    append-icon="mdi-chevron-down">
                    {{ t("nav.warehouse") }}
                  </v-btn>
                </template>
                <v-list class="nav-menu-list" density="comfortable">
                  <v-list-item to="/warehouse" prepend-icon="mdi-package-variant" :title="t('nav.inventory')">
                    <template #append>
                      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis" />
                    </template>
                  </v-list-item>
                  <v-list-item to="/warehouse/cycle-count" prepend-icon="mdi-clipboard-list"
                    :title="t('nav.cycleCount')">
                    <template #append>
                      <v-icon icon="mdi-chevron-right" size="small" class="text-medium-emphasis" />
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>

              <v-divider vertical class="mx-2" />
            </div>
            <div class="d-none d-md-inline-flex align-center ga-2">
              <v-menu offset="8" transition="slide-y-transition">
                <template #activator="{ props }">
                  <v-btn v-bind="props" variant="flat" class="user-menu-btn" rounded="pill">
                    <v-avatar color="primary" size="32" class="mr-2">
                      <span class="text-subtitle-2 font-weight-bold">{{
                        initials
                        }}</span>
                    </v-avatar>
                    <div class="text-start mr-2">
                      <div class="text-body-2 font-weight-medium">
                        {{ displayName }}
                      </div>
                      <div class="text-caption text-medium-emphasis">
                        {{ session?.user?.email || "user@example.com" }}
                      </div>
                    </div>
                    <v-icon icon="mdi-chevron-down" size="small" />
                  </v-btn>
                </template>
                <v-list class="nav-menu-list" min-width="240">
                  <v-list-item prepend-icon="mdi-account-circle" :title="t('nav.profile')"
                    :subtitle="t('user.manageAccount')" />
                  <v-list-item prepend-icon="mdi-cog" :title="t('nav.settings')" :subtitle="t('user.appPreferences')" />
                  <v-divider class="my-1" />
                  <v-list-item prepend-icon="mdi-out" :title="t('nav.logout')" @click="handleSignOut">
                    <template #prepend>
                      <v-icon icon="mdi-logout" color="error" />
                    </template>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <v-app-bar-nav-icon class="d-md-none" @click="mobileMenuOpen = !mobileMenuOpen" />
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="mobileMenuOpen" temporary location="right" width="300" class="mobile-drawer">
      <template #prepend>
        <div class="pa-4">
          <div class="d-flex align-center ga-3 mb-2">
            <v-avatar color="primary" size="48">
              <span class="text-h6 font-weight-bold">{{ initials }}</span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ displayName }}
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ session?.user?.email || "user@example.com" }}
              </div>
            </div>
          </div>
        </div>
        <v-divider />
      </template>

      <v-list nav density="comfortable">
        <v-list-subheader>NAVIGATION</v-list-subheader>
        <v-list-item to="/" @click="closeMobileMenu" prepend-icon="mdi-qrcode-scan" title="Scanner" />
        <v-list-item to="/products" @click="closeMobileMenu" prepend-icon="mdi-package-variant" title="Products" />

        <v-list-subheader class="mt-2">CMS</v-list-subheader>
        <v-list-item to="/cms/categories" @click="closeMobileMenu" prepend-icon="mdi-tag-multiple" title="Categories" />
        <v-list-item to="/cms/labels" @click="closeMobileMenu" prepend-icon="mdi-label" title="Labels" />

        <v-list-subheader class="mt-2">WAREHOUSE</v-list-subheader>
        <v-list-item to="/warehouse" @click="closeMobileMenu" prepend-icon="mdi-package-variant"
          :title="t('nav.inventory')" />
        <v-list-item to="/warehouse/cycle-count" @click="closeMobileMenu" prepend-icon="mdi-clipboard-list"
          :title="t('nav.cycleCount')" />
      </v-list>

      <template #append>
        <div class="pa-4">
          <v-btn block variant="tonal" prepend-icon="mdi-logout" color="error" @click="handleSignOutAndClose">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
    <MobileDock :items="dockItems" />
  </v-app>
</template>

<script setup lang="ts">
const { t } = useI18n();
const { data: session, signOut } = useAuth();
const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);
const go = (path: string) => router.push(path);
const dockItems = computed(() => [
  {
    label: t("nav.scan"),
    iconClass: "mdi-qrcode-scan",
    onClick: () => go("/"),
  },
  {
    label: t("nav.products"),
    iconClass: "mdi-package-variant",
    onClick: () => go("/products"),
  },
  {
    label: t("nav.inventory"),
    iconClass: "mdi-clipboard-list",
    onClick: () => go("/warehouse/inventory-count"),
  },
  {
    label: t("nav.profile"),
    iconClass: "mdi-account",
    onClick: () => go("/products"),
  },
]);

const displayName = computed(() => session.value?.user?.name || "User");
const initials = computed(() => {
  const name = session.value?.user?.name || "U";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U"
  );
});

const handleSignOut = async () => {
  try {
    await signOut({ callbackUrl: "/login", redirect: true });
  } catch (error) {
    console.error("Sign out failed", error);
  }
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleSignOutAndClose = async () => {
  closeMobileMenu();
  await handleSignOut();
};

watch(
  () => route.fullPath,
  () => closeMobileMenu(),
);
</script>

<style scoped>
/* Layout-specific styles - navbar styles are in assets/scss/components/_navbar.scss */

/* Smooth transitions for route changes */
:deep(.v-list-item) {
  transition: all 0.2s ease;
}

:deep(.v-list-item:hover) {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

:deep(.v-list-item--active) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  border-left: 3px solid rgb(var(--v-theme-primary));
}
</style>
