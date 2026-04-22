import React from "react";

export default function DashboardLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4"></div>
      <p className="text-text-muted text-sm animate-pulse">Loading dashboard data...</p>
    </div>
  );
}
