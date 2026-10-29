"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout, useAuth } from "@/lib/auth";
import { useHydrated } from "@/lib/store";

const NAV = [
  { href: "/", label: "首页" },
  { href: "/programs", label: "项目库" },
  { href: "/dashboard", label: "我的申请" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="bg-brand text-white">
      {/* 窄屏：logo + 账号一行，导航换到第二行；sm 以上三者同一行 */}
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="text-2xl font-bold tracking-wide">申途</span>
          <span className="hidden text-xs text-white/70 sm:inline">英港新美硕士申请管家</span>
        </Link>
        <nav aria-label="主导航" className="order-last flex w-full gap-6 whitespace-nowrap sm:order-none sm:w-auto">
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
        <div className="ml-auto flex min-w-0 items-center gap-4">
          <span className="hidden rounded bg-white/15 px-2 py-0.5 text-xs sm:inline">Demo</span>
          <AccountMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function AccountMenu({ pathname }: { pathname: string }) {
  const auth = useAuth();
  const hydrated = useHydrated();
  // 挂载前不渲染，避免服务端和客户端显示不一致
  if (!hydrated) return <span className="w-16" aria-hidden />;
  if (!auth) {
    const next = pathname === "/login" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return (
      <Link
        href={`/login${next}`}
        className="shrink-0 rounded-md bg-white px-3 py-1 text-sm font-medium whitespace-nowrap text-brand hover:bg-brand-soft"
      >
        登录
      </Link>
    );
  }
  return (
    <div className="flex min-w-0 items-center gap-3 text-sm">
      <span className="max-w-36 truncate text-white/90 sm:max-w-48" title={auth.email}>
        {auth.email}
      </span>
      <button
        type="button"
        onClick={logout}
        className="shrink-0 text-white/70 underline-offset-4 hover:text-white hover:underline"
      >
        退出
      </button>
    </div>
  );
}
