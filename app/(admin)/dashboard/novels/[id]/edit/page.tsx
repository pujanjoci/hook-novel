import { notFound } from "next/navigation";
import { getNovelById } from "@/services/novels";
import NovelForm from "@/components/admin/NovelForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNovelPage({ params }: PageProps) {
  const { id } = await params;
  const novel = await getNovelById(id);

  if (!novel) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl tracking-tight mb-2">Edit Novel</h1>
        <p className="text-text-muted text-sm capitalize">
          Update the metadata for <span className="italic">&quot;{novel.title}&quot;</span>.
        </p>
      </div>

      <NovelForm initialData={novel} />
    </div>
  );
}
