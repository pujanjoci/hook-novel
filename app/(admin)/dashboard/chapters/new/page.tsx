import { notFound } from "next/navigation";
import { getNovelById } from "@/services/novels";
import ChapterForm from "@/components/admin/ChapterForm";

interface PageProps {
  searchParams: Promise<{ novelId?: string }>;
}

export default async function NewChapterPage({ searchParams }: PageProps) {
  const { novelId } = await searchParams;

  if (!novelId) {
    return (
      <div className="py-24 text-center">
        <h1 className="font-serif text-2xl mb-4">No Novel Selected</h1>
        <p className="text-text-muted text-sm mb-8">Please select a novel from the chapters list first.</p>
        <a href="/dashboard/chapters" className="text-accent hover:underline">Go to Chapter List</a>
      </div>
    );
  }

  const novel = await getNovelById(novelId);

  if (!novel) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-widest mb-2">
          <span>{novel.title}</span>
          <span>/</span>
          <span>New Chapter</span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight mb-2">Compose Chapter</h1>
        <p className="text-text-muted text-sm capitalize">Write and publish a new chapter for your story.</p>
      </div>

      <ChapterForm novelId={novelId} />
    </div>
  );
}
