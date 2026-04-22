"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createChapter, updateChapter } from "@/services/chapters";
import type { Chapter } from "@/lib/types";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface ChapterFormProps {
  novelId: string;
  initialData?: Chapter;
}

export default function ChapterForm({ novelId, initialData }: ChapterFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    number: initialData?.number || 1,
    content: initialData?.content || "",
    status: initialData?.status || "draft",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (initialData) {
        await updateChapter(initialData.id, { ...formData, novelId } as Parameters<typeof updateChapter>[1]);
      } else {
        await createChapter({ ...formData, novelId } as Parameters<typeof createChapter>[0]);
      }
      
      router.push(`/dashboard/chapters?novelId=${novelId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Chapter Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Introduction"
          />
        </div>
        <Input
          label="Chapter Number"
          name="number"
          type="number"
          value={formData.number}
          onChange={handleChange}
          required
          min={1}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest text-text-muted font-sans font-medium">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full bg-bg border border-border rounded-md px-3 py-2 text-sm font-sans focus:outline-none focus:border-accent"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <p className="text-[10px] text-text-muted italic">
          Only published chapters are visible to readers on the public site.
        </p>
      </div>

      <Textarea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleChange}
        required
        placeholder="Once upon a time..."
        rows={25}
        className="font-serif leading-relaxed text-lg"
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-border">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Chapter"
            : "Publish Chapter"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
