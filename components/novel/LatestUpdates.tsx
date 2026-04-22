"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { ChapterListItem } from "@/lib/types";

type UpdateWithNovel = ChapterListItem & { novelTitle: string; novelSlug: string };

interface LatestUpdatesProps {
  updates: UpdateWithNovel[];
  perPage?: number;
}

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export default function LatestUpdates({ updates, perPage = 10 }: LatestUpdatesProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(updates.length / perPage);
  const paged = updates.slice(page * perPage, (page + 1) * perPage);

  return (
    <div>
      <div className="space-y-1">
        {paged.map((update) => {
          const publishDate = new Date(update.publishedAt || update.createdAt).getTime();
          // eslint-disable-next-line react-hooks/purity
          const isNew = (Date.now() - publishDate) < SEVEN_DAYS_MS;

          return (
            <Link
              key={update.id}
              href={`/novels/${update.novelSlug}/${update.number}`}
              className="group flex items-center justify-between gap-4 py-4 px-4 -mx-4 rounded-md hover:bg-surface/60 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-base group-hover:text-accent transition-colors truncate">
                    {update.novelTitle}
                  </span>
                  {isNew && (
                    <span className="shrink-0 bg-accent text-white text-[9px] font-sans uppercase tracking-widest font-bold px-1.5 py-0.5 rounded">
                      New
                    </span>
                  )}
                </div>
                <span className="text-sm text-text-muted group-hover:text-text transition-colors mt-0.5 block">
                  Chapter {update.number}: {update.title}
                </span>
              </div>
              <span className="text-[10px] text-text-muted/60 uppercase tracking-widest whitespace-nowrap shrink-0">
                {formatDate(update.publishedAt || update.createdAt)}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border/50">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            &larr; Prev
          </button>

          <span className="text-[10px] text-text-muted/60 uppercase tracking-widest font-mono">
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="text-xs uppercase tracking-widest text-text-muted hover:text-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
