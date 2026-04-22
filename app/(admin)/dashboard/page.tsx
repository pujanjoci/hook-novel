import { getDashboardStats } from "@/services/admin";
import { formatWordCount } from "@/lib/utils";

export default async function DashboardPage() {
  const stats = (await getDashboardStats()) || {
    novelCount: 0,
    publishedChapters: 0,
    draftChapters: 0,
    totalWordCount: 0,
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl tracking-tight mb-2">Dashboard</h1>
        <p className="text-text-muted text-sm capitalize">Overview of your library and publication status.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Novels", value: (stats.novelCount ?? 0).toString() },
          { label: "Published Chapters", value: (stats.publishedChapters ?? 0).toString() },
          { label: "Drafts", value: (stats.draftChapters ?? 0).toString() },
          { label: "Total Words", value: formatWordCount(stats.totalWordCount ?? 0) },
        ].map((stat) => (

          <div
            key={stat.label}
            className="bg-surface border border-border rounded-md p-6 space-y-2"
          >
            <p className="text-sm text-text-muted uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border border-dashed rounded-md p-12 text-center">
        <p className="text-text-muted italic text-sm">
          More detailed analytics and activity logs will appear here in future updates.
        </p>
      </div>
    </div>
  );
}

