import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "申途 · 英港新美硕士申请进度管家（Demo）",
  description: "专为英国、香港、新加坡、美国授课型硕士申请者设计的进度管理工具：截止日期、材料清单、录取节点一目了然。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* Header 用到 usePathname，动态路由下需要 Suspense 边界 */}
        <Suspense fallback={<div className="h-16 bg-brand" />}>
          <Header />
        </Suspense>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          Demo 版本 · 截止日期于 2026-10-20 核实，学校可能调整，请以官网为准 · 数据仅保存在本浏览器
        </footer>
      </body>
    </html>
  );
}
