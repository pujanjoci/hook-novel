import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNovelBySlug } from "@/services/novels";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate, formatWordCount } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) return { title: "Novel Not Found" };

  return {
    title: novel.title,
    description: novel.synopsis.slice(0, 160),
    openGraph: {
      images: [novel.coverUrl],
    },
  };
}

export default async function NovelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const novel = await getNovelBySlug(slug);

  if (!novel) {
    notFound();
  }

  const firstChapter = novel.chapters.find((c) => c.number === 1) || novel.chapters[0];

  return (
    <article className="py-16 md:py-24">
      <div className="container-site">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          {/* Left Column: Cover */}
          <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-surface rounded-sm border border-border shadow-sm">
              <Image
                src={novel.coverUrl}
                alt={novel.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>

          {/* Right Column: Metadata */}
          <div className="flex-1 space-y-8">
            <header className="space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {novel.genres.map((genre) => (
                    <Badge key={genre} className="uppercase tracking-widest text-[10px] px-2 py-0.5">
                      {genre}
                    </Badge>
                  ))}
                </div>
                <h1 className="font-serif text-4xl md:text-5xl leading-tight tracking-tight">
                  {novel.title}
                </h1>
                <p className="text-lg text-text-muted font-serif italic">
                  by {novel.author}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted border-y border-border/50 py-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Status</span>
                  <span className="font-medium text-text capitalize">{novel.isPublished ? "Ongoing" : "Completed"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Word Count</span>
                  <span className="font-medium text-text">{formatWordCount(novel.wordCount)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Chapters</span>
                  <span className="font-medium text-text">{novel.chapters.length}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest opacity-60">Last Updated</span>
                  <span className="font-medium text-text">{formatDate(novel.updatedAt)}</span>
                </div>
              </div>
            </header>

            <div className="space-y-6">
              <div className="prose-editorial max-w-2xl leading-relaxed text-text/80">
                <p className="whitespace-pre-line">{novel.synopsis}</p>
              </div>

              {firstChapter && (
                <Link href={`/novels/${novel.slug}/${firstChapter.number}`}>
                  <Button size="lg" className="px-10">
                    Start Reading
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <section className="mt-24 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl tracking-tight">Contents</h2>
            <span className="text-xs text-text-muted uppercase tracking-widest">
              {novel.chapters.length} Chapters
            </span>
          </div>

          <div className="grid gap-px bg-border border border-border overflow-hidden rounded-sm">
            {novel.chapters.length > 0 ? (
              novel.chapters
                .sort((a, b) => a.number - b.number)
                .map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/novels/${novel.slug}/${chapter.number}`}
                    className="group flex items-center justify-between bg-bg p-4 hover:bg-surface transition-colors"
                  >
                    <div className="flex gap-4 items-baseline">
                      <span className="text-sm font-mono text-text-muted group-hover:text-accent opacity-40">
                        {String(chapter.number).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                        {chapter.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      {chapter.status === "draft" && (
                        <Badge variant="status" status="draft" className="text-[9px]">Draft</Badge>
                      )}
                      <span className="text-[10px] text-text-muted/60 uppercase tracking-widest font-sans">
                        {formatDate(chapter.publishedAt || chapter.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))
            ) : (
              <div className="bg-bg p-12 text-center">
                <p className="text-text-muted italic text-sm">No chapters published yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}

