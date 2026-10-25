import { Suspense } from "react";
import CustomProgramForm from "./CustomProgramForm";

export const metadata = { title: "手动添加项目 · 申途 Demo" };

export default function CustomProgramPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">手动添加项目</h1>
        <p className="mt-1 text-sm text-slate-500">
          项目库里找不到你要申的项目？自己填一下，同样可以跟踪材料、节点和截止日期。
        </p>
      </div>
      {/* useSearchParams 需要 Suspense 边界 */}
      <Suspense>
        <CustomProgramForm />
      </Suspense>
    </div>
  );
}
