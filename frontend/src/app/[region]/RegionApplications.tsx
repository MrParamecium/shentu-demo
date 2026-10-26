"use client";

import Link from "next/link";
import { resolveProgram } from "@/lib/programs";
import { useApplications, useHydrated } from "@/lib/store";
import { nextDeadline } from "@/lib/deadline";
import { REGION_INFO } from "@/lib/regions";
import { STAGES } from "@/lib/stages";
import type { Region } from "@/lib/types";
import DeadlinePill from "@/components/DeadlinePill";

/** 地区页底部：只列这个地区的申请，完整看板在「我的申请」 */
export default function RegionApplications({ region, slug }: { region: Region; slug: string }) {
  const apps = useApplications();
  const hydrated = useHydrated();
  const label = REGION_INFO[region].label;

  const rows = apps
    .map(app => ({ app, program: resolveProgram(app) }))
    .filter((r): r is { app: typeof r.app; program: NonNullable<typeof r.program> } => r.program?.region === region);

  return (
    <section aria-labelledby="mine-title" className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="mine-title" className="font-semibold text-slate-800">
          我的{label}申请
        </h2>
        <Link href={`/dashboard?region=${region}`} className="text-sm text-brand hover:underline">
          在看板中查看 →
        </Link>
      </div>

      {!hydrated ? (
        <p className="mt-4 text-sm text-slate-400">加载中…</p>
      ) : rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          还没有{label}的申请。
          <Link href={`/programs?region=${region}`} className="text-brand underline underline-offset-4">
            去项目库添加
          </Link>
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {rows.map(({ app, program }) => (
            <li key={app.id}>
              <Link
                href={`/dashboard/${app.id}`}
                data-region={slug}
                className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-slate-50"
              >
                <div>
                  <p className="text-sm text-slate-500">{program.schoolCn}</p>
                  <p className="font-medium text-slate-800">{program.nameCn}</p>
                  <p className="text-xs text-slate-500">当前：{STAGES[region][app.stage].label}</p>
                </div>
                <DeadlinePill next={nextDeadline(app, program)} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
