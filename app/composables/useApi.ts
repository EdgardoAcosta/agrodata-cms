/**
 * Composable for making API calls to the Nuxt server endpoints
 * The Nuxt server handles authentication with the external API
 *
 */
export const useApi = () => {
  const { signOut } = useAuth();

  /**
   * Make an API request to the Nuxt server endpoint
   * @param endpoint - API endpoint (e.g., '/categories')
   * @param options - Fetch options (method, body, query, etc.)
   */
  const apiCall = async <T>(endpoint: string, options: any = {}) => {
    try {
      const response = await $fetch<T>(`/api${endpoint}`, {
        ...options,
      });

      return response;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, error);

      // Handle authentication errors - JWT token expired
      if (error.statusCode === 401 || error.status === 401) {
        console.warn("Session expired - redirecting to login");

        // Sign out and redirect to login
        await signOut({ callbackUrl: "/login", redirect: true });

        throw new Error("Session expired. Please login again.");
      }

      throw error;
    }
  };

  /**
   * GET request to the API
   */
  const get = <T>(endpoint: string, options?: any) => {
    return apiCall<T>(endpoint, { ...options, method: "GET" });
  };

  /**
   * POST request to the API
   */
  const post = <T>(endpoint: string, body?: any, options?: any) => {
    return apiCall<T>(endpoint, { ...options, method: "POST", body });
  };

  /**
   * PATCH request to the API
   */
  const patch = <T>(endpoint: string, body?: any, options?: any) => {
    return apiCall<T>(endpoint, { ...options, method: "PATCH", body });
  };

  /**
   * PUT request to the API
   */
  const put = <T>(endpoint: string, body?: any, options?: any) => {
    return apiCall<T>(endpoint, { ...options, method: "PUT", body });
  };

  /**
   * DELETE request to the API
   */
  const del = <T>(endpoint: string, options?: any) => {
    return apiCall<T>(endpoint, { ...options, method: "DELETE" });
  };

  return {
    apiCall,
    get,
    post,
    patch,
    put,
    delete: del,
  };
};
