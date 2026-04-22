import React from "react";

export default function PublicLoading() {
  return (
    <div className="container-site py-16 flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4"></div>
      <p className="text-text-muted font-serif animate-pulse">Loading content...</p>
    </div>
  );
}
