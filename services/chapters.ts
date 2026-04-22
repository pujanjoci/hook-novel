// ============================================
// hook-novel — Chapter Data Service (Server Actions)
// ============================================

"use server";

import { unstable_cache } from "next/cache";
import { fetchGAS } from "@/lib/api";
import type { Chapter, ChapterListItem } from "@/lib/types";
import { getNovels, getNovelBySlug } from "@/services/novels";

/**
 * Fetch a single chapter by novel slug and chapter number.
 */
export async function getChapter(
  novelSlug: string,
  chapterNumber: number
): Promise<Chapter | null> {
  const response = await fetchGAS<Chapter>("getChapter", {
    body: { novelSlug, number: chapterNumber },
    revalidate: 60, // Reduced to 1 minute for faster updates
  });
  if (!response.success) return null;
  return response.data;
}

/**
 * Fetch the chapter list for a novel (public — published only).
 */
export async function getChapterList(
  novelId: string
): Promise<ChapterListItem[]> {
  const response = await fetchGAS<ChapterListItem[]>("getChapterList", {
    body: { novelId },
    revalidate: 300,
  });
  if (!response.success) return [];
  return response.data;
}


/**
 * Fetch the latest published chapter per novel (for homepage).
 * Returns one entry per novel — the newest chapter — sorted by publish date.
 * Cached for 5 minutes.
 */
export const getLatestChapters = unstable_cache(
  async (): Promise<
    (ChapterListItem & { novelTitle: string; novelSlug: string })[]
  > => {
    const novels = await getNovels();
    if (!novels || novels.length === 0) return [];

    const latestPerNovel: (ChapterListItem & { novelTitle: string; novelSlug: string })[] = [];

    await Promise.all(
      novels.map(async (novel) => {
        const fullNovel = await getNovelBySlug(novel.slug);
        if (fullNovel && fullNovel.chapters && fullNovel.chapters.length > 0) {
          // chapters are sorted by number asc — grab the last one
          const latest = fullNovel.chapters[fullNovel.chapters.length - 1];
          latestPerNovel.push({
            ...latest,
            novelTitle: novel.title,
            novelSlug: novel.slug,
          });
        }
      })
    );

    return latestPerNovel.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  },
  ["latest-chapters"],
  {
    revalidate: 300, // 5 minutes
    tags: ["chapters", "latest"],
  }
);

// ---- Admin Operations ----

/**
 * Fetch all chapters for a novel (including drafts) for admin.
 */
export async function getAllChapters(
  novelId: string
): Promise<ChapterListItem[]> {
  const response = await fetchGAS<ChapterListItem[]>("getAllChapters", {
    body: { novelId },
    cache: "no-store",
  });
  if (!response.success) return [];
  return response.data;
}

import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Fetch a single chapter by ID for editing.
 */
export async function getChapterById(id: string): Promise<Chapter | null> {
  const response = await fetchGAS<Chapter>("getChapterById", {
    body: { id },
    cache: "no-store",
  });
  if (!response.success) return null;
  return response.data;
}

/**
 * Create a new chapter.
 */
export async function createChapter(
  data: Omit<Chapter, "id" | "wordCount" | "createdAt" | "publishedAt">
): Promise<Chapter> {
  const response = await fetchGAS<Chapter>("createChapter", {
    method: "POST",
    body: data as unknown as Record<string, unknown>,
  });
  
  if (!response.success) {
    throw new Error(response.error || "Failed to create chapter");
  }

  // Clear caches
  revalidatePath("/novels/[slug]", "layout");
  revalidateTag("chapters", "default");
  revalidateTag("latest", "default");

  return response.data;
}

/**
 * Update an existing chapter.
 */
export async function updateChapter(
  id: string,
  data: Partial<Chapter>
): Promise<Chapter> {
  const response = await fetchGAS<Chapter>("updateChapter", {
    method: "POST",
    body: { id, ...data } as unknown as Record<string, unknown>,
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to update chapter");
  }

  // Clear caches
  revalidatePath("/novels/[slug]", "layout");
  revalidateTag("chapters", "default");
  revalidateTag("latest", "default");

  return response.data;
}

/**
 * Delete a chapter.
 */
export async function deleteChapter(id: string): Promise<boolean> {
  const response = await fetchGAS<{ deleted: boolean }>("deleteChapter", {
    method: "POST",
    body: { id },
  });

  if (response.success) {
    revalidatePath("/novels/[slug]", "layout");
    revalidateTag("chapters", "default");
    revalidateTag("latest", "default");
  }

  return response.success;
}
