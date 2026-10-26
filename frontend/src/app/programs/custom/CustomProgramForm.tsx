"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { REGION_INFO, REGION_ORDER } from "@/lib/regions";
import { addCustomApplication } from "@/lib/store";
import type { Region } from "@/lib/types";

interface RoundDraft {
  name: string;
  deadline: string;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand aria-invalid:border-red-400";

export default function CustomProgramForm() {
  const router = useRouter();
  // 从项目库搜索框带过来的关键词，预填进项目名
  const params = useSearchParams();
  const prefill = params.get("q") ?? "";
  // 从地区页进来时带 ?region=HK，默认选中这个地区
  const fromRegion = params.get("region");
  const initialRegion = REGION_ORDER.includes(fromRegion as Region) ? (fromRegion as Region) : "UK";

  const [region, setRegion] = useState<Region>(initialRegion);
  const [school, setSchool] = useState("");
  const [name, setName] = useState(prefill);
  const [rolling, setRolling] = useState(false);
  const [rounds, setRounds] = useState<RoundDraft[]>([{ name: "第一轮", deadline: "" }]);
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = validate({ school, name, rolling, rounds, url });
  const show = (k: keyof typeof errors) => (submitted ? errors[k] : undefined);

  const setRound = (i: number, patch: Partial<RoundDraft>) =>
    setRounds(rs => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.values(errors).some(Boolean)) return;
    const id = addCustomApplication({
      region,
      school: school.trim(),
      name: name.trim(),
      rolling: rolling || undefined,
      rounds: rolling ? [] : sortedRounds(rounds),
      officialUrl: url.trim() || undefined,
    });
    router.push(`/dashboard/${id}`);
  };

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-2xl bg-white p-6 shadow-sm">
      <fieldset>
        <legend className="text-sm text-slate-600">地区</legend>
        <div className="mt-1 flex gap-2">
          {REGION_ORDER.map(r => (
            <label
              key={r}
              className={`cursor-pointer rounded-lg border px-4 py-1.5 text-sm ${region === r ? "border-brand bg-brand-soft text-brand-dark" : "border-slate-200 text-slate-600"}`}
            >
              <input
                type="radio"
                name="region"
                value={r}
                checked={region === r}
                onChange={() => setRegion(r)}
                className="sr-only"
              />
              {REGION_INFO[r].flag} {REGION_INFO[r].label}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-slate-400">决定录取后的节点（如英国是 CAS、新加坡是学生准证）</p>
      </fieldset>

      <Field label="学校" error={show("school")}>
        <input
          value={school}
          onChange={e => setSchool(e.target.value)}
          placeholder="如：University of Bath / 澳门大学"
          aria-invalid={!!show("school")}
          className={inputClass}
        />
      </Field>

      <Field label="项目名称" error={show("name")}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="如：MSc Management"
          aria-invalid={!!show("name")}
          className={inputClass}
        />
      </Field>

      <fieldset>
        <legend className="text-sm text-slate-600">截止日期</legend>
        <label className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={rolling}
            onChange={e => setRolling(e.target.checked)}
            className="h-4 w-4 accent-brand"
          />
          没有固定截止日期（滚动录取，招满即止）
        </label>

        {!rolling && (
          <div className="mt-3 space-y-2">
            {rounds.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={r.name}
                  onChange={e => setRound(i, { name: e.target.value })}
                  aria-label={`第 ${i + 1} 轮名称`}
                  className="w-28 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                <input
                  type="date"
                  value={r.deadline}
                  onChange={e => setRound(i, { deadline: e.target.value })}
                  aria-label={`第 ${i + 1} 轮截止日期`}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
                />
                {rounds.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRounds(rs => rs.filter((_, j) => j !== i))}
                    aria-label={`删除第 ${i + 1} 轮`}
                    className="px-2 text-slate-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {rounds.length < 6 && (
              <button
                type="button"
                onClick={() => setRounds(rs => [...rs, { name: `第${NUMERALS[rs.length]}轮`, deadline: "" }])}
                className="text-sm text-brand hover:underline"
              >
                + 再加一轮
              </button>
            )}
            {show("rounds") && (
              <p role="alert" className="text-xs text-red-600">
                {show("rounds")}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <Field label="官网链接（选填）" error={show("url")} hint="填了以后详情页可以一键打开官网核对">
        <input
          type="url"
          inputMode="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://"
          aria-invalid={!!show("url")}
          className={inputClass}
        />
      </Field>

      <p className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
        这个项目是你自己填写的，申途没有核实过，截止日期请以学校官网为准。
      </p>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-brand-dark"
        >
          添加到我的申请
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-slate-600 hover:bg-slate-50"
        >
          取消
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-600">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1 block text-xs text-red-600">
          {error}
        </span>
      ) : (
        hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>
      )}
    </label>
  );
}

const NUMERALS = "一二三四五六";
const DEFAULT_ROUND_NAME = /^第[一二三四五六]轮$/;

/** 按日期排序；没改过的默认名「第N轮」按排序后的位置重新编号，用户自己起的名字保持不变 */
const sortedRounds = (rounds: RoundDraft[]) =>
  [...rounds]
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .map((r, i) => ({
      name: DEFAULT_ROUND_NAME.test(r.name.trim()) ? `第${NUMERALS[i]}轮` : r.name.trim(),
      deadline: r.deadline,
    }));

function validate(f: { school: string; name: string; rolling: boolean; rounds: RoundDraft[]; url: string }) {
  const dates = f.rounds.map(r => r.deadline);
  return {
    school: f.school.trim() ? undefined : "请填写学校",
    name: f.name.trim() ? undefined : "请填写项目名称",
    rounds: f.rolling
      ? undefined
      : f.rounds.some(r => !r.name.trim() || !r.deadline)
        ? "每一轮都要填名称和截止日期"
        : new Set(dates).size !== dates.length
          ? "有两轮的截止日期相同"
          : undefined,
    // 只接受 http(s) 链接，避免存进 javascript: 之类的地址
    url: !f.url.trim() || /^https?:\/\/\S+\.\S+/i.test(f.url.trim()) ? undefined : "请填写以 https:// 开头的完整链接",
  };
}
