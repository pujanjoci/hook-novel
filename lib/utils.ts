// ============================================
// hook-novel — Utility Helpers
// ============================================

/**
 * Conditionally join class names, filtering out falsy values.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format an ISO date string into a human-readable date.
 * Example: "2024-03-15T10:00:00Z" → "Mar 15, 2024"
 */
export function formatDate(isoString: string | null | undefined): string {
  if (!isoString) return "n/a";
  
  const date = new Date(isoString);
  // Check if date is valid
  if (isNaN(date.getTime())) return "n/a";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a word count into a readable string.
 * Example: 142500 → "142.5k words"
 */
export function formatWordCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k words`;
  }
  return `${count} words`;
}

/**
 * Estimate reading time from word count (average 250 wpm).
 * Returns a human-friendly string like "12 min read".
 */
export function estimateReadTime(wordCount: number): string {
  const minutes = Math.max(1, Math.ceil(wordCount / 250));
  return `${minutes} min read`;
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text to a maximum length, appending an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "\u2026";
}
