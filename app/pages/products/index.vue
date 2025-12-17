<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-caption text-medium-emphasis mb-1">CMS · Catálogo</div>
        <h1 class="text-h5">Productos</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        v-model:sort-by="sortBy"
        :search="search"
        :headers="headers"
        :items="products"
        :items-length="totalItems"
        :loading="loading"
        class="elevation-0"
        @update:options="loadItems"
      >
        <!-- Integrated filter toolbar -->
        <template #top>
          <!-- Single responsive toolbar -->
          <div class="pa-3">
            <v-row dense align="center">
              <!-- Title and count -->
              <v-col cols="auto" class="text-caption text-medium-emphasis">
                {{ totalItems }} productos
              </v-col>

              <v-spacer />

              <!-- Desktop filters (hidden on mobile) -->
              <v-col cols="auto" class="d-none d-md-flex">
                <div class="d-flex ga-2 align-center">
                  <v-text-field
                    v-model="search"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Buscar"
                    single-line
                    hide-details
                    density="compact"
                    variant="outlined"
                    clearable
                    style="width: 200px"
                  />
                  <v-select
                    v-model="categoryFilter"
                    :items="categoryOptions"
                    item-title="label"
                    item-value="value"
                    prepend-inner-icon="mdi-folder-outline"
                    placeholder="Categoría"
                    density="compact"
                    hide-details
                    variant="outlined"
                    clearable
                    style="width: 160px"
                  />
                  <v-select
                    v-model="labelFilter"
                    :items="labelOptions"
                    item-title="label"
                    item-value="value"
                    prepend-inner-icon="mdi-tag-outline"
                    placeholder="Etiqueta"
                    density="compact"
                    hide-details
                    variant="outlined"
                    clearable
                    style="width: 160px"
                  />
                </div>
              </v-col>

              <!-- Action buttons -->
              <v-col cols="auto">
                <div class="d-flex ga-2">
                  <!-- Filter button (mobile only) -->
                  <v-btn
                    icon="mdi-filter-variant"
                    variant="text"
                    size="small"
                    class="d-md-none"
                    @click="filterSheet = true"
                  >
                    <v-icon>mdi-filter-variant</v-icon>
                    <v-badge
                      v-if="search || categoryFilter || labelFilter"
                      color="primary"
                      :content="activeFiltersCount"
                      floating
                    />
                  </v-btn>
                  <v-btn
                    icon="mdi-refresh"
                    variant="text"
                    size="small"
                    :loading="loading"
                    @click="loadItems"
                  />
                  <v-btn
                    icon="mdi-plus"
                    color="primary"
                    size="small"
                    @click="openCreate"
                  />
                </div>
              </v-col>
            </v-row>

            <!-- Active filter chips row -->
            <v-row
              v-if="search || categoryFilter || labelFilter"
              dense
              class="mt-2"
            >
              <v-col cols="12">
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-if="search"
                    closable
                    size="small"
                    @click:close="search = ''"
                  >
                    {{ search }}
                  </v-chip>
                  <v-chip
                    v-if="categoryFilter"
                    closable
                    size="small"
                    color="primary"
                    variant="tonal"
                    @click:close="categoryFilter = null"
                  >
                    {{
                      categoryOptions.find((c) => c.value === categoryFilter)
                        ?.label
                    }}
                  </v-chip>
                  <v-chip
                    v-if="labelFilter"
                    closable
                    size="small"
                    color="secondary"
                    variant="tonal"
                    @click:close="labelFilter = null"
                  >
                    {{
                      labelOptions.find((l) => l.value === labelFilter)?.label
                    }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </div>
        </template>

        <template #item.name="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
          <div class="text-caption text-medium-emphasis">
            {{ item.shortDescription }}
          </div>
          <div
            class="text-caption text-medium-emphasis"
            style="font-size: 0.7rem"
          >
            {{ item.slug }}
          </div>
        </template>
        <template #item.categories="{ item }">
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="cat in item.categories"
              :key="cat.id"
              size="small"
              variant="tonal"
              @click="navigateToCategory(cat.id)"
            >
              {{ cat.name }}
            </v-chip>
          </div>
        </template>
        <template #item.labels="{ item }">
          <div class="d-flex flex-wrap ga-1">
            <v-chip
              v-for="label in item.labels"
              :key="label.id"
              size="small"
              color="primary"
              variant="elevated"
            >
              {{ label.name }}
            </v-chip>
          </div>
        </template>
        <template #item.price="{ item }">
          <div class="font-weight-medium">
            {{ formatCurrency(item.price, item.currency) }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.inStock ? "En stock" : "Sin stock" }}
          </div>
        </template>
        <template #item.restockPoint="{ item }">
          <div class="font-weight-medium">
            {{ item.restockPoint ?? "-" }}
          </div>
        </template>

        <template #item.featured="{ item }">
          <v-chip :color="item.featured ? 'green' : 'grey'" size="small">
            {{ item.featured ? "Destacado" : "Normal" }}
          </v-chip>
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-btn
              size="small"
              variant="text"
              color="secondary"
              @click="navigateTo(`/products/${item.id}`)"
              ><v-icon icon="mdi-eye"
            /></v-btn>
            <v-btn
              size="small"
              variant="text"
              color="primary"
              @click="openEdit(item)"
              ><v-icon icon="mdi-pencil"
            /></v-btn>
            <v-btn
              size="small"
              variant="text"
              color="error"
              @click="confirmDelete(item)"
              ><v-icon icon="mdi-delete"
            /></v-btn>
          </div>
        </template>
        <template #no-data>
          <div class="py-4 text-center text-medium-emphasis">
            No hay productos con los filtros actuales
          </div>
        </template>
      </v-data-table-server>
    </v-card>

    <!-- Mobile filter bottom sheet -->
    <v-bottom-sheet v-model="filterSheet">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>Filtros</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="filterSheet = false"
          />
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                label="Buscar producto"
                hide-details
                density="comfortable"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="categoryFilter"
                :items="categoryOptions"
                item-title="label"
                item-value="value"
                prepend-inner-icon="mdi-folder-outline"
                label="Categoría"
                hide-details
                density="comfortable"
                variant="outlined"
                clearable
              />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="labelFilter"
                :items="labelOptions"
                item-title="label"
                item-value="value"
                prepend-inner-icon="mdi-tag-outline"
                label="Etiqueta"
                hide-details
                density="comfortable"
                variant="outlined"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="clearFilters">Limpiar filtros</v-btn>
          <v-spacer />
          <v-btn color="primary" @click="filterSheet = false">Aplicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>

    <v-dialog v-model="formOpen" max-width="720" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <div class="text-caption text-medium-emphasis mb-1">Gestión</div>
            <div class="text-h6">
              {{ isEditing ? "Editar" : "Crear" }} producto
            </div>
          </div>
          <v-btn icon variant="text" @click="closeForm">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  required
                  placeholder="Nombre del producto"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.slug"
                  label="Slug"
                  placeholder="auto-generado"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.barcode"
                  label="Barcode"
                  placeholder="e.g., 7501234567890"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="form.sku"
                  label="SKU"
                  placeholder="e.g., PROD-001"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.price"
                  type="number"
                  label="Precio"
                  min="0"
                  step="0.01"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-text-field
                  v-model="form.currency"
                  label="Moneda"
                  placeholder="MXN"
                />
              </v-col>
              <v-col cols="6" md="3" class="d-flex align-center ga-3">
                <v-switch
                  v-model="form.inStock"
                  label="Disponible"
                  hide-details
                  density="compact"
                />
                <v-switch
                  v-model="form.featured"
                  label="Destacado"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.shortDescription"
                  label="Resumen"
                  placeholder="Descripción corta"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="form.restockPoint"
                  type="number"
                  label="Punto de reabasto"
                  min="0"
                  step="1"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-textarea
                  v-model="form.description"
                  label="Descripción"
                  rows="4"
                  auto-grow
                  placeholder="Detalle"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.categoryIds"
                  :items="categoryOptions"
                  item-title="label"
                  item-value="value"
                  label="Categorías"
                  multiple
                  clearable
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="form.labelIds"
                  :items="labelOptions"
                  item-title="label"
                  item-value="value"
                  label="Etiquetas"
                  multiple
                  clearable
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="closeForm">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" @click="handleSubmit">
            {{ isEditing ? "Guardar cambios" : "Crear producto" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";

type Category = { id: number; name: string; description: string };
type Label = { id: number; name: string; description: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  inStock: boolean;
  featured: boolean;
  image: string;
  restockPoint?: number;
  categories: Category[];
  labels: Label[];
};

type ProductPayload = {
  name: string;
  slug: string;
  barcode?: string;
  sku?: string;
  description: string;
  shortDescription: string;
  price: number;
  currency: string;
  inStock: boolean;
  featured: boolean;
  image: string;
  restockPoint?: number;
  categoryIds: number[];
  labelIds: number[];
};

const products = ref<Product[]>([]);
const loading = ref(false);
const saving = ref(false);
const search = ref("");
const categoryFilter = ref<number | null>(null);
const labelFilter = ref<number | null>(null);
const formOpen = ref(false);
const filterSheet = ref(false);
const editingId = ref<number | null>(null);
const isEditing = computed(() => Boolean(editingId.value));

// Handle query parameters (from warehouse)
const route = useRoute();
onMounted(() => {
  // Check if we should open create dialog with barcode pre-filled
  if (route.query.create === "true" && route.query.barcode) {
    form.barcode = String(route.query.barcode);
    formOpen.value = true;
  }
});

// Count active filters
const activeFiltersCount = computed(() => {
  let count = 0;
  if (search.value) count++;
  if (categoryFilter.value) count++;
  if (labelFilter.value) count++;
  return count;
});

// Clear all filters
const clearFilters = () => {
  search.value = "";
  categoryFilter.value = null;
  labelFilter.value = null;
};

// Server-side pagination
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const sortBy = ref<any[]>([]);

const form = reactive<ProductPayload>({
  name: "",
  slug: "",
  barcode: "",
  sku: "",
  description: "",
  shortDescription: "",
  price: 0,
  currency: "MXN",
  inStock: true,
  featured: false,
  image: "/assets/img/products/product-box.svg",
  restockPoint: undefined,
  categoryIds: [],
  labelIds: [],
});

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Producto", key: "name" },
  { title: "Categorías", key: "categories", sortable: false },
  { title: "Etiquetas", key: "labels", sortable: false },
  { title: "Precio", key: "price", sortable: true },
  { title: "Punto de reabasto", key: "restockPoint", sortable: true },
  { title: "Destacado", key: "featured", sortable: true },
  { title: "Acciones", key: "actions", sortable: false },
];

const { data: categoryData } = useFetch<{ data: { items: Category[] } }>(
  "/api/categories",
);
const { data: labelData } = useFetch<{ data: { items: Label[] } }>(
  "/api/labels",
);

const categoryOptions = computed(() =>
  (categoryData.value?.data?.items || []).map((cat) => ({
    label: cat.name,
    value: cat.id,
  })),
);
const labelOptions = computed(() =>
  (labelData.value?.data?.items || []).map((label) => ({
    label: label.name,
    value: label.id,
  })),
);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

watch(
  () => form.name,
  (name) => {
    if (!editingId.value) {
      form.slug = slugify(name || "");
    }
  },
);

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(
    value || 0,
  );

const loadItems = async () => {
  loading.value = true;
  try {
    const sortByParam =
      sortBy.value.length > 0 ? sortBy.value[0].key : undefined;
    const sortOrderParam =
      sortBy.value.length > 0
        ? sortBy.value[0].order === "desc"
          ? "desc"
          : "asc"
        : "asc";

    const { data } = await useFetch<{
      data: {
        items: Product[];
        total: number;
        page: number;
        itemsPerPage: number;
        pageCount: number;
      };
    }>("/api/products", {
      params: {
        page: page.value,
        itemsPerPage: itemsPerPage.value,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
        search: search.value || undefined,
        categoryId: categoryFilter.value || undefined,
        labelId: labelFilter.value || undefined,
      },
    });
    products.value = data.value?.data?.items || [];
    totalItems.value = data.value?.data?.total || 0;
  } catch (error: any) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const debouncedLoad = useDebounceFn(loadItems, 250);
watch([search, categoryFilter, labelFilter], () => {
  page.value = 1; // Reset to first page on filter change
  debouncedLoad();
});

const resetForm = () => {
  Object.assign(form, {
    name: "",
    slug: "",
    barcode: "",
    sku: "",
    description: "",
    shortDescription: "",
    price: 0,
    currency: "MXN",
    inStock: true,
    featured: false,
    image: "/assets/img/products/product-box.svg",
    restockPoint: undefined,
    categoryIds: [],
    labelIds: [],
  });
  editingId.value = null;
};

const openCreate = () => {
  resetForm();
  formOpen.value = true;
};

const openEdit = (product: Product) => {
  editingId.value = product.id;
  Object.assign(form, {
    name: product.name,
    slug: product.slug,
    barcode: (product as any).barcode || "",
    sku: (product as any).sku || "",
    description: product.description,
    shortDescription: product.shortDescription,
    price: product.price,
    currency: product.currency,
    inStock: product.inStock,
    featured: product.featured,
    image: product.image,
    restockPoint: product.restockPoint,
    categoryIds: product.categories.map((c) => c.id),
    labelIds: product.labels.map((l) => l.id),
  });
  formOpen.value = true;
};

const closeForm = () => {
  formOpen.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!form.name.trim()) {
    window.alert("El nombre es obligatorio");
    return;
  }
  saving.value = true;
  try {
    if (editingId.value) {
      await $fetch(`/api/products/${editingId.value}`, {
        method: "PUT",
        body: { ...form },
      });
    } else {
      await $fetch("/api/products", { method: "POST", body: { ...form } });
    }
    await loadItems();
    closeForm();
  } catch (error: any) {
    console.error(error);
    window.alert("Error al guardar producto");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (product: Product) => {
  const confirmed = confirm(`¿Eliminar "${product.name}"?`);
  if (!confirmed) return;
  try {
    await $fetch(`/api/products/${product.id}`, { method: "DELETE" });
    await loadItems();
  } catch (error: any) {
    console.error(error);
    window.alert("No se pudo eliminar el producto");
  }
};
const navigateToCategory = (categoryId: number) => {
  navigateTo(`/cms/categories?categoryId=${categoryId}`);
};
</script>
