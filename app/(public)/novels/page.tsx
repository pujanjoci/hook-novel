import type { Metadata } from "next";
import Link from "next/link";
import { getNovels } from "@/services/novels";
import NovelCard from "@/components/novel/NovelCard";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Novels",
  description: "Explore our collection of serialized web novels.",
};

export default async function NovelsPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const novels = await getNovels();
  const { genre: activeGenre } = await searchParams;

  // Extract all unique genres defensively
  const allGenres = novels && Array.isArray(novels) 
    ? Array.from(new Set(novels.flatMap((n) => n.genres || []))).sort()
    : [];

  const filteredNovels = activeGenre && Array.isArray(novels)
    ? novels.filter((n) => n.genres && n.genres.includes(activeGenre))
    : novels || [];


  return (
    <section className="py-16 md:py-24">
      <div className="container-site">
        <header className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl mb-4 tracking-tight">Library</h1>
          <p className="text-text-muted text-sm md:text-base max-w-2xl">
            Discover a curated selection of serial web novels. Filter by genre below to find your next story.
          </p>
        </header>

        {/* Genre Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Link href="/novels">
            <Badge
              className={cn(
                "px-4 py-1.5 cursor-pointer transition-colors",
                !activeGenre ? "bg-accent text-bg" : "hover:bg-surface"
              )}
            >
              All
            </Badge>
          </Link>
          {allGenres.map((genre) => (
            <Link key={genre} href={`/novels?genre=${encodeURIComponent(genre)}`}>
              <Badge
                className={cn(
                  "px-4 py-1.5 cursor-pointer transition-colors",
                  activeGenre === genre ? "bg-accent text-bg" : "hover:bg-surface"
                )}
              >
                {genre}
              </Badge>
            </Link>
          ))}
        </div>

        {/* Results Grid */}
        {filteredNovels.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
            {filteredNovels.map((novel) => (
              <NovelCard key={novel.id} novel={novel} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-border rounded-lg">
            <p className="text-text-muted italic">No novels found matching the selected criteria.</p>
            <Link href="/novels" className="text-accent text-sm mt-4 inline-block hover:underline">
              Clear all filters
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

