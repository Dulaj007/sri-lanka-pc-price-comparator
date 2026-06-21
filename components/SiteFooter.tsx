import Link from "next/link";

// The footer shared by every page. Kept deliberately light - the
// disclaimer lives on the canvas's own hover button and on the About
// page, not duplicated here too.
export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 ">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 text-center">
        <nav aria-label="Footer" className="flex items-center gap-4 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            Home
          </Link>
          <Link href="/docs" className="hover:text-zinc-300 transition-colors">
            Docs
          </Link>
          <Link href="/about" className="hover:text-zinc-300 transition-colors">
            About
          </Link>
        </nav>

        <p className="text-xs text-zinc-500">
          Made with{" "}
          <span className="text-red-500" aria-label="love">♥</span>
          {" "}by{" "}
          <a
            href="https://github.com/Dulaj007"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-300 underline underline-offset-2 hover:text-white transition-colors"
          >
            Dulaj
          </a>
          {" · "}
          <a
            href="https://github.com/Dulaj007"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            github.com/Dulaj007
          </a>
        </p>
      </div>
    </footer>
  );
}
