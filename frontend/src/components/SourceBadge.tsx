import type { Program } from "@/lib/types";

/** 官网来源 + 更新时间 + 核实状态，解决「不敢全信」的问题 */
export default function SourceBadge({ program }: { program: Program }) {
  if (program.custom) {
    return (
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">自行添加，未核实</span>
        {program.officialUrl ? (
          <a
            href={program.officialUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-brand underline underline-offset-2 hover:text-brand-dark"
          >
            {program.officialLabel}
            <span className="sr-only">（在新窗口打开）</span>
          </a>
        ) : (
          <span>截止日期请以学校官网为准</span>
        )}
      </p>
    );
  }
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
      <span>来源：</span>
      <a
        href={program.officialUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline underline-offset-2 hover:text-brand-dark"
      >
        {program.officialLabel}
        <span className="sr-only">（在新窗口打开）</span>
      </a>
      <span>· 更新于 {program.updatedAt}</span>
      {program.verified ? (
        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">已核实</span>
      ) : (
        <span className="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">示例数据，未核实</span>
      )}
    </p>
  );
}
