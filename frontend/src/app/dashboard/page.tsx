import { Suspense } from "react";
import Dashboard from "./Dashboard";

export const metadata = { title: "我的申请 · 申途 Demo" };

export default function DashboardPage() {
  return (
    // useSearchParams（地区筛选）需要 Suspense 边界
    <Suspense fallback={<p className="text-slate-400">加载中…</p>}>
      <Dashboard />
    </Suspense>
  );
}
