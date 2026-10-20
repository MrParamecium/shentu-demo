import { Suspense } from "react";
import ProgramList from "./ProgramList";

export const metadata = { title: "项目库 · 申途 Demo" };

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">项目库</h1>
        <p className="mt-1 text-sm text-slate-500">Demo 收录 8 个英港热门授课型硕士项目，截止日期为示例数据。</p>
      </div>
      {/* useSearchParams 需要 Suspense 边界 */}
      <Suspense>
        <ProgramList />
      </Suspense>
    </div>
  );
}
