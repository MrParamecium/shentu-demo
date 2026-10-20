"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/programs", label: "项目库" },
  { href: "/dashboard", label: "我的申请" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-brand text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-wide">申途</span>
          <span className="text-xs text-white/70">英港硕士申请管家</span>
        </Link>
        <nav aria-label="主导航" className="flex gap-6">
          {NAV.map(item => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-[15px] font-medium transition-colors hover:text-white ${active ? "text-white underline underline-offset-8" : "text-white/80"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <span className="ml-auto rounded bg-white/15 px-2 py-0.5 text-xs">Demo</span>
      </div>
    </header>
  );
}
