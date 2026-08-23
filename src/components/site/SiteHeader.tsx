import Link from "next/link";

const navLinks = [
  { href: "/works", label: "作品" },
  { href: "/#about", label: "關於" },
] as const;

export default function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between px-6 py-7 lg:px-13">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="text-lg font-semibold tracking-tight text-cream">
            陳某某
          </span>
          <span className="text-xs text-muted">·</span>
          <span className="text-sm text-muted">剪接</span>
        </Link>

        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-cream"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="border border-gold/50 px-5 py-2.5 text-sm text-gold transition-colors hover:border-gold hover:bg-gold/10"
          >
            聯絡我
          </Link>
        </nav>
      </div>
    </header>
  );
}
