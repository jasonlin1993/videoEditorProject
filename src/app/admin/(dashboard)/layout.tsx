import Link from "next/link";

const navItems = [
  { href: "/admin", label: "總覽" },
  { href: "/admin/home", label: "首頁管理" },
  { href: "/admin/works", label: "作品管理" },
  { href: "/admin/contact", label: "聯絡訊息" },
  { href: "/admin/users", label: "使用者" },
] as const;

export default function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1">
      <aside className="w-56 shrink-0 border-r border-black/[.08] px-4 py-6 dark:border-white/[.145]">
        <Link href="/admin" className="px-2 text-sm font-semibold tracking-tight">
          後台管理
        </Link>
        <nav className="mt-6 flex flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1.5 text-zinc-600 hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.06]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-8 py-8">{children}</main>
    </div>
  );
}
