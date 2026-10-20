"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { programById } from "@/lib/programs";
import { removeApplication, updateApplication, useApplications, useHydrated } from "@/lib/store";
import { formatDate, nextDeadline } from "@/lib/deadline";
import { CONDITIONS_STAGE, DEPOSIT_STAGE, OFFER_STAGE, STAGES } from "@/lib/stages";
import type { Application, Outcome } from "@/lib/types";
import DeadlinePill from "@/components/DeadlinePill";
import SourceBadge from "@/components/SourceBadge";
import ProgramNotes from "@/components/ProgramNotes";

export default function AppDetail({ id }: { id: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const app = useApplications().find(a => a.id === id);
  const program = app && programById(app.programId);

  if (!hydrated) return <p className="text-slate-400">加载中…</p>;
  if (!app || !program) {
    return (
      <div className="rounded-xl bg-white p-12 text-center shadow-sm">
        <p className="text-slate-600">找不到这条申请，可能已被删除</p>
        <Link href="/dashboard" className="mt-4 inline-block text-brand underline underline-offset-4">
          返回我的申请
        </Link>
      </div>
    );
  }

  const set = (patch: Partial<Application>) => updateApplication(app.id, patch);
  const stages = STAGES[program.region];
  const round = program.rounds[app.roundIndex] ?? program.rounds[0];
  const doneCount = Object.values(app.materials).filter(Boolean).length;
  const allMaterialsDone = doneCount === program.materials.length;

  const onDelete = () => {
    if (!confirm(`确定从我的申请中移除「${program.schoolCn} ${program.nameCn}」？`)) return;
    removeApplication(app.id);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-sm text-brand hover:underline">
        ← 返回我的申请
      </Link>

      <section className="flex flex-wrap items-start justify-between gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="space-y-1">
          <p className="text-sm text-slate-500">
            {program.region === "HK" ? "🇭🇰 香港" : "🇬🇧 英国"} · {program.schoolCn} · {program.school}
          </p>
          <h1 className="text-2xl font-bold text-slate-800">{program.nameCn}</h1>
          <p className="text-slate-500">{program.name}</p>
          <p className="pt-2 text-sm">
            申请轮次：<span className="font-medium">{round.name}</span>（{formatDate(round.deadline)}截止）· 语言：
            {program.language}
          </p>
          <SourceBadge program={program} />
          <div className="pt-2">
            <ProgramNotes program={program} />
          </div>
        </div>
        <DeadlinePill next={nextDeadline(app, program)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section aria-labelledby="materials-title" className="rounded-xl bg-white p-6 shadow-sm">
          <h2 id="materials-title" className="flex items-baseline justify-between font-semibold">
            材料清单
            <span className="text-sm font-normal text-slate-500">
              {doneCount} / {program.materials.length} 已完成
            </span>
          </h2>
          <ul className="mt-4 space-y-1">
            {program.materials.map(m => (
              <li key={m}>
                <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={!!app.materials[m]}
                    onChange={e => set({ materials: { ...app.materials, [m]: e.target.checked } })}
                    className="h-4 w-4 accent-brand"
                  />
                  <span className={app.materials[m] ? "text-slate-400 line-through" : ""}>{m}</span>
                </label>
              </li>
            ))}
          </ul>
          {allMaterialsDone && app.stage === 0 && (
            <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
              材料都齐了，提交网申后在右侧把节点推进到「已提交网申」。
            </p>
          )}
        </section>

        <StageTimeline app={app} region={program.region} set={set} stages={stages} />
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <label htmlFor="note" className="font-semibold">
          备注
        </label>
        <textarea
          id="note"
          value={app.note ?? ""}
          onChange={e => set({ note: e.target.value })}
          rows={3}
          placeholder="例如：推荐人 A 老师说 11 月中旬交；网申账号用学校邮箱注册"
          className="mt-3 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-brand"
        />
      </section>

      <button type="button" onClick={onDelete} className="text-sm text-red-600 hover:underline">
        从我的申请中移除
      </button>
    </div>
  );
}
const OUTCOMES: { value: Outcome; label: string }[] = [
  { value: "pending", label: "进行中" },
  { value: "waitlist", label: "候补名单" },
  { value: "rejected", label: "未录取" },
];

function StageTimeline({
  app,
  region,
  set,
  stages,
}: {
  app: Application;
  region: "HK" | "UK";
  set: (patch: Partial<Application>) => void;
  stages: (typeof STAGES)["HK"];
}) {
  const depositWord = region === "HK" ? "留位费" : "押金";
  return (
    <section aria-labelledby="stages-title" className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="stages-title" className="font-semibold">
          申请节点
        </h2>
        <label className="text-sm text-slate-500">
          结果：
          <select
            value={app.outcome}
            onChange={e => set({ outcome: e.target.value as Outcome })}
            className="ml-1 rounded border border-slate-200 px-2 py-1 text-slate-700"
          >
            {OUTCOMES.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="mt-4">
        {stages.map((s, i) => {
          const state = i < app.stage ? "done" : i === app.stage ? "current" : "todo";
          return (
            <li key={s.key} className="relative flex gap-4 pb-5 last:pb-0">
              {i < stages.length - 1 && (
                <span
                  aria-hidden
                  className={`absolute top-7 left-[13px] h-[calc(100%-20px)] w-0.5 ${i < app.stage ? "bg-brand" : "bg-slate-200"}`}
                />
              )}
              <button
                type="button"
                onClick={() => set({ stage: i })}
                aria-label={`把节点设为：${s.label}`}
                aria-current={state === "current" ? "step" : undefined}
                className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                  state === "done"
                    ? "border-brand bg-brand text-white"
                    : state === "current"
                      ? "border-brand bg-white text-brand"
                      : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {state === "done" ? "✓" : i + 1}
              </button>
              <div className="flex-1 pt-0.5">
                <p className={`font-medium ${state === "todo" ? "text-slate-400" : "text-slate-800"}`}>{s.label}</p>
                <p className="text-xs text-slate-500">{s.hint}</p>

                {state === "current" && i === OFFER_STAGE && (
                  <DateField
                    label={`${depositWord}截止日期`}
                    value={app.depositDeadline}
                    onChange={v => set({ depositDeadline: v })}
                    help={`录取信里会写${depositWord}的截止日，填上后看板会倒计时`}
                  />
                )}
                {state === "current" && i === DEPOSIT_STAGE && (
                  <>
                    <DateField
                      label="补交条件截止日期"
                      value={app.conditionDeadline}
                      onChange={v => set({ conditionDeadline: v })}
                      help="通常是毕业证、学位证、语言成绩的最晚提交日"
                    />
                    <label className="mt-2 block text-sm">
                      <span className="text-slate-600">需要补交的条件</span>
                      <input
                        type="text"
                        value={app.conditions ?? ""}
                        onChange={e => set({ conditions: e.target.value })}
                        placeholder="例如：毕业证、学位证、雅思 7.0"
                        className="mt-1 w-full rounded border border-slate-200 px-2 py-1.5 outline-none focus:border-brand"
                      />
                    </label>
                  </>
                )}
                {i === CONDITIONS_STAGE && app.conditions && app.stage <= CONDITIONS_STAGE && (
                  <p className="mt-1 text-xs text-amber-700">待补交：{app.conditions}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {app.stage < stages.length - 1 && app.outcome === "pending" && (
        <button
          type="button"
          onClick={() => set({ stage: app.stage + 1 })}
          className="mt-5 w-full rounded-lg bg-brand py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          推进到下一步：{stages[app.stage + 1].label}
        </button>
      )}
    </section>
  );
}

function DateField({
  label,
  value,
  onChange,
  help,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  help: string;
}) {
  return (
    <label className="mt-2 block text-sm">
      <span className="text-slate-600">{label}</span>
      <input
        type="date"
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block rounded border border-slate-200 px-2 py-1.5 outline-none focus:border-brand"
      />
      <span className="mt-1 block text-xs text-slate-400">{help}</span>
    </label>
  );
}
