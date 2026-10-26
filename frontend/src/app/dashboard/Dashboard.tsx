"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveProgram } from "@/lib/programs";
import { useApplications, useHydrated } from "@/lib/store";
import { isRolling, nextDeadline, urgencyOf, type Upcoming } from "@/lib/deadline";
import { REGION_INFO, REGION_ORDER } from "@/lib/regions";
import { STAGES } from "@/lib/stages";
import type { Region } from "@/lib/types";
import DeadlinePill from "@/components/DeadlinePill";

const sortKey = (u: Upcoming | null) => (!u ? Infinity : isRolling(u) ? Number.MAX_SAFE_INTEGER : u.daysLeft);

export default function Dashboard() {
  const apps = useApplications();
  const hydrated = useHydrated();
  const router = useRouter();
  const params = useSearchParams();
  // 默认显示全部地区（联申的人多）；地区页跳过来时带 ?region=HK
  const raw = params.get("region");
  const region: Region | "ALL" = REGION_ORDER.includes(raw as Region) ? (raw as Region) : "ALL";

  const all = apps
    .map(app => {
      const program = resolveProgram(app);
      return program ? { app, program, next: nextDeadline(app, program) } : null;
    })
    .filter(r => r !== null)
    // 有截止日期的按剩余天数升序；滚动录取排在其后；没有待办截止的排最后
    .sort((a, b) => sortKey(a.next) - sortKey(b.next));
  const rows = region === "ALL" ? all : all.filter(r => r.program.region === region);
  const countOf = (r: Region) => all.filter(x => x.program.region === r).length;
  const setRegion = (r: Region | "ALL") => router.replace(r === "ALL" ? "/dashboard" : `/dashboard?region=${r}`);
  const tabs: { value: Region | "ALL"; label: string; count: number }[] = [
    { value: "ALL", label: "全部", count: all.length },
    ...REGION_ORDER.map(r => ({ value: r, label: REGION_INFO[r].label, count: countOf(r) })),
  ];

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

      {all.length > 0 && (
        <div role="group" aria-label="按地区筛选" className="flex flex-wrap gap-2">
          {tabs.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setRegion(t.value)}
              aria-pressed={region === t.value}
              className={`rounded-full border px-4 py-1.5 text-sm ${region === t.value ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              {t.value !== "ALL" && <span aria-hidden>{REGION_INFO[t.value].flag} </span>}
              {t.label} <span className="opacity-70">{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {rows.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600">
            {region === "ALL" ? "还没有添加任何项目" : `还没有${REGION_INFO[region].label}的申请`}
          </p>
          <Link
            href={region === "ALL" ? "/" : `/programs?region=${region}`}
            className="mt-4 inline-block text-brand underline underline-offset-4"
          >
            {region === "ALL" ? "先选一个地区开始 →" : `去添加${REGION_INFO[region].label}项目 →`}
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
