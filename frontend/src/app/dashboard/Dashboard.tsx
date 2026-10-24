"use client";

import Link from "next/link";
import { programById } from "@/lib/programs";
import { useApplications, useHydrated } from "@/lib/store";
import { isRolling, nextDeadline, urgencyOf, type Upcoming } from "@/lib/deadline";
import { REGION_INFO } from "@/lib/regions";
import { STAGES } from "@/lib/stages";
import DeadlinePill from "@/components/DeadlinePill";

const sortKey = (u: Upcoming | null) => (!u ? Infinity : isRolling(u) ? Number.MAX_SAFE_INTEGER : u.daysLeft);

export default function Dashboard() {
  const apps = useApplications();
  const hydrated = useHydrated();

  const rows = apps
    .map(app => {
      const program = programById(app.programId);
      return program ? { app, program, next: nextDeadline(app, program) } : null;
    })
    .filter(r => r !== null)
    // 有截止日期的按剩余天数升序；滚动录取排在其后；没有待办截止的排最后
    .sort((a, b) => sortKey(a.next) - sortKey(b.next));

  const urgent = rows.filter(r => r.next && !isRolling(r.next) && urgencyOf(r.next.daysLeft) === "urgent").length;
  const done = (m: Record<string, boolean>) => Object.values(m).filter(Boolean).length;

  if (!hydrated) return <p className="text-slate-400">加载中…</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">我的申请</h1>
          <p className="mt-1 text-sm text-slate-500">按最近的截止日期排序，红色表示 7 天内截止。</p>
        </div>
        <Link href="/programs" className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark">
          + 添加项目
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600">还没有添加任何项目</p>
          <Link href="/programs" className="mt-4 inline-block text-brand underline underline-offset-4">
            去项目库添加第一个 →
          </Link>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-4">
            {[
              ["申请项目", rows.length],
              ["7 天内截止", urgent],
              ["已收到录取", rows.filter(r => r.app.stage >= 3 && r.app.outcome === "pending").length],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white p-4 shadow-sm">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="mt-1 text-2xl font-bold text-brand-dark">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="space-y-3">
            {rows.map(({ app, program, next }) => {
              const stages = STAGES[program.region];
              const total = program.materials.length;
              return (
                <li key={app.id}>
                  <Link
                    href={`/dashboard/${app.id}`}
                    className="grid gap-4 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md md:grid-cols-[2fr_1.4fr_1fr_1.2fr] md:items-center"
                  >
                    <div>
                      <p className="text-sm text-slate-500">
                        {REGION_INFO[program.region].flag} {program.schoolCn}
                      </p>
                      <p className="font-semibold text-slate-800">{program.nameCn}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500">当前节点</p>
                      <p className="font-medium">
                        {app.outcome === "rejected" ? "未录取" : app.outcome === "waitlist" ? "候补名单" : stages[app.stage].label}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-slate-500">材料</p>
                      <p className="font-medium">
                        {done(app.materials)} / {total}
                      </p>
                      <div className="mt-1 h-1.5 rounded bg-slate-100" aria-hidden>
                        <div className="h-full rounded bg-brand" style={{ width: `${(done(app.materials) / total) * 100}%` }} />
                      </div>
                    </div>
                    <DeadlinePill next={next} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
