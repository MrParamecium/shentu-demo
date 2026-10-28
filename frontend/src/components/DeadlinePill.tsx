import { daysText, formatDate, isRolling, urgencyOf, type Upcoming } from "@/lib/deadline";

const STYLE = {
  overdue: "bg-slate-200 text-slate-600",
  urgent: "bg-red-100 text-red-700",
  soon: "bg-amber-100 text-amber-800",
  normal: "bg-emerald-50 text-emerald-700",
};

export default function DeadlinePill({ next }: { next: Upcoming | null }) {
  if (!next) return <span className="text-sm text-slate-400">暂无待办截止</span>;
  if (isRolling(next)) {
    return (
      <div className="text-sm">
        <p className="text-slate-500">{next.label}</p>
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-medium">无固定截止</span>
          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
            尽早申请
          </span>
        </p>
      </div>
    );
  }
  return (
    <div className="text-sm">
      <p className="text-slate-500">{next.label}</p>
      <p className="flex flex-wrap items-center gap-2">
        <span className="font-medium">{formatDate(next.date)}</span>
        <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${STYLE[urgencyOf(next.daysLeft)]}`}>
          {daysText(next.daysLeft)}
        </span>
      </p>
    </div>
  );
}
