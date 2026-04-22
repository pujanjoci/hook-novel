import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans font-medium tracking-wide transition-colors rounded-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        // Variants
        variant === "primary" &&
          "bg-accent text-bg hover:bg-accent-hover",
        variant === "secondary" &&
          "border border-border text-text hover:bg-surface",
        variant === "ghost" &&
          "text-text-muted hover:text-text hover:bg-surface",
        // Sizes
        size === "sm" && "text-xs px-3 py-1.5",
        size === "md" && "text-sm px-4 py-2",
        size === "lg" && "text-base px-6 py-2.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
