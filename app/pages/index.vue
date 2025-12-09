<template>
  <v-container fluid class="pa-4">
    <v-row align="center">
      <v-col cols="12" lg="6">
        <div class="text-caption text-medium-emphasis mb-2">Agrodata CMS</div>
        <h1 class="text-h3 font-weight-bold mb-3">Panel interno para catálogos y almacén</h1>
        <p class="text-h6 text-medium-emphasis font-weight-regular">Administra productos, categorías y etiquetas con
          datos de ejemplo basados en el dump SQL. Próximamente: escáner de código y conteo de inventario.</p>
        <div class="d-flex flex-wrap ga-2 mt-6">
          <v-btn color="primary" to="/products">Ir a productos</v-btn>
          <v-btn variant="tonal" to="/cms/labels">Etiquetas</v-btn>
          <v-btn variant="tonal" to="/cms/categories">Categorías</v-btn>
        </div>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card class="pa-4">
          <div class="d-flex flex-column ga-4">
            <div class="d-flex justify-space-between align-center">
              <span class="font-weight-medium">Próximos pasos</span>
              <v-chip color="primary" size="small">Warehouse</v-chip>
            </div>
            <v-list density="compact" class="pa-0">
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-qrcode-scan" color="primary" />
                </template>
                <v-list-item-title class="text-caption">Integrar módulo de escaneo con historial</v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-package-variant" color="primary" />
                </template>
                <v-list-item-title class="text-caption">CRUD de inventario y conteos cíclicos</v-list-item-title>
              </v-list-item>
              <v-list-item class="px-0">
                <template #prepend>
                  <v-icon icon="mdi-shield-check" color="primary" />
                </template>
                <v-list-item-title class="text-caption">Autenticación con @sidebase/nuxt-auth</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
