"use client";

import { useRouter } from "next/navigation";
import type { Novel } from "@/lib/types";

interface NovelSelectorProps {
  novels: Novel[];
  selectedId?: string;
}

export default function NovelSelector({ novels, selectedId }: NovelSelectorProps) {
  const router = useRouter();

  return (
    <select
      className="text-sm bg-bg border border-border rounded-md px-3 py-2 font-sans focus:outline-none focus:border-accent"
      value={selectedId || ""}
      onChange={(e) => {
        router.push(`/dashboard/chapters?novelId=${e.target.value}`);
      }}
    >
      <option value="" disabled>Select a novel...</option>
      {novels.map((n) => (
        <option key={n.id} value={n.id}>
          {n.title}
        </option>
      ))}
    </select>
  );
}
