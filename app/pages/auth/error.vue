<template>
  <v-app>
    <v-container fluid class="fill-height d-flex align-center justify-center">
      <v-card max-width="500" class="text-center pa-8">
        <v-icon icon="mdi-alert-circle" size="64" color="error" class="mb-4" />
        <h1 class="text-h5 mb-2">Authentication Error</h1>
        <p class="text-medium-emphasis mb-6">
          {{ errorMessage }}
        </p>
        <div class="text-caption text-medium-emphasis mb-6">
          <div>Code: <strong>{{ errorCode || "unknown" }}</strong></div>
          <div v-if="errorDescription">Details: {{ errorDescription }}</div>
          <div v-if="callbackUrl">Callback: {{ callbackUrl }}</div>
        </div>
        <v-btn color="primary" to="/login" prepend-icon="mdi-login">
          Back to Login
        </v-btn>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: "/" },
});

const route = useRoute();
const errorCode = computed(() => (route.query.error as string) || "");
const errorDescription = computed(() => route.query.message as string | undefined);
const callbackUrl = computed(() => route.query.callbackUrl as string | undefined);

const errorMessage = computed(() => {
  const error = errorCode.value;

  switch (error) {
    case "Verification":
      return "The verification link is invalid or has expired.";
    case "Configuration":
      return "There is a problem with the server configuration.";
    case "AccessDenied":
      return "Access denied. You do not have permission to sign in.";
    case "OAuthSignin":
    case "OAuthCallback":
    case "OAuthCreateAccount":
    case "EmailCreateAccount":
    case "Callback":
      return "An error occurred during the authentication process.";
    case "OAuthAccountNotLinked":
      return "Account already exists with a different provider.";
    case "EmailSignin":
      return "Failed to send verification email.";
    case "CredentialsSignin":
      return "Invalid credentials. Please check your email and password.";
    case "SessionRequired":
      return "Please sign in to access this page.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
});
</script>
