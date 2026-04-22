import Link from "next/link";
import { getAllNovels } from "@/services/novels";
import { getAllChapters } from "@/services/chapters";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import { formatDate } from "@/lib/utils";

interface PageProps {
  searchParams: Promise<{ novelId?: string }>;
}

import NovelSelector from "@/components/admin/NovelSelector";
import DeleteChapterButton from "@/components/admin/DeleteChapterButton";

export default async function AdminChaptersPage({ searchParams }: PageProps) {
  const { novelId } = await searchParams;
  const result = await getAllNovels();
  const novels = Array.isArray(result) ? result : [];
  
  const selectedNovel = novelId 
    ? novels.find(n => n.id === novelId) 
    : (novels.length > 0 ? novels[0] : null);

  let chaptersResult = selectedNovel 
    ? await getAllChapters(selectedNovel.id) 
    : [];
    
  const chapters = Array.isArray(chaptersResult) ? chaptersResult : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="font-serif text-3xl tracking-tight mb-1">Chapters</h1>
          <p className="text-text-muted text-sm capitalize">
            {selectedNovel 
              ? `Managing chapters for "${selectedNovel.title}"` 
              : "Select a novel to manage its chapters."}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="w-full sm:w-64">
            <NovelSelector novels={novels} selectedId={selectedNovel?.id} />
          </div>
          
          {selectedNovel && (
            <Link href={`/dashboard/chapters/new?novelId=${selectedNovel.id}`} className="w-full sm:w-auto">
              <Button size="sm" className="w-full sm:w-auto">New Chapter</Button>
            </Link>
          )}
        </div>
      </div>

      <Divider />

      <div className="bg-bg border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface text-[10px] uppercase tracking-widest text-text-muted border-b border-border">
                <th className="px-6 py-3 font-medium w-16 text-center">#</th>
                <th className="px-6 py-3 font-medium">Chapter Title</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {chapters.length > 0 ? (
                chapters
                  .sort((a, b) => a.number - b.number)
                  .map((chapter) => (
                  <tr key={chapter.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-text-muted text-center">
                      {String(chapter.number).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-serif text-lg leading-tight">{chapter.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={chapter.status} className="text-[9px]">
                        {chapter.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">
                      {formatDate(chapter.publishedAt || chapter.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/chapters/${chapter.id}/edit`}
                          className="text-xs text-text-muted hover:text-accent transition-colors underline underline-offset-4"
                        >
                          Edit
                        </Link>
                        {selectedNovel && (
                          <Link
                            href={`/novels/${selectedNovel.slug}/${chapter.number}`}
                            target="_blank"
                            className="text-xs text-text-muted hover:text-accent transition-colors underline underline-offset-4"
                          >
                            Preview
                          </Link>
                        )}
                        <DeleteChapterButton id={chapter.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic text-sm">
                    {selectedNovel 
                      ? "No chapters found for this novel." 
                      : "Please select a novel first."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

