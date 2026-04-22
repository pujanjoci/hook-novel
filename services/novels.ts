// ============================================
// hook-novel — Novel Data Service (Server Actions)
// ============================================

"use server";

import { fetchGAS } from "@/lib/api";
import { revalidatePath, revalidateTag } from "next/cache";
import type { Novel, NovelWithChapters } from "@/lib/types";

/**
 * Fetch all published novels for the public listing.
 */
export async function getNovels(): Promise<Novel[]> {
  const response = await fetchGAS<Novel[]>("getNovels", {
    revalidate: 300, // Revalidate every 5 minutes
  });
  if (!response.success || !Array.isArray(response.data)) return [];
  return response.data;
}

/**
 * Fetch a single novel by its slug, including its chapter listing.
 */
export async function getNovelBySlug(
  slug: string
): Promise<NovelWithChapters | null> {
  const response = await fetchGAS<NovelWithChapters>("getNovelBySlug", {
    body: { slug },
    revalidate: 300,
  });
  if (!response.success) return null;
  return response.data;
}

/**
 * Fetch featured novels for the homepage.
 */
export async function getFeaturedNovels(): Promise<Novel[]> {
  const response = await fetchGAS<Novel[]>("getFeaturedNovels", {
    revalidate: 600, // 10 minutes
  });
  if (!response.success || !Array.isArray(response.data)) return [];
  return response.data;
}

// ---- Admin Operations ----

/**
 * Fetch all novels (including unpublished) for admin management.
 */
export async function getAllNovels(): Promise<Novel[]> {
  const response = await fetchGAS<Novel[]>("getAllNovels", {
    cache: "no-store",
  });
  if (!response.success || !Array.isArray(response.data)) return [];
  return response.data;
}


/**
 * Fetch a single novel by ID for editing.
 */
export async function getNovelById(id: string): Promise<Novel | null> {
  const response = await fetchGAS<Novel>("getNovelById", {
    body: { id },
    cache: "no-store",
  });
  if (!response.success) return null;
  return response.data;
}

/**
 * Create a new novel.
 */
export async function createNovel(
  data: Omit<Novel, "id" | "slug" | "chapterCount" | "wordCount" | "createdAt" | "updatedAt">
): Promise<Novel> {
  const response = await fetchGAS<Novel>("createNovel", {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
  
  if (!response.success) {
    throw new Error(response.error || "Failed to create novel");
  }

  revalidatePath("/");
  revalidatePath("/novels");
  revalidateTag("novels", "default");

  return response.data;
}

/**
 * Update an existing novel.
 */
export async function updateNovel(
  id: string,
  data: Partial<Novel>
): Promise<Novel> {
  const response = await fetchGAS<Novel>("updateNovel", {
    method: "POST",
    body: { id, ...data } as unknown as Record<string, unknown>,
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to update novel");
  }

  revalidatePath("/");
  revalidatePath("/novels");
  revalidatePath(`/novels/${response.data.slug}`);
  revalidateTag("novels", "default");

  return response.data;
}
