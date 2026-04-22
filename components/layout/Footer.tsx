import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="container-site py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          {currentYear} hook
          <span className="text-text-muted/60">novel</span>
        </p>
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            <li>
              <Link
                href="/novels"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Browse
              </Link>
            </li>
            <li>
              <a
                href="mailto:hello@hooknovel.com"
                className="text-sm text-text-muted hover:text-text transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
