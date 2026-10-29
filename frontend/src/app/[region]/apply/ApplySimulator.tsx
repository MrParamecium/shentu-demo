"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { addApplication, useHydrated } from "@/lib/store";
import { daysUntil, roundDeadlineLabel } from "@/lib/deadline";
import { REGION_INFO } from "@/lib/regions";
import {
  MAX_UPLOAD_MB,
  SAMPLE_APPLICANT as S,
  SIM_STEPS,
  docSlots,
  feeNote,
  noTestRequired,
  type SimStepKey,
} from "@/lib/apply-sim";
import type { Program, Region } from "@/lib/types";

interface FieldDef {
  key: string;
  label: string;
  sample: string;
  type?: "text" | "email" | "date" | "month" | "password";
  hint?: string;
}

// 表单字段：各校网申系统里都有的通用项
const FORMS: Partial<Record<SimStepKey, { intro: string; tip: string; fields: FieldDef[] }>> = {
  account: {
    intro: "第一次申请要在学校网申系统注册账号，之后用它查看申请状态、接收通知。",
    tip: "用一个长期能收到邮件的邮箱，录取、面试、补材料的通知都会发到这里。",
    fields: [
      { key: "email", label: "邮箱", sample: S.email, type: "email" },
      { key: "password", label: "设置密码", sample: "Sample-Pass-123", type: "password", hint: "模拟用，不会保存" },
    ],
  },
  personal: {
    intro: "按护照填写个人信息。",
    tip: "姓名拼写、出生日期必须和护照完全一致，后面的录取信、签证文件都按这里生成。",
    fields: [
      { key: "givenName", label: "名（Given name）", sample: S.givenName },
      { key: "familyName", label: "姓（Family name）", sample: S.familyName },
      { key: "birthDate", label: "出生日期", sample: S.birthDate, type: "date" },
      { key: "nationality", label: "国籍", sample: S.nationality },
      { key: "passportNo", label: "护照号", sample: S.passportNo },
    ],
  },
  education: {
    intro: "填写本科学校、专业和成绩。还没毕业的，毕业时间填预计时间。",
    tip: "GPA 按成绩单上的原始分制填写，不要自己换算；学校有要求换算的会单独说明。",
    fields: [
      { key: "school", label: "本科学校", sample: S.school },
      { key: "major", label: "专业", sample: S.major },
      { key: "degree", label: "学位", sample: S.degree },
      { key: "start", label: "入学时间", sample: S.start, type: "month" },
      { key: "end", label: "毕业时间（预计）", sample: S.end, type: "month" },
      { key: "gpa", label: "GPA / 均分", sample: S.gpa },
    ],
  },
  english: {
    intro: "填写语言考试成绩。还没考到要求分数的，多数系统允许填「待考」并写预计考试日期。",
    tip: "看清项目要求的是总分还是单项都要达标，并留意成绩有效期。",
    fields: [
      { key: "testType", label: "考试类型", sample: S.testType },
      { key: "testScore", label: "成绩", sample: S.testScore },
      { key: "testDate", label: "考试日期", sample: S.testDate, type: "date" },
    ],
  },
};

interface Uploaded {
  name: string;
  size: number;
  url: string;
}

const inputCls =
  "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";
const primaryBtn =
  "rounded-lg bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40";
const ghostBtn = "rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50";

// program 由页面传入（服务端已确认这个地区有模拟项目）
export default function ApplySimulator({ region, program }: { region: Region; program: Program }) {
  const slots = useMemo(() => docSlots(program), [program]);
  const fee = feeNote(program);
  const info = REGION_INFO[region];

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [roundIndex, setRoundIndex] = useState<number | null>(null);
  const [files, setFiles] = useState<Record<string, Uploaded>>({});
  const [fileError, setFileError] = useState<Record<string, string>>({});
  const [refsSent, setRefsSent] = useState(false);
  const [declared, setDeclared] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const filesRef = useRef(files);
  filesRef.current = files;
  // 离开页面时释放预览用的临时链接
  useEffect(() => () => Object.values(filesRef.current).forEach(f => URL.revokeObjectURL(f.url)), []);

  const key = SIM_STEPS[step].key;
  const form = FORMS[key];

  const go = (to: number) => {
    setStep(to);
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const fillSample = () => {
    if (!form) return;
    setValues(v => ({ ...v, ...Object.fromEntries(form.fields.map(f => [f.key, f.sample])) }));
  };

  const onFile = (slotKey: string, file: File | undefined) => {
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFileError(e => ({ ...e, [slotKey]: "只接受 PDF 文件（多数网申系统的要求）" }));
      return;
    }
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setFileError(e => ({ ...e, [slotKey]: `文件超过 ${MAX_UPLOAD_MB} MB，压缩后再传` }));
      return;
    }
    setFileError(e => ({ ...e, [slotKey]: "" }));
    setFiles(f => {
      if (f[slotKey]) URL.revokeObjectURL(f[slotKey].url);
      return { ...f, [slotKey]: { name: file.name, size: file.size, url: URL.createObjectURL(file) } };
    });
  };

  // 手机上下载再上传很麻烦：直接把示例 PDF 取回来当作上传的文件
  const [loadingSamples, setLoadingSamples] = useState(false);
  const uploadAllSamples = async () => {
    setLoadingSamples(true);
    try {
      for (const slot of slots) {
        if (files[slot.key]) continue;
        const blob = await fetch(slot.sample).then(r => r.blob());
        onFile(slot.key, new File([blob], slot.sample.split("/").pop() ?? `${slot.key}.pdf`, { type: "application/pdf" }));
      }
    } finally {
      setLoadingSamples(false);
    }
  };

  const removeFile = (slotKey: string) =>
    setFiles(f => {
      const { [slotKey]: gone, ...rest } = f;
      if (gone) URL.revokeObjectURL(gone.url);
      return rest;
    });

  const missing = (() => {
    if (key === "program") return roundIndex === null ? ["选择申请轮次"] : [];
    if (key === "english" && noTestRequired(program)) return [];
    if (form) return form.fields.filter(f => !values[f.key]?.trim()).map(f => f.label);
    if (key === "documents") return slots.filter(s => !s.optional && !files[s.key]).map(s => s.label);
    if (key === "referees") return refsSent ? [] : ["发送推荐信邀请"];
    if (key === "review") return declared ? [] : ["勾选声明"];
    return [];
  })();

  // 剩余天数依赖当天日期，预渲染时不算，挂载后再算（cacheComponents 不允许预渲染里用 new Date()）
  const hydrated = useHydrated();
  const rounds = program.rounds.map((r, i) => ({ ...r, i, days: hydrated ? daysUntil(r.deadline) : null }));
  // 本季各轮都截止了（如港大第二轮过后），模拟仍允许选，只是练习
  const allClosed = hydrated && rounds.length > 0 && rounds.every(r => r.days !== null && r.days < 0);
  const roundDisabled = (days: number | null) => days === null || (days < 0 && !allClosed);

  if (stopped) {
    return (
      <StopScreen
        region={region}
        programName={`${program.schoolCn} · ${program.nameCn}`}
        officialUrl={program.officialUrl}
        officialLabel={program.officialLabel}
        addedId={addedId}
        onAdd={() => setAddedId(addApplication(program.id, roundIndex ?? 0))}
        onRestart={() => {
          Object.values(files).forEach(f => URL.revokeObjectURL(f.url));
          setFiles({});
          setValues({});
          setRoundIndex(null);
          setRefsSent(false);
          setDeclared(false);
          setStopped(false);
          go(0);
        }}
        label={info.label}
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      {/* 左侧步骤条 */}
      <nav aria-label="网申步骤">
        {/* 手机上只显示进度条，桌面端显示完整步骤列表 */}
        <div className="lg:hidden">
          <div className="flex gap-1" aria-hidden>
            {SIM_STEPS.map((s, i) => (
              <span key={s.key} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand" : "bg-slate-200"}`} />
            ))}
          </div>
        </div>
        <ol className="hidden space-y-1 lg:block">
          {SIM_STEPS.map((s, i) => (
            <li key={s.key}>
              <button
                type="button"
                onClick={() => i < step && go(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${
                  i === step
                    ? "bg-brand text-white"
                    : i < step
                      ? "text-brand hover:bg-brand-soft"
                      : "text-slate-400"
                }`}
              >
                <span aria-hidden className="w-5 text-center">
                  {i < step ? "✓" : i + 1}
                </span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <section className="rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="step-title">
        <p className="text-xs text-slate-500">
          第 {step + 1} / {SIM_STEPS.length} 步
        </p>
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="mt-1 text-xl font-bold text-slate-800 outline-none">
          {SIM_STEPS[step].title}
        </h2>

        <div className="mt-4 space-y-4">
          {key === "program" && (
            <>
              <dl className="grid gap-3 rounded-xl bg-brand-soft p-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-slate-500">学校</dt>
                  <dd className="font-medium text-slate-800">{program.schoolCn}（{program.school}）</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">项目</dt>
                  <dd className="font-medium text-slate-800">{program.name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">学制</dt>
                  <dd className="text-slate-800">{program.duration}</dd>
                </div>
                <div>
                  <dt className="text-xs text-slate-500">语言要求</dt>
                  <dd className="text-slate-800">{program.language}</dd>
                </div>
              </dl>
              {program.rolling && (
                <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
                  这个项目滚动审理：边收边审，名额满了可能提前截止，越早交越稳。
                </p>
              )}
              {allClosed && (
                <p className="rounded-lg bg-slate-100 px-4 py-2 text-sm text-slate-700">
                  这个项目本季各轮都已截止。模拟里仍可以选一轮来练习，真实申请要等下一季开放。
                </p>
              )}
              <fieldset>
                <legend className="text-sm font-medium text-slate-800">选择申请轮次</legend>
                <div className="mt-2 space-y-2">
                  {rounds.map(r => (
                    <label
                      key={r.name}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-sm ${
                        roundDisabled(r.days) && r.days !== null ? "border-slate-100 text-slate-400" : "cursor-pointer border-slate-200 hover:bg-slate-50"
                      } ${roundIndex === r.i ? "border-brand bg-brand-soft" : ""}`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="round"
                          disabled={roundDisabled(r.days)}
                          checked={roundIndex === r.i}
                          onChange={() => setRoundIndex(r.i)}
                          className="accent-[#3f6b80]"
                        />
                        {roundDeadlineLabel(r.name)}
                      </span>
                      <span>
                        {r.deadline} {r.days === null ? "" : r.days < 0 ? "（已过）" : `（还有 ${r.days} 天）`}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {program.notes && (
                <ul className="space-y-1 text-xs text-slate-600">
                  {program.notes.map(n => (
                    <li key={n}>· {n}</li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-slate-500">
                以上信息来自{" "}
                <a href={program.officialUrl} target="_blank" rel="noreferrer" className="text-brand underline">
                  {program.officialLabel}
                </a>
                ，核实于 {program.updatedAt}。
              </p>
            </>
          )}

          {form && (
            <>
              <p className="text-sm text-slate-700">{form.intro}</p>
              {key === "english" && noTestRequired(program) && (
                <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
                  这个项目：{program.language}。这一步可以直接跳过。
                </p>
              )}
              <button type="button" onClick={fillSample} className={ghostBtn}>
                一键填入示例申请人「{S.givenName} {S.familyName}」
              </button>
              <div className="grid gap-4 sm:grid-cols-2">
                {form.fields.map(f => (
                  <label key={f.key} className="block text-sm">
                    <span className="text-slate-700">{f.label}</span>
                    <input
                      type={f.type ?? "text"}
                      value={values[f.key] ?? ""}
                      onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                      autoComplete="off"
                      className={inputCls}
                    />
                    {f.hint && <span className="mt-1 block text-xs text-slate-500">{f.hint}</span>}
                  </label>
                ))}
              </div>
              <Tip>{form.tip}</Tip>
            </>
          )}
          {key === "documents" && (
            <>
              <p className="text-sm text-slate-700">
                先点「下载示例」把示例材料存到电脑，再点「选择文件」上传。也可以上传你自己的 PDF 试试，文件不会离开你的浏览器。
              </p>
              <button type="button" onClick={uploadAllSamples} disabled={loadingSamples} className={`${ghostBtn} disabled:opacity-40`}>
                {loadingSamples ? "上传中…" : "一键上传全部示例材料"}
              </button>
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200">
                {slots.map(s => {
                  const f = files[s.key];
                  const inputId = `file-${s.key}`;
                  return (
                    <li key={s.key} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800">
                          {s.label}
                          {s.optional && <span className="ml-2 text-xs font-normal text-slate-500">可选</span>}
                        </p>
                        <p className="text-xs text-slate-500">{s.hint}</p>
                        {f && (
                          <p className="mt-1 text-xs text-emerald-700">
                            已上传：
                            <a href={f.url} target="_blank" rel="noreferrer" className="underline">
                              {f.name}
                            </a>
                            （{(f.size / 1024).toFixed(0)} KB）
                          </p>
                        )}
                        {fileError[s.key] && (
                          <p role="alert" className="mt-1 text-xs text-rose-700">
                            {fileError[s.key]}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={s.sample} download className="text-xs text-brand underline underline-offset-4">
                          下载示例
                        </a>
                        <label htmlFor={inputId} className={`${ghostBtn} cursor-pointer text-xs`}>
                          {f ? "替换" : "选择文件"}
                        </label>
                        <input
                          id={inputId}
                          type="file"
                          accept="application/pdf,.pdf"
                          className="sr-only"
                          aria-label={`上传${s.label}`}
                          onChange={e => {
                            onFile(s.key, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                        {f && (
                          <button type="button" onClick={() => removeFile(s.key)} className="text-xs text-slate-500 hover:underline">
                            删除
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Tip>
                文件名用「姓名_材料名.pdf」，如 LI_Ming_CV.pdf，方便招生官辨认。这里模拟单个文件不超过 {MAX_UPLOAD_MB} MB，真实限制以学校系统为准。
              </Tip>
            </>
          )}

          {key === "referees" && (
            <>
              <p className="text-sm text-slate-700">
                推荐信由推荐人自己提交：你在这里填推荐人的信息，系统给他们发邮件，他们通过链接上传。
              </p>
              <ul className="space-y-3">
                {S.referees.map((r, i) => (
                  <li key={r.email} className="rounded-xl border border-slate-200 p-4 text-sm">
                    <p className="font-medium text-slate-800">推荐人 {i + 1}</p>
                    <p className="mt-1 text-slate-600">
                      {r.name} · {r.relation}
                    </p>
                    <p className="text-slate-600">{r.email}</p>
                    <p className={`mt-2 text-xs ${refsSent ? "text-emerald-700" : "text-slate-500"}`}>
                      状态：{refsSent ? "已发送邀请，等待推荐人提交（模拟）" : "未发送"}
                    </p>
                  </li>
                ))}
              </ul>
              {!refsSent && (
                <button type="button" onClick={() => setRefsSent(true)} className={ghostBtn}>
                  向两位推荐人发送邀请（模拟，不会真的发邮件）
                </button>
              )}
              <Tip>
                很多系统要求推荐信到齐才算材料完整。提前一个月和推荐人打招呼，发邀请后告诉他们截止日，截止前一周再确认一次。
              </Tip>
            </>
          )}
          {key === "review" && (
            <>
              <p className="text-sm text-slate-700">提交前把每一页再看一遍。有错点左边的步骤回去改。</p>
              <dl className="grid gap-x-6 gap-y-2 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
                <Row label="项目" value={`${program.schoolCn} · ${program.nameCn}`} />
                <Row
                  label="轮次"
                  value={roundIndex === null ? "" : `${roundDeadlineLabel(program.rounds[roundIndex].name)} ${program.rounds[roundIndex].deadline}`}
                />
                <Row label="姓名" value={`${values.givenName ?? ""} ${values.familyName ?? ""}`} />
                <Row label="出生日期" value={values.birthDate} />
                <Row label="护照号" value={values.passportNo} />
                <Row label="本科" value={`${values.school ?? ""} · ${values.major ?? ""}`} />
                <Row label="GPA" value={values.gpa} />
                <Row label="语言成绩" value={`${values.testType ?? ""} ${values.testScore ?? ""}`} />
                <Row label="已上传材料" value={`${Object.keys(files).length} / ${slots.length} 份`} />
                <Row label="推荐人" value={refsSent ? "2 位，已发送邀请" : "未发送"} />
              </dl>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={e => setDeclared(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#3f6b80]"
                />
                <span className="text-slate-700">
                  我确认以上信息真实、完整，所交材料均为本人材料。（真实网申都有类似声明，提供虚假材料会被取消录取。）
                </span>
              </label>
            </>
          )}

          {key === "submit" && (
            <>
              <div className="rounded-xl bg-brand-soft p-4 text-sm text-slate-700">
                <p className="font-medium text-slate-800">申请费</p>
                <p className="mt-1">{fee ?? "这个项目的申请费请以官网为准。"}</p>
                <p className="mt-2 text-xs text-slate-500">真实网申在这一步跳转到支付页面，付款成功后才能提交。</p>
              </div>
              <div className="rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
                <p className="font-medium">模拟到这里为止</p>
                <p className="mt-1">
                  真实申请里，点下「提交」后就不能再改材料了。确认无误再交。下面的按钮不会提交任何东西。
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <button type="button" onClick={() => go(step - 1)} className={ghostBtn}>
                  ← 上一步
                </button>
                <button type="button" onClick={() => setStopped(true)} className={primaryBtn}>
                  提交申请（模拟，到此停止）
                </button>
              </div>
            </>
          )}
        </div>

        {key !== "submit" && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className={`${ghostBtn} disabled:opacity-40`}>
              ← 上一步
            </button>
            <div className="text-right">
              {missing.length > 0 && <p className="mb-2 text-xs text-slate-500">还差：{missing.join("、")}</p>}
              <button type="button" onClick={() => go(step + 1)} disabled={missing.length > 0} className={primaryBtn}>
                保存并继续 →
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
      <span className="font-medium">提示：</span>
      {children}
    </p>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const empty = !value?.trim();
  return (
    <div className="flex gap-3">
      <dt className="w-20 shrink-0 text-slate-500">{label}</dt>
      <dd className={empty ? "text-rose-700" : "text-slate-800"}>{empty ? "未填" : value}</dd>
    </div>
  );
}

function StopScreen(props: {
  region: Region;
  label: string;
  programName: string;
  officialUrl: string;
  officialLabel: string;
  addedId: string | null;
  onAdd: () => void;
  onRestart: () => void;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="stop-title">
      <h2 id="stop-title" ref={ref} tabIndex={-1} className="text-xl font-bold text-slate-800 outline-none">
        模拟结束：你已经走到了提交前的最后一步
      </h2>
      <p className="mt-2 text-sm text-slate-700">
        没有任何信息被提交，示例材料也没有离开你的浏览器。真实申请时，你要在学校官网的网申系统里重复刚才这些步骤。
      </p>
      <div className="mt-4 rounded-xl bg-brand-soft p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-800">提交之后会发生什么</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>收到确认邮件和申请编号，存好</li>
          <li>等推荐人提交推荐信，在系统里看状态</li>
          <li>部分项目会发面试邀请</li>
          <li>收到录取后，看清期限，按时缴押金或留位费</li>
        </ol>
        <p className="mt-2">
          整个后续流程，可以回到{props.label}申请页用「流程模拟」走一遍。
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {props.addedId ? (
          <Link href={`/dashboard/${props.addedId}`} className={primaryBtn}>
            已加入看板，去查看 →
          </Link>
        ) : (
          <button type="button" onClick={props.onAdd} className={primaryBtn}>
            把 {props.programName} 加入我的申请
          </button>
        )}
        <a href={props.officialUrl} target="_blank" rel="noreferrer" className={ghostBtn}>
          打开{props.officialLabel}
        </a>
        <button type="button" onClick={props.onRestart} className={ghostBtn}>
          重新模拟
        </button>
      </div>
    </section>
  );
}
