// ============================================
// hook-novel — Admin Data Service (Server Actions)
// ============================================

"use server";

import { fetchGAS } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

/**
 * Fetch total statistics for the admin dashboard.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetchGAS<DashboardStats>("getDashboardStats", {
    cache: "no-store",
  });
  
  if (!response.success) {
    return {
      novelCount: 0,
      publishedChapters: 0,
      draftChapters: 0,
      totalWordCount: 0,
    };
  }
  
  return response.data;
}
