"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/novels", label: "Novels" },
  { href: "/dashboard/chapters", label: "Chapters" },
] as const;

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when pathname changes
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Mobile Header Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border px-4 flex items-center justify-between z-30">
        <Link href="/" className="font-serif text-lg tracking-tight text-text">
          hook<span className="text-text-muted">novel</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-text hover:text-accent transition-colors"
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 lg:w-56 shrink-0 border-r border-border bg-surface z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 hidden lg:block">
          <Link
            href="/"
            className="font-serif text-lg tracking-tight text-text"
            aria-label="Return to public site"
          >
            hook
            <span className="text-text-muted">novel</span>
          </Link>
          <p className="text-xs text-text-muted mt-1 tracking-wide uppercase">
            Admin
          </p>
        </div>

        <div className="lg:hidden p-6 border-b border-border mb-4">
           <p className="text-xs text-text-muted tracking-wide uppercase">
            Admin Menu
          </p>
        </div>

        <nav aria-label="Admin navigation" className="px-3 pb-6 flex flex-col h-full lg:h-auto">
          <ul className="list-none m-0 p-0 space-y-1">
            {ADMIN_NAV.map(({ href, label }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      "block px-3 py-2 text-sm rounded-md transition-colors",
                      isActive
                        ? "bg-accent text-bg font-medium"
                        : "text-text-muted hover:text-text hover:bg-surface"
                    )}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto lg:hidden pt-4 border-t border-border">
             <Link
              href="/"
              className="flex items-center px-3 py-2 text-sm text-text-muted hover:text-text transition-colors"
            >
              &larr; Back to site
            </Link>
          </div>
        </nav>

        {/* Desktop Back to site link */}
        <div className="hidden lg:block px-6 mt-auto pb-6 border-t border-border pt-4">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-text transition-colors"
          >
            &larr; Back to site
          </Link>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
