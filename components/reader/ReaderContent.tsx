"use client";

import { useReader } from "@/hooks/useReader";
import { cn } from "@/lib/utils";

interface ReaderContentProps {
  content: string;
}

export default function ReaderContent({ content }: ReaderContentProps) {
  const { fontSize, isMounted } = useReader();

  if (!isMounted) {
    return (
      <div className="prose-reader opacity-0">
        <p className="whitespace-pre-line">{content}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "prose-reader transition-[font-size] duration-200",
        fontSize === "sm" && "reader-sm",
        fontSize === "md" && "reader-md",
        fontSize === "lg" && "reader-lg"
      )}
    >
      <p className="whitespace-pre-line">{content}</p>
    </div>
  );
}
