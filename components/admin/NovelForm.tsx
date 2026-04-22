"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNovel, updateNovel } from "@/services/novels";
import type { Novel } from "@/lib/types";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

interface NovelFormProps {
  initialData?: Novel;
}

export default function NovelForm({ initialData }: NovelFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    author: initialData?.author || "",
    synopsis: initialData?.synopsis || "",
    coverUrl: initialData?.coverUrl || "",
    genres: initialData?.genres.join(", ") || "",
    isPublished: initialData?.isPublished ?? false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      ...formData,
      genres: formData.genres.split(",").map((g) => g.trim()).filter(Boolean),
    };

    try {
      if (initialData) {
        await updateNovel(initialData.id, payload);
      } else {
        await createNovel(payload as Parameters<typeof createNovel>[0]);
      }
      
      router.push("/dashboard/novels");
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="The Great Gatsby"
        />
        <Input
          label="Author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
          placeholder="F. Scott Fitzgerald"
        />
      </div>

      <Textarea
        label="Synopsis"
        name="synopsis"
        value={formData.synopsis}
        onChange={handleChange}
        required
        placeholder="Enter a brief summary of the novel..."
        rows={6}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Cover Image URL"
          name="coverUrl"
          value={formData.coverUrl}
          onChange={handleChange}
          required
          placeholder="https://drive.google.com/..."
        />
        <Input
          label="Genres (comma separated)"
          name="genres"
          value={formData.genres}
          onChange={handleChange}
          placeholder="Literary, Classic, Drama"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={formData.isPublished}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
        />
        <label htmlFor="isPublished" className="text-sm font-sans text-text">
          Publish Novel (visible to readers)
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Novel"
            : "Create Novel"}
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
