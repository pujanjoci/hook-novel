// ============================================
// hook-novel — Core Data Types
// ============================================

export type ChapterStatus = "draft" | "published" | "archived";

export interface Novel {
  /** Unique identifier (from Google Sheets row or generated slug) */
  id: string;
  /** URL-friendly slug derived from the title */
  slug: string;
  /** Novel title */
  title: string;
  /** Author name */
  author: string;
  /** Short synopsis / description */
  synopsis: string;
  /** Cover image URL (externally hosted, e.g. Google Drive public link) */
  coverUrl: string;
  /** Genre tags — maximum 3 displayed */
  genres: string[];
  /** Total number of chapters */
  chapterCount: number;
  /** Estimated total word count */
  wordCount: number;
  /** ISO date string of when the novel was created */
  createdAt: string;
  /** ISO date string of when the novel was last updated */
  updatedAt: string;
  /** Whether the novel is published and visible to readers */
  isPublished: boolean;
}

export interface Chapter {
  /** Unique identifier */
  id: string;
  /** ID of the parent novel */
  novelId: string;
  /** Chapter number (1-indexed) */
  number: number;
  /** Chapter title */
  title: string;
  /** Full chapter content (plain text or minimal HTML) */
  content: string;
  /** Word count for this chapter */
  wordCount: number;
  /** Publication status */
  status: ChapterStatus;
  /** ISO date string of when the chapter was created */
  createdAt: string;
  /** ISO date string of when the chapter was published (null if draft) */
  publishedAt: string | null;
}

/** Lightweight chapter reference for listings (no content body) */
export interface ChapterListItem {
  id: string;
  novelId: string;
  number: number;
  title: string;
  wordCount: number;
  status: ChapterStatus;
  createdAt: string;
  publishedAt: string | null;
}

/** Novel with its chapter listing (for detail pages) */
export interface NovelWithChapters extends Novel {
  chapters: ChapterListItem[];
}

/** API response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

/** Reader preferences persisted to localStorage */
export interface ReaderPreferences {
  fontSize: "sm" | "md" | "lg";
  darkMode: boolean;
}

/** Admin dashboard statistics */
export interface DashboardStats {
  novelCount: number;
  publishedChapters: number;
  draftChapters: number;
  totalWordCount: number;
}
