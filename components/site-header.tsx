import Link from "next/link";
import type { Route } from "next";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/projects/new", label: "New project" },
  { href: "/demo/outline", label: "Outline demo" },
  { href: "/demo/course", label: "Course demo" }
] as const satisfies ReadonlyArray<{ href: Route; label: string }>;

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-stone-900">
          EasyLMS
        </Link>
        <nav className="flex items-center gap-2 text-sm text-stone-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 transition hover:bg-stone-100 hover:text-stone-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
