"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { REGION_INFO, REGION_SLUG } from "@/lib/regions";
import { STAGES } from "@/lib/stages";
import { SAMPLE_PROGRAM, buildSteps, type SimStep } from "@/lib/simulation";
import type { Region } from "@/lib/types";

/** 地区页的申请流程模拟：用虚构示例项目带用户走完一遍标准流程，不写入任何数据 */
export default function FlowSimulator({ region }: { region: Region }) {
  const steps = useMemo(() => buildSteps(region), [region]);
  const info = REGION_INFO[region];
  const sample = SAMPLE_PROGRAM[region];
  // -1 = 未开始，steps.length = 已完成
  const [current, setCurrent] = useState(-1);
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [confirmed, setConfirmed] = useState(false);
  const [warned, setWarned] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

  const reset = (to: number) => {
    setCurrent(to);
    setPicked(null);
    setChecked({});
    setConfirmed(false);
    // 切换步骤后把焦点移到面板，读屏软件会读出新内容
    requestAnimationFrame(() => panelRef.current?.focus());
  };

  const step: SimStep | undefined = steps[current];
  const done = current >= steps.length;

  const canNext = (() => {
    if (!step) return false;
    const a = step.action;
    if (a.kind === "choice") return picked !== null;
    if (a.kind === "checklist") return a.items.every(it => checked[it.label]);
    return confirmed;
  })();

  const next = () => {
    if (step?.action.kind === "choice" && picked !== null && step.action.options[picked].tone === "warn") {
      setWarned(w => w + 1);
    }
    reset(current + 1);
  };

  return (
    <section aria-labelledby="sim-title" className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 id="sim-title" className="font-semibold text-slate-800">
        流程模拟：用一个示例项目走完一遍{info.label}申请
      </h2>

      {current === -1 && (
        <div className="mt-3">
          <p className="text-sm text-slate-600">
            用虚构的「{sample.school} · {sample.name}」，从选项目一路走到{STAGES[region][6].label}，共{" "}
            {steps.length} 步。每步先讲现实里会发生什么，再让你做一次选择或操作，并指出常见的坑。
          </p>
          <p className="mt-2 text-xs text-slate-500">
            全程是模拟，不会保存任何数据；项目名、时间点都是虚构的示例，真实日期和要求以各校官网为准。大约 3 分钟。
          </p>
          <button
            type="button"
            onClick={() => {
              setWarned(0);
              reset(0);
            }}
            className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
          >
            开始模拟
          </button>
        </div>
      )}

      {current >= 0 && (
        <>
          <ol className="mt-4 flex gap-1" aria-label="模拟进度">
            {steps.map((s, i) => (
              <li
                key={s.title}
                aria-current={i === current ? "step" : undefined}
                className={`h-1.5 flex-1 rounded-full ${i < current ? "bg-brand" : i === current ? "bg-brand/60" : "bg-slate-200"}`}
              >
                <span className="sr-only">
                  第 {i + 1} 步 {s.title}
                  {i < current ? "，已完成" : i === current ? "，当前" : ""}
                </span>
              </li>
            ))}
          </ol>

          <div ref={panelRef} tabIndex={-1} aria-live="polite" className="mt-4 outline-none">
            {step && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">
                    第 {current + 1} / {steps.length} 步 · 模拟时间：{step.when}
                    {step.stageIndex !== null && ` · 看板节点：${STAGES[region][step.stageIndex].label}`}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-800">{step.title}</h3>
                  <p className="mt-1 text-sm text-slate-700">{step.goal}</p>
                </div>

                <div className="rounded-xl bg-brand-soft p-4">
                  <p className="text-xs font-medium text-brand-dark">现实里会发生什么</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-700">
                    {step.happens.map(h => (
                      <li key={h} className="flex gap-2">
                        <span aria-hidden className="text-brand">
                          ●
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-sm font-medium text-slate-800">{step.action.prompt}</p>

                  {step.action.kind === "choice" && (
                    <div className="mt-3 space-y-2">
                      {step.action.options.map((o, i) => {
                        const on = picked === i;
                        return (
                          <div key={o.label}>
                            <button
                              type="button"
                              aria-pressed={on}
                              onClick={() => setPicked(i)}
                              className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm ${
                                on ? "border-brand bg-brand-soft text-brand-dark" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              {o.label}
                            </button>
                            {on && (
                              <p
                                className={`mt-2 rounded-lg px-4 py-2 text-sm ${
                                  o.tone === "good" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                                }`}
                              >
                                {o.tone === "good" ? "合理：" : "有风险："}
                                {o.feedback}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {step.action.kind === "checklist" && (
                    <ul className="mt-3 space-y-2">
                      {step.action.items.map(it => (
                        <li key={it.label}>
                          <label className="flex cursor-pointer items-start gap-3 text-sm">
                            <input
                              type="checkbox"
                              checked={!!checked[it.label]}
                              onChange={e => setChecked(c => ({ ...c, [it.label]: e.target.checked }))}
                              className="mt-0.5 h-4 w-4 accent-[#3f6b80]"
                            />
                            <span>
                              <span className="font-medium text-slate-800">{it.label}</span>
                              <span className="block text-xs text-slate-500">{it.detail}</span>
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.action.kind === "confirm" && (
                    <div className="mt-3">
                      {!confirmed ? (
                        <button
                          type="button"
                          onClick={() => setConfirmed(true)}
                          className="rounded-lg border border-brand px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft"
                        >
                          {step.action.button}
                        </button>
                      ) : (
                        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">{step.action.result}</p>
                      )}
                    </div>
                  )}
                </div>

                <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
                  <span className="font-medium">常见的坑：</span>
                  {step.pitfall}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => reset(current - 1)}
                    disabled={current === 0}
                    className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    ← 上一步
                  </button>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setCurrent(-1)} className="text-sm text-slate-500 hover:underline">
                      退出模拟
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      disabled={!canNext}
                      className="rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {current === steps.length - 1 ? "完成模拟" : "下一步 →"}
                    </button>
                  </div>
                </div>
                {!canNext && (
                  <p className="text-xs text-slate-500">
                    {step.action.kind === "choice" ? "先选一个选项" : step.action.kind === "checklist" ? "把清单全部勾选后继续" : "先完成上面的操作"}
                  </p>
                )}
              </div>
            )}

            {done && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800">模拟完成：你走完了一遍{info.label}申请</h3>
                <p className="text-sm text-slate-700">
                  {warned === 0
                    ? "每个关键节点你的选择都比较稳妥。"
                    : `有 ${warned} 处选了有风险的做法，真实申请里这些地方最容易出问题，可以点「重新开始」换个选法再看一遍。`}
                </p>
                <ol className="space-y-1 text-sm text-slate-700">
                  {steps.map((s, i) => (
                    <li key={s.title}>
                      <span className="text-slate-500">{s.when}</span> · {i + 1}. {s.title}
                    </li>
                  ))}
                </ol>
                <p className="text-sm text-slate-600">
                  真实申请里，这些节点的日期都不一样。把你要申请的项目加进看板，截止日和每个节点的期限就会帮你盯着。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/${REGION_SLUG[region]}/apply`}
                    className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
                  >
                    用真实项目模拟一次网申
                  </Link>
                  <Link
                    href={`/programs?region=${region}`}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    去选{info.label}项目
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setWarned(0);
                      reset(0);
                    }}
                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    重新开始
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
