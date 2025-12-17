<template>
  <v-container fluid class="py-4 px-md-6 product-detail-view">
    <v-card class="mb-4" variant="elevated" rounded="xl">
      <v-toolbar color="transparent" flat density="comfortable">
        <v-btn icon variant="text" size="small" class="me-2" @click="navigateBack">
          <v-icon icon="mdi-arrow-left" />
        </v-btn>
        <div class="d-flex flex-column text-truncate">
          <span class="text-caption text-medium-emphasis">Productos / Detalle</span>
          <v-toolbar-title class="px-0 text-h5 font-weight-bold text-truncate">
            {{ productTitle }}
          </v-toolbar-title>
        </div>
        <v-spacer />
        <v-toolbar-items class="align-center ga-3">
          <v-switch v-model="isEditing" hide-details inset color="primary" density="compact" class="edit-toggle"
            :label="editModeLabel" />
          <v-btn color="primary" variant="tonal" class="text-none" @click="refresh">
            <v-icon icon="mdi-refresh" />
            <span v-if="!smAndDown" class="ms-2">Actualizar</span>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pt-4 pb-6">
        <v-chip-group :column="smAndDown" class="chip-cloud" selected-class="">
          <v-chip size="small" variant="tonal" color="primary" prepend-icon="mdi-tag-outline">
            {{ editedProduct.slug || product.slug || `ID: ${product.id}` }}
          </v-chip>
          <v-chip :color="stockStatus.color" size="small" variant="elevated" prepend-icon="mdi-check-circle">
            {{ stockStatus.label }}
          </v-chip>
          <v-chip size="small" variant="tonal" prepend-icon="mdi-currency-usd">
            Precio: {{ formattedPrice }}
          </v-chip>
          <v-chip size="small" variant="tonal" prepend-icon="mdi-backup-restore">
            Reabasto: {{ editedProduct.restockPoint ?? product.restockPoint ?? "—" }}
          </v-chip>
        </v-chip-group>

        <div class="text-body-2 text-medium-emphasis mt-3">
          {{ editedProduct.shortDescription || product.shortDescription || "Sin resumen" }}
        </div>

        <v-row dense class="mt-4 hero-stats-grid">
          <v-col v-for="stat in heroStats" :key="stat.label" cols="12" sm="6" md="3">
            <v-sheet rounded="lg" color="surface-variant" class="pa-4 mini-stat-card h-100" border>
              <div class="d-flex ga-3 align-start">
                <v-avatar size="36" variant="tonal" :color="stat.color || 'primary'">
                  <v-icon :icon="stat.icon" size="22" />
                </v-avatar>
                <div class="text-truncate">
                  <div class="text-caption text-medium-emphasis">{{ stat.label }}</div>
                  <div class="text-body-1 font-weight-medium text-truncate">
                    {{ stat.value }}
                  </div>
                  <div v-if="stat.caption" class="text-caption text-medium-emphasis text-truncate">
                    {{ stat.caption }}
                  </div>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ error.message || "No se pudo cargar el producto" }}
    </v-alert>

    <v-skeleton-loader v-else-if="pending" type="card, list-item-two-line, list-item-two-line" class="mb-4" />

    <v-card v-else class="product-card" variant="elevated" rounded="xl">
      <v-card-text class="pt-4 pb-6">
        <v-row dense class="main-form-grid">
          <v-col cols="12" md="8">
            <v-card variant="outlined" rounded="xl" class="section-card mb-4">
              <v-card-title class="section-heading">
                <div>
                  <div class="text-overline text-medium-emphasis">Información principal</div>
                  <div class="text-h6 font-weight-semibold">Descripción del producto</div>
                </div>
                <v-chip color="primary" size="small" variant="tonal" class="text-uppercase" prepend-icon="mdi-pencil">
                  {{ isEditing ? "Editable" : "Solo lectura" }}
                </v-chip>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-4" />
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedProduct.name" label="Nombre del producto" variant="outlined"
                      density="comfortable" :readonly="!isEditing" prepend-inner-icon="mdi-form-textbox" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedProduct.slug" label="Slug" variant="outlined" density="comfortable"
                      :readonly="!isEditing" prepend-inner-icon="mdi-link" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="editedProduct.shortDescription" label="Resumen corto" variant="outlined"
                      density="comfortable" :readonly="!isEditing" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="editedProduct.description" label="Descripción detallada" rows="5" auto-grow
                      variant="outlined" :readonly="!isEditing" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card variant="outlined" rounded="xl" class="section-card mb-4">
              <v-card-title class="section-heading">
                <span>Clasificación</span>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-3" />
                <v-row dense>
                  <v-col cols="12">
                    <v-combobox v-model="selectedCategories" :items="categoryOptions" label="Categorías" multiple chips
                      variant="outlined" density="comfortable" :readonly="!isEditing"
                      prepend-inner-icon="mdi-tag-multiple" hint="Se mostrarán en la tienda" persistent-hint />
                  </v-col>
                  <v-col cols="12">
                    <v-combobox v-model="selectedLabels" :items="labelOptions" label="Etiquetas" multiple chips
                      variant="outlined" density="comfortable" :readonly="!isEditing" prepend-inner-icon="mdi-label"
                      hint="Útiles para filtros internos" persistent-hint />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card variant="outlined" rounded="xl" class="section-card mb-4">
              <v-card-title class="section-heading">
                <span>Inventario</span>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-3" />
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <v-switch v-model="editedProduct.inStock" label="Disponible para venta" color="success"
                      :disabled="!isEditing" inset />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedProduct.restockPoint" type="number" label="Punto de reabasto"
                      variant="outlined" density="comfortable" :readonly="!isEditing" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedProduct.sku" label="SKU" variant="outlined" density="comfortable"
                      :readonly="!isEditing" prepend-inner-icon="mdi-identifier" />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field v-model="editedProduct.barcode" label="Código de barras" variant="outlined"
                      density="comfortable" :readonly="!isEditing" prepend-inner-icon="mdi-barcode" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <v-card variant="outlined" rounded="xl" class="section-card mb-4">
              <v-card-title class="section-heading">
                <span>Pricing</span>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-3" />
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-text-field v-model.number="editedProduct.price" type="number" label="Precio" prefix="$"
                      variant="outlined" density="comfortable" :readonly="!isEditing" />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="editedProduct.currency" :items="currencyOptions" label="Moneda"
                      variant="outlined" density="comfortable" :readonly="!isEditing" />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <div class="d-flex flex-wrap justify-end ga-3" v-if="isEditing">
              <v-btn variant="text" color="secondary" class="text-none" @click="handleCancelEdit">
                Cancelar
              </v-btn>
              <v-btn color="primary" class="text-none" @click="handleSaveDraft">
                Guardar cambios
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4">
            <v-card variant="outlined" rounded="xl" class="side-card mb-4">
              <v-card-title class="section-heading">
                <span>Imágenes</span>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-3" />
                <div class="image-grid">
                  <v-avatar v-for="pic in product.pictures || []" :key="pic.id" size="88" rounded="lg">
                    <v-img :src="pic.imageUrl" alt="Imagen del producto" cover />
                  </v-avatar>
                  <v-avatar v-if="!product.pictures?.length" size="88" rounded="lg" color="surface-variant">
                    <v-icon icon="mdi-image-off" />
                  </v-avatar>
                </div>
                <v-btn block variant="outlined" color="primary" class="mt-4 text-none" :disabled="!isEditing">
                  Administrar galería
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card variant="outlined" rounded="xl" class="side-card mb-4">
              <v-card-title class="section-heading">
                <span>SEO y etiquetas</span>
              </v-card-title>
              <v-card-text class="section-body">
                <v-divider class="my-3" />
                <v-combobox v-model="seoKeywordsInput" label="Palabras clave" chips multiple variant="outlined"
                  density="comfortable" :readonly="!isEditing" prepend-inner-icon="mdi-magnify"
                  hint="Separadas por comas" persistent-hint />
                <div class="d-flex flex-wrap ga-2 mt-3">
                  <v-chip v-for="keyword in seoKeywordsInput" :key="keyword" size="small" variant="tonal"
                    color="secondary" class="seo-chip">
                    {{ keyword }}
                  </v-chip>
                  <span v-if="!seoKeywordsInput.length" class="text-caption text-medium-emphasis">
                    Sin palabras clave
                  </span>
                </div>
              </v-card-text>
            </v-card>

          </v-col>
        </v-row>

        <v-card variant="outlined" rounded="xl" class="section-card technical-card">
          <v-card-title class="section-heading">
            <div>
              <div class="text-overline text-medium-emphasis">Ficha extendida</div>
              <div class="text-h6 font-weight-semibold">Detalles técnicos</div>
            </div>
            <v-chip color="secondary" size="small" variant="tonal" prepend-icon="mdi-lock-outline">
              Datos sincronizados
            </v-chip>
          </v-card-title>
          <v-card-text class="section-body">
            <v-tabs v-model="detailsTab" color="primary" density="comfortable" class="mb-4" grow>
              <v-tab value="features">Características</v-tab>
              <v-tab value="specs">Especificaciones</v-tab>
              <v-tab value="technical">Ficha técnica</v-tab>
            </v-tabs>
            <v-window v-model="detailsTab">
              <v-window-item value="features">
                <div v-if="tabLoaded.features">
                  <template v-if="product.features?.length">
                    <v-table density="comfortable" class="technical-table">
                      <thead>
                        <tr>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="feat in product.features" :key="feat.id">
                          <td>{{ feat.featureText || feat.feature_text }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </template>
                  <v-alert v-else type="info" variant="tonal" class="ma-0">Sin características</v-alert>
                  <div class="technical-actions">
                    <span class="text-caption text-medium-emphasis">Gestionar desde el módulo avanzado</span>
                    <v-btn size="small" variant="text" color="primary" class="text-none" prepend-icon="mdi-open-in-new"
                      :disabled="!product.features?.length" @click="handleTechnicalEdit('features')">
                      Editar características
                    </v-btn>
                  </div>
                </div>
                <v-skeleton-loader v-else type="table" class="technical-skeleton" />
              </v-window-item>

              <v-window-item value="specs">
                <div v-if="tabLoaded.specs">
                  <template v-if="product.specifications?.length">
                    <v-table density="comfortable" class="technical-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="spec in product.specifications" :key="spec.id">
                          <td>{{ spec.specName || spec.spec_name }}</td>
                          <td>{{ spec.specValue || spec.spec_value }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </template>
                  <v-alert v-else type="info" variant="tonal" class="ma-0">Sin especificaciones</v-alert>
                  <div class="technical-actions">
                    <span class="text-caption text-medium-emphasis">Gestionar desde el módulo avanzado</span>
                    <v-btn size="small" variant="text" color="primary" class="text-none" prepend-icon="mdi-open-in-new"
                      :disabled="!product.specifications?.length" @click="handleTechnicalEdit('specs')">
                      Editar especificaciones
                    </v-btn>
                  </div>
                </div>
                <v-skeleton-loader v-else type="table" class="technical-skeleton" />
              </v-window-item>

              <v-window-item value="technical">
                <div v-if="tabLoaded.technical">
                  <template v-if="product.technicalSpecs?.length">
                    <v-table density="comfortable" class="technical-table">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="tech in product.technicalSpecs" :key="tech.id">
                          <td>{{ tech.specName || tech.spec_name }}</td>
                          <td>{{ tech.specValue || tech.spec_value }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </template>
                  <v-alert v-else type="info" variant="tonal" class="ma-0">Sin ficha técnica</v-alert>
                  <div class="technical-actions">
                    <span class="text-caption text-medium-emphasis">Gestionar desde el módulo avanzado</span>
                    <v-btn size="small" variant="text" color="primary" class="text-none" prepend-icon="mdi-open-in-new"
                      :disabled="!product.technicalSpecs?.length" @click="handleTechnicalEdit('technical')">
                      Editar ficha técnica
                    </v-btn>
                  </div>
                </div>
                <v-skeleton-loader v-else type="table" class="technical-skeleton" />
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { Product, ProductRecord } from "~~/types/cms";

definePageMeta({
  layout: "default",
});

type DetailSection = "features" | "specs" | "technical";

const route = useRoute();
const productId = ref<number>(Number(route.params.id));
const { smAndDown } = useDisplay();
const isEditing = ref(false);
const detailsTab = ref<DetailSection>("features");
const tabLoaded = reactive<Record<DetailSection, boolean>>({
  features: true,
  specs: false,
  technical: false,
});
const editedProduct = reactive<Partial<ProductRecord>>({});
const selectedCategories = ref<string[]>([]);
const selectedLabels = ref<string[]>([]);
const seoKeywordsInput = ref<string[]>([]);
const currencyOptions = ["MXN", "USD", "EUR"];

const { data, pending, error, refresh } = useFetch<{ data: Product }>(
  () => `/api/products/${productId.value}`,
  {
    immediate: true,
    server: true,
    watch: [productId],
  },
);

const product = computed<Product>(() => data.value?.data || ({} as Product));
const editModeLabel = computed(() => (isEditing.value ? "Modo edición" : "Solo lectura"));
const syncFormState = () => {
  if (!product.value) {
    return;
  }

  Object.assign(editedProduct, {
    name: product.value.name || "",
    slug: product.value.slug || "",
    shortDescription: product.value.shortDescription || "",
    description: product.value.description || "",
    price: product.value.price ?? undefined,
    currency: product.value.currency || "MXN",
    sku: product.value.sku || "",
    barcode: product.value.barcode || "",
    restockPoint: product.value.restockPoint ?? undefined,
    inStock: product.value.inStock ?? false,
  });

  selectedCategories.value = product.value.categories?.map((cat) => cat.name) ?? [];
  selectedLabels.value = product.value.labels?.map((label) => label.name) ?? [];
  seoKeywordsInput.value =
    product.value.seoKeywords?.map((kw) => (typeof kw === "string" ? kw : kw.keyword)) ?? [];
};

watch(
  product,
  () => {
    syncFormState();
  },
  { immediate: true },
);

watch(isEditing, (isActive) => {
  if (!isActive) {
    syncFormState();
  }
});

watch(detailsTab, (section) => {
  tabLoaded[section] = true;
});

const productTitle = computed(
  () =>
    editedProduct.name || product.value.name || `Producto #${productId.value}`,
);

const formattedPrice = computed(() => {
  const price = editedProduct.price ?? product.value?.price;
  if (price === undefined || price === null) {
    return "—";
  }

  const currency = editedProduct.currency || product.value.currency || "MXN";

  try {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency,
    }).format(price);
  } catch (_err) {
    return `${currency} ${price}`.trim();
  }
});

const categoryOptions = computed(() => product.value.categories?.map((cat) => cat.name) ?? []);
const labelOptions = computed(() => product.value.labels?.map((label) => label.name) ?? []);

const stockStatus = computed(() => {
  const stockState = editedProduct.inStock ?? product.value.inStock;
  if (stockState === undefined) {
    return {
      label: "Sin dato",
      color: "warning",
      icon: "mdi-help-circle",
    };
  }

  return {
    label: stockState ? "Disponible" : "Sin stock",
    color: stockState ? "success" : "error",
    icon: stockState ? "mdi-package-check" : "mdi-package-variant-remove",
  };
});

const heroStats = computed(() => [
  {
    label: "Inventario",
    value: stockStatus.value.label,
    caption: `Reabasto: ${editedProduct.restockPoint ?? product.value.restockPoint ?? "—"}`,
    icon: stockStatus.value.icon,
    color: stockStatus.value.color,
  },
  {
    label: "Precio",
    value: formattedPrice.value,
    caption: editedProduct.currency || product.value.currency || "MXN",
    icon: "mdi-currency-usd",
    color: "primary",
  },
  {
    label: "SKU",
    value: editedProduct.sku || product.value.sku || "—",
    caption: "Identificador interno",
    icon: "mdi-shape-outline",
    color: "primary",
  },
  {
    label: "Código de barras",
    value: editedProduct.barcode || product.value.barcode || "—",
    caption: "Escaneable",
    icon: "mdi-barcode",
    color: "primary",
  },
]);

const handleSaveDraft = () => {
  console.info("Pending save implementation", {
    id: productId.value,
    product: { ...editedProduct },
    categories: [...selectedCategories.value],
    labels: [...selectedLabels.value],
    seoKeywords: [...seoKeywordsInput.value],
  });
};

const handleTechnicalEdit = (section: DetailSection) => {
  console.info("Pending navigation to technical editor", {
    section,
    productId: productId.value,
  });
};

const handleCancelEdit = () => {
  isEditing.value = false;
  syncFormState();
};

const navigateBack = () => {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    navigateTo("/products");
  }
};

onBeforeRouteUpdate((to, _from, next) => {
  productId.value = Number(to.params.id);
  refresh();
  next();
});

onMounted(() => {
  if (!Number.isFinite(productId.value)) {
    navigateTo("/products");
  }
});
</script>

<style scoped lang="scss">
.product-detail-view {
  max-width: 1200px;
  margin-inline: auto;
}

.chip-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hero-stats-grid {
  row-gap: 16px;
}

.mini-stat-card {
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.mini-stat-card:hover {
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.section-card,
.side-card {
  background-color: rgba(var(--v-theme-surface), 0.9);
}

.section-body {
  padding: 0 24px 24px;
  display: block;
}

.technical-card {
  margin-top: 32px;
}

.technical-table {
  border-radius: 12px;
  overflow: hidden;
}

.technical-table th {
  background-color: rgba(var(--v-theme-primary), 0.06);
  font-weight: 600;
}

.technical-table th,
.technical-table td {
  padding: 12px 16px;
}

.technical-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.technical-skeleton {
  border-radius: 12px;
}

.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.main-form-grid {
  row-gap: 24px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.seo-chip {
  letter-spacing: 0.4px;
}

.feature-panel :deep(.v-expansion-panel-title__content) {
  font-weight: 600;
}

.edit-toggle {
  min-width: 152px;
}

@media (max-width: 960px) {
  .section-heading {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .product-detail-view {
    padding-inline: 0;
  }

  .mini-stat-card {
    padding: 1rem;
  }

  .section-body {
    padding: 0 16px 20px;
  }

  .technical-card {
    margin-top: 24px;
  }

  .technical-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
