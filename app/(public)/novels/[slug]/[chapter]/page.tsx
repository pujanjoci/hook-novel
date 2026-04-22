import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapter, getAllChapters, getChapterById } from "@/services/chapters";
import { getNovelBySlug } from "@/services/novels";
import ReaderToolbar from "@/components/reader/ReaderToolbar";
import ReaderContent from "@/components/reader/ReaderContent";
import Divider from "@/components/ui/Divider";
import Badge from "@/components/ui/Badge";
import { ReaderProvider } from "@/hooks/useReader";

interface PageProps {
  params: Promise<{ slug: string; chapter: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug, chapter: chapterNum } = await params;
  const num = parseInt(chapterNum, 10);
  
  let chapter = await getChapter(slug, num);
  
  if (!chapter) {
    const novel = await getNovelBySlug(slug);
    if (novel) {
      const allChapters = await getAllChapters(novel.id);
      const targetMeta = allChapters.find(c => c.number === num);
      if (targetMeta) {
        chapter = await getChapterById(targetMeta.id);
      }
    }
  }

  if (!chapter) return { title: "Chapter Not Found" };

  return {
    title: `Chapter ${chapter.number}: ${chapter.title}`,
  };
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const { slug, chapter: chapterNum } = await params;
  const num = parseInt(chapterNum, 10);

  const novel = await getNovelBySlug(slug);
  
  if (!novel) {
    notFound();
  }

  let chapter = await getChapter(slug, num);
  
  if (!chapter) {
    const allChapters = await getAllChapters(novel.id);
    const targetMeta = allChapters.find(c => c.number === num);
    if (targetMeta) {
      chapter = await getChapterById(targetMeta.id);
    }
  }

  if (!chapter) {
    notFound();
  }

  const hasNext = num < (novel.chapters?.length || 0);
  const hasPrev = num > 1;

  // Find the prev/next chapters safely
  const prevChapter = novel.chapters?.find(c => c.number === num - 1);
  const nextChapter = novel.chapters?.find(c => c.number === num + 1);

  return (
    <div className="min-h-screen bg-bg transition-colors duration-200">
      <ReaderProvider>
        <ReaderToolbar
          novelTitle={novel.title}
          chapterTitle={`Chapter ${chapter.number}: ${chapter.title}`}
          novelSlug={novel.slug}
        />

        <article className="py-16 md:py-24">
          <div className="container-site max-w-[740px] px-6">
            <header className="mb-12 text-center">
              <p className="text-xs text-text-muted uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-3">
                <span>Chapter {chapter.number}</span>
                {chapter.status !== "published" && (
                  <Badge variant="status" status={chapter.status as "draft" | "published" | "archived"} className="text-[9px]">
                    {chapter.status} Preview
                  </Badge>
                )}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight">
                {chapter.title}
              </h1>
            </header>

            <ReaderContent content={chapter.content} />

            <Divider className="my-16 opacity-50" />

            {/* Bottom Navigation */}
            <nav className="flex items-center justify-between gap-8 pb-16">
              <div className="flex-1">
                {hasPrev ? (
                  <Link
                    href={`/novels/${slug}/${num - 1}`}
                    className="group flex flex-col items-start gap-1 focus:outline-none"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
                      Previous Chapter
                    </span>
                    <span className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                      &larr; {prevChapter?.title || `Chapter ${num - 1}`}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`/novels/${slug}`}
                    className="group flex flex-col items-start gap-1 focus:outline-none"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
                      Back to Cover
                    </span>
                    <span className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                      &larr; Library
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex-1 text-right">
                {hasNext ? (
                  <Link
                    href={`/novels/${slug}/${num + 1}`}
                    className="group flex flex-col items-end gap-1 focus:outline-none"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
                      Next Chapter
                    </span>
                    <span className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                      {nextChapter?.title || `Chapter ${num + 1}`} &rarr;
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`/novels/${slug}`}
                    className="group flex flex-col items-end gap-1 focus:outline-none"
                  >
                    <span className="text-[10px] uppercase tracking-widest text-text-muted group-hover:text-accent transition-colors">
                      The End
                    </span>
                    <span className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                      Back to Novel &rarr;
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </article>
      </ReaderProvider>
    </div>
  );
}

