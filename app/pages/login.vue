<template>
  <v-app>
    <v-container fluid class="fill-height d-flex align-center justify-center bg-surface-variant">
      <v-card max-width="400" width="100%" elevation="8">
        <v-card-title class="text-h5 text-center pa-6">
          <v-avatar color="primary" size="56" class="mb-4">
            <v-icon icon="mdi-warehouse" size="32" />
          </v-avatar>
          <div>WarehouseOps</div>
          <div class="text-caption text-medium-emphasis font-weight-regular">
            Warehouse CRM
          </div>
        </v-card-title>

        <v-card-text class="pb-6">
          <v-alert
            v-if="hasSubmitted && error"
            type="error"
            variant="tonal"
            class="mb-4"
            closable
            @click:close="error = ''"
          >
            {{ error }}
          </v-alert>

          <v-form @submit.prevent="handleLogin">
            <v-text-field v-model="credentials.email" label="Email o usuario" type="text" prepend-inner-icon="mdi-email"
              variant="outlined" :disabled="loading" required class="mb-2" />

            <v-text-field v-model="credentials.password" label="Password" :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined" :disabled="loading" required @click:append-inner="showPassword = !showPassword" />

            <v-btn type="submit" color="primary" size="large" block :loading="loading" class="mt-4">
              Sign In
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }

});

const { signIn } = useAuth();
const route = useRoute();
const callbackUrl = computed(() => {
  const value = route.query.callbackUrl;
  if (Array.isArray(value)) {
    return value[0] || "/";
  }
  return value || "/";
});

const credentials = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");
const hasSubmitted = ref(false);
const showPassword = ref(false);

const authErrorMessage = (code?: string) => {
  switch (code) {
    case "Verification":
      return "The verification link is invalid or has expired.";
    case "Configuration":
      return "There is a problem with the server configuration.";
    case "AccessDenied":
      return "Access denied. You do not have permission to sign in.";
    case "OAuthAccountNotLinked":
      return "Account already exists with a different provider.";
    case "CredentialsSignin":
      return "Invalid email or password";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An error occurred during login. Please try again.";
  }
};

const handleLogin = async () => {
  hasSubmitted.value = true;
  loading.value = true;
  error.value = "";

  try {
    const result = await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      callbackUrl: callbackUrl.value || "/",
      redirect: true,
    });

    // If redirect is disabled for some reason, surface errors
    if (result?.error) {
      error.value = authErrorMessage(result.error);
    }
  } catch (err: any) {
    console.error("Login error:", err);
    error.value = err.message || "An error occurred during login";
  } finally {
    loading.value = false;
  }
};

const incomingError = computed(() => route.query.error as string | undefined);

watchEffect(() => {
  if (incomingError.value) {
    error.value = authErrorMessage(incomingError.value);
  }
});
</script>
