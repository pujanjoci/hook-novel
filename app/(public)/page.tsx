import Link from "next/link";
import { getFeaturedNovels } from "@/services/novels";
import { getLatestChapters } from "@/services/chapters";
import NovelCard from "@/components/novel/NovelCard";
import LatestUpdates from "@/components/novel/LatestUpdates";
import Button from "@/components/ui/Button";

export default async function HomePage() {
  const [featuredNovels, latestUpdates] = await Promise.all([
    getFeaturedNovels(),
    getLatestChapters(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container-site">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight max-w-3xl">
            Stories worth staying up for
          </h1>
          <p className="mt-6 text-text-muted text-lg md:text-xl max-w-xl leading-relaxed">
            A quiet home for serial fiction. Premium reading, distraction-free. 
            Curated chapters from the web&apos;s most compelling authors.
          </p>
          <div className="mt-10">
            <Link href="/novels">
              <Button size="lg" className="px-8">
                Start reading
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Novels */}
      <section className="py-20 border-t border-border">
        <div className="container-site">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-serif text-2xl tracking-tight">Featured Stories</h2>
            <Link href="/novels" className="text-sm text-text-muted hover:text-accent transition-colors">
              View all &rarr;
            </Link>
          </div>
          
          {featuredNovels && Array.isArray(featuredNovels) && featuredNovels.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {featuredNovels.map((novel, index) => (
                <NovelCard key={novel.id} novel={novel} priority={index < 4} />
              ))}
            </div>
          ) : (
            <p className="text-text-muted italic text-sm">No featured novels at the moment.</p>
          )}
        </div>
      </section>

      {/* Latest Updates */}
      <section className="py-20 border-t border-border bg-surface/30">
        <div className="container-site max-w-4xl">
          <h2 className="font-serif text-2xl tracking-tight mb-10 text-center">Latest Updates</h2>
          {latestUpdates && Array.isArray(latestUpdates) && latestUpdates.length > 0 ? (
            <LatestUpdates updates={latestUpdates} />
          ) : (
            <p className="text-center text-text-muted italic text-sm">No recent updates available.</p>
          )}

        </div>
      </section>
    </>
  );
}
