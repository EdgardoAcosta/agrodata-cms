import type { H3Event } from "h3";
import { requireUserSession } from "./auth";

/**
 * Utility to proxy requests to the external API with authentication
 */
export async function proxyToExternalAPI(
  event: H3Event,
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: any;
    includeQuery?: boolean;
  } = {}
) {
  const session = await requireUserSession(event);
  const config = useRuntimeConfig();
  const apiBaseUrl = config.apiBaseUrl || "http://localhost:8883";

  const { method = "GET", body, includeQuery = true } = options;

  // Build URL with query parameters if needed
  let url = `${apiBaseUrl}${endpoint}`;
  if (includeQuery && method === "GET") {
    const query = getQuery(event);
    const queryString = new URLSearchParams(query as any).toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  try {
    const response = await $fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${(session as any).accessToken}`,
        "Content-Type": "application/json",
      },
      body: body ? body : undefined,
    });

    return response;
  } catch (error: any) {
    console.error(`External API error [${method} ${endpoint}]:`, error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "External API request failed",
    });
  }
}
