import Link from "next/link";
import { getAllNovels } from "@/services/novels";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Divider from "@/components/ui/Divider";
import { formatDate } from "@/lib/utils";

export default async function AdminNovelsPage() {
  const novels = await getAllNovels();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight mb-1">Novels</h1>
          <p className="text-text-muted text-sm capitalize">Manage your library of web novels.</p>
        </div>
        <Link href="/dashboard/novels/new" className="w-full sm:w-auto">
          <Button size="sm" className="w-full sm:w-auto">Create New Novel</Button>
        </Link>
      </div>

      <Divider />

      <div className="bg-bg border border-border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-surface text-[10px] uppercase tracking-widest text-text-muted border-b border-border">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Author</th>
                <th className="px-6 py-3 font-medium text-center">Chapters</th>
                <th className="px-6 py-3 font-medium">Last Updated</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {novels.length > 0 ? (
                novels.map((novel) => (
                  <tr key={novel.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-serif text-lg leading-tight">{novel.title}</span>
                        <div className="mt-1">
                          {!novel.isPublished && (
                            <Badge className="text-[8px] bg-red-400/10 text-red-400 border-0">Draft</Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-muted">{novel.author}</td>
                    <td className="px-6 py-4 text-sm text-center font-mono">{novel.chapterCount}</td>
                    <td className="px-6 py-4 text-sm text-text-muted">{formatDate(novel.updatedAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/chapters?novelId=${novel.id}`}
                          className="text-xs text-text-muted hover:text-accent transition-colors underline underline-offset-4 font-medium"
                        >
                          Chapters
                        </Link>
                        <Link
                          href={`/dashboard/novels/${novel.id}/edit`}
                          className="text-xs text-text-muted hover:text-accent transition-colors underline underline-offset-4"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/novels/${novel.slug}`}
                          target="_blank"
                          className="text-xs text-text-muted hover:text-accent transition-colors underline underline-offset-4"
                        >
                          Preview
                        </Link>
                      </div>

                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted italic text-sm">
                    No novels found. Click &quot;Create New Novel&quot; to get started.
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
