"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteChapter } from "@/services/chapters";
import Button from "@/components/ui/Button";

interface DeleteChapterButtonProps {
  id: string;
}

export default function DeleteChapterButton({ id }: DeleteChapterButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteChapter(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      alert("Failed to delete chapter. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-600 hover:bg-red-50/10"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
