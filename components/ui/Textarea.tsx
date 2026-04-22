import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm text-text-muted font-sans"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full px-3 py-2 text-sm font-sans",
          "bg-bg text-text placeholder:text-text-muted/60",
          "border border-border rounded-md",
          "transition-colors resize-y min-h-32",
          "focus:outline-none focus:border-accent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          error && "border-red-400",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
