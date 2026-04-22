// ============================================
// hook-novel — Google Apps Script API Helper
// ============================================

import type { ApiResponse } from "@/lib/types";

const GAS_ENDPOINT = process.env.GAS_ENDPOINT;
const GAS_KEY = process.env.GAS_KEY;

if (!GAS_ENDPOINT) {
  console.warn(
    "[hook-novel] GAS_ENDPOINT is not set. API calls will fail. " +
    "Add it to .env.local"
  );
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  /** Cache strategy for Next.js fetch */
  cache?: RequestCache;
  /** Revalidation interval in seconds */
  revalidate?: number;
}

/**
 * Generic fetch wrapper for Google Apps Script API.
 * All GAS communication flows through this single function.
 *
 * GAS web apps only support GET and POST. For mutation actions,
 * we send a POST with an `action` field in the body.
 */
export async function fetchGAS<T>(
  action: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> {
  if (!GAS_ENDPOINT) {
    return {
      success: false,
      data: null as T,
      error: "GAS_ENDPOINT is not configured",
    };
  }

  const { method = "GET", body, cache, revalidate } = options;

  try {
    const fetchOptions: RequestInit & { next?: { revalidate?: number } } = {
      method: method === "GET" ? "GET" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Set caching strategy
    if (revalidate !== undefined) {
      fetchOptions.next = { revalidate };
    } else if (cache) {
      fetchOptions.cache = cache;
    } else if (method !== "GET") {
      // Mutations should never be cached
      fetchOptions.cache = "no-store";
    }

    let url = GAS_ENDPOINT;

    if (method === "GET") {
      // For GET requests, pass action as a query param
      const params = new URLSearchParams({ action });
      if (body) {
        Object.entries(body).forEach(([key, value]) => {
          params.set(key, String(value));
        });
      }
      url = `${GAS_ENDPOINT}?${params.toString()}`;
    } else {
      // For mutations, send action + payload in the body
      // We also append the API KEY as a query param for security
      const params = new URLSearchParams({ action });
      if (GAS_KEY) params.set("key", GAS_KEY);
      
      // Pass ID as param if exists for convenience
      if (body?.id) params.set("id", String(body.id));
      if (body?.novelId) params.set("novelId", String(body.novelId));

      url = `${GAS_ENDPOINT}?${params.toString()}`;
      fetchOptions.body = JSON.stringify(body || {});
    }


    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json() as ApiResponse<T>;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown API error";
    console.error(`[hook-novel] API error (${action}):`, message);
    return {
      success: false,
      data: null as T,
      error: message,
    };
  }
}
