import NovelForm from "@/components/admin/NovelForm";

export default function NewNovelPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl tracking-tight mb-2">Create Novel</h1>
        <p className="text-text-muted text-sm capitalize">Add a new web novel to your platform.</p>
      </div>

      <NovelForm />
    </div>
  );
}
