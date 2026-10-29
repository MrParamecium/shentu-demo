import { Suspense } from "react";
import ProgramList from "./ProgramList";
import { PROGRAMS } from "@/lib/programs";

export const metadata = { title: "项目库 · 申途 Demo" };

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">项目库</h1>
        <p className="mt-1 text-sm text-slate-500">
          收录 {PROGRAMS.length} 个英港新热门授课型硕士项目（美国项目收录中），2027 年入学信息均对照学校官网核实（每张卡片标有核实日期），申请前请再到官网确认。
        </p>
      </div>
      {/* useSearchParams 需要 Suspense 边界 */}
      <Suspense>
        <ProgramList />
      </Suspense>
    </div>
  );
}
