import { cn } from "@/lib/utils";
import type { ChapterStatus } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "status";
  status?: ChapterStatus;
  className?: string;
}

const STATUS_STYLES: Record<ChapterStatus, string> = {
  published: "bg-accent/10 text-accent",
  draft: "bg-text-muted/10 text-text-muted",
  archived: "bg-text-muted/5 text-text-muted/60",
};

export default function Badge({
  children,
  variant = "default",
  status,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-xs font-sans font-medium px-2 py-0.5 rounded",
        variant === "default" && "bg-surface text-text-muted border border-border",
        variant === "status" && status && STATUS_STYLES[status],
        className
      )}
    >
      {children}
    </span>
  );
}
