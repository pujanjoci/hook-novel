import Link from "next/link";
import Image from "next/image";
import type { Novel } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface NovelCardProps {
  novel: Novel;
  priority?: boolean;
}

export default function NovelCard({ novel, priority }: NovelCardProps) {
  // eslint-disable-next-line react-hooks/purity
  const isNewUpdate = novel.chapterCount > 0 && (Date.now() - new Date(novel.updatedAt).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/novels/${novel.slug}`}
      className="group block space-y-3 focus:outline-none"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-surface rounded-sm border border-border transition-colors group-hover:border-accent/20">
        {isNewUpdate && (
          <div className="absolute top-2 right-2 z-10 bg-accent text-white text-[9px] font-sans uppercase tracking-widest font-bold px-2 py-1 rounded shadow-md">
            New Chapters
          </div>
        )}
        <Image
          src={novel.coverUrl}
          alt={novel.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
          {novel.title}
        </h3>
        <div className="flex flex-wrap gap-1">
          {novel.genres.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="default" className="text-[10px] uppercase tracking-wider px-1.5 py-0">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
