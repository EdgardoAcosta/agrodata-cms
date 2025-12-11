<template>
  <v-container fluid class="pa-4">
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="text-caption text-medium-emphasis mb-1">
          CMS · Taxonomía
        </div>
        <h1 class="text-h5">Categorías</h1>
      </v-col>
    </v-row>

    <v-card>
      <ClientOnly>
        <v-data-table-server v-model:items-per-page="itemsPerPage" v-model:page="page" v-model:sort-by="sortBy"
          :search="search" :headers="headers" :items="categories" :items-length="totalItems" :loading="loading"
          class="elevation-0" @update:options="loadItems">

          <!-- Integrated filter toolbar -->
          <template #top>
            <v-toolbar flat density="compact" class="px-2">
              <v-toolbar-title class="text-caption text-medium-emphasis">
                {{ totalItems }} categorías
              </v-toolbar-title>
              <v-spacer />
              <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" label="Buscar" single-line hide-details
                density="compact" variant="outlined" clearable style="max-width: 300px" class="mr-2" />
              <v-btn icon="mdi-refresh" variant="text" :loading="loading" @click="loadItems" />
              <v-btn icon="mdi-plus" color="primary" variant="elevated" @click="openCreate" />
            </v-toolbar>
          </template>
          <template #item.name="{ item }">
            <div class="font-weight-medium">{{ item.name }}</div>
          </template>
          <template #item.description="{ item }">
            <span class="text-medium-emphasis">{{
              item.description || "Sin descripción"
              }}</span>
          </template>
          <template #item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-btn size="small" variant="tonal" color="primary" @click="openEdit(item)"> <v-icon
                  icon="mdi-pencil" /></v-btn>
              <v-btn size="small" variant="text" color="error" @click="confirmDelete(item)"><v-icon
                  icon="mdi-delete" /></v-btn>
            </div>
          </template>
          <template #no-data>
            <div class="py-4 text-center text-medium-emphasis">
              No hay categorías todavía
            </div>
          </template>
        </v-data-table-server>
      </ClientOnly>
    </v-card>

    <v-dialog v-model="formOpen" max-width="520" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <div>
            <div class="text-caption text-medium-emphasis mb-1">Gestión</div>
            <div class="text-h6">
              {{ isEditing ? "Editar" : "Crear" }} categoría
            </div>
          </div>
          <v-btn icon variant="text" @click="closeForm">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleSubmit">
            <v-row dense>
              <v-col cols="12">
                <v-text-field v-model="form.name" label="Nombre" required placeholder="Ej. Monitoreo" />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="form.description" label="Descripción" rows="3" auto-grow
                  placeholder="Breve nota" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions class="d-flex justify-end ga-2">
          <v-btn variant="text" @click="closeForm">Cancelar</v-btn>
          <v-btn color="primary" :loading="saving" @click="handleSubmit">
            {{ isEditing ? "Guardar cambios" : "Crear categoría" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
type Category = {
  id: number;
  name: string;
  description: string;
};

const route = useRoute();
// Support multiple query param names for flexibility
const initialSearch = (route.query.categoryId as string) || 
                     (route.query.name as string) || 
                     (route.query.search as string) || 
                     "";
const search = ref(initialSearch);
const requestFetch = useRequestFetch();
const formOpen = ref(false);
const saving = ref(false);
const editingId = ref<number | null>(null);
const form = reactive<{ name: string; description: string }>({
  name: "",
  description: "",
});
const isEditing = computed(() => Boolean(editingId.value));

// Server-side pagination
const categories = ref<Category[]>([]);
const loading = ref(false);
const page = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(0);
const sortBy = ref<any[]>([]);

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Nombre", key: "name", sortable: true },
  { title: "Descripción", key: "description", sortable: false },
  { title: "Acciones", key: "actions", sortable: false },
];

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

    const response = await requestFetch<{ data: Category[]; total: number }>(
      "/api/categories",
      {
        params: {
          page: page.value,
          itemsPerPage: itemsPerPage.value,
          sortBy: sortByParam,
          sortOrder: sortOrderParam,
          search: search.value || undefined,
        },
      },
    );
    categories.value = response.data;
    totalItems.value = response.total;
  } catch (error: any) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(search, () => {
  page.value = 1;
  loadItems();
});

const resetForm = () => {
  form.name = "";
  form.description = "";
  editingId.value = null;
};

const openCreate = () => {
  resetForm();
  formOpen.value = true;
};

const openEdit = (category: Category) => {
  editingId.value = category.id;
  form.name = category.name;
  form.description = category.description;
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
      await requestFetch(`/api/categories/${editingId.value}`, {
        method: "PATCH",
        body: { ...form },
      });
    } else {
      await requestFetch("/api/categories", { method: "POST", body: { ...form } });
    }
    await loadItems();
    closeForm();
  } catch (error: any) {
    console.error(error);
    window.alert("Error al guardar categoría");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (category: Category) => {
  const confirmed = confirm(`¿Eliminar "${category.name}"?`);
  if (!confirmed) return;
  try {
    await requestFetch(`/api/categories/${category.id}`, { method: "DELETE" });
    await loadItems();
  } catch (error: any) {
    console.error(error);
    window.alert("No se pudo eliminar la categoría");
  }
};
</script>
