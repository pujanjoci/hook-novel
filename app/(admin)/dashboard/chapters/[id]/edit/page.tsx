import { notFound } from "next/navigation";
import { getChapterById } from "@/services/chapters";
import { getNovelById } from "@/services/novels";
import ChapterForm from "@/components/admin/ChapterForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditChapterPage({ params }: PageProps) {
  const { id } = await params;
  const chapter = await getChapterById(id);

  if (!chapter) {
    notFound();
  }

  const novel = await getNovelById(chapter.novelId);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center gap-2 text-text-muted text-xs uppercase tracking-widest mb-2">
          <span>{novel?.title || "Novel"}</span>
          <span>/</span>
          <span>Edit Chapter {chapter.number}</span>
        </div>
        <h1 className="font-serif text-3xl tracking-tight mb-2">Edit Chapter</h1>
        <p className="text-text-muted text-sm capitalize">
          Update the content and metadata for <span className="italic">&quot;{chapter.title}&quot;</span>.
        </p>
      </div>

      <ChapterForm novelId={chapter.novelId} initialData={chapter} />
    </div>
  );
}
