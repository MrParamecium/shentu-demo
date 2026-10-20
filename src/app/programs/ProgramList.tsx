"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PROGRAMS } from "@/lib/programs";
import { addApplication, useApplications } from "@/lib/store";
import { daysText, daysUntil, formatDate } from "@/lib/deadline";
import type { Program, Region } from "@/lib/types";
import SourceBadge from "@/components/SourceBadge";

const REGIONS: { value: Region | "ALL"; label: string }[] = [
  { value: "ALL", label: "全部" },
  { value: "HK", label: "香港" },
  { value: "UK", label: "英国" },
];

export default function ProgramList() {
  const router = useRouter();
  const params = useSearchParams();
  const region = (params.get("region") as Region | null) ?? "ALL";
  const [query, setQuery] = useState("");
  const apps = useApplications();
  const added = new Set(apps.map(a => a.programId));

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMS.filter(p => region === "ALL" || p.region === region).filter(
      p => !q || [p.school, p.schoolCn, p.name, p.nameCn].some(s => s.toLowerCase().includes(q)),
    );
  }, [region, query]);

  const setRegion = (r: Region | "ALL") => router.replace(r === "ALL" ? "/programs" : `/programs?region=${r}`);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="按地区筛选" className="flex rounded-lg bg-white p-1 shadow-sm">
          {REGIONS.map(r => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRegion(r.value)}
              aria-pressed={region === r.value}
              className={`rounded-md px-4 py-1.5 text-sm ${region === r.value ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <label className="flex-1">
          <span className="sr-only">搜索学校或项目</span>
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索学校或项目，如：港大、Imperial、数据科学"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:border-brand"
          />
        </label>
      </div>

      {list.length === 0 ? (
        <p className="rounded-xl bg-white p-10 text-center text-slate-500">没有找到匹配的项目</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map(p => (
            <ProgramCard key={p.id} program={p} added={added.has(p.id)} />
          ))}
        </ul>
      )}
    </>
  );
}

function ProgramCard({ program: p, added }: { program: Program; added: boolean }) {
  const router = useRouter();
  // 默认选中第一个还没过期的轮次
  const firstOpen = Math.max(0, p.rounds.findIndex(r => daysUntil(r.deadline) >= 0));
  const [round, setRound] = useState(firstOpen);

  const onAdd = () => {
    addApplication(p.id, round);
    router.push("/dashboard");
  };

  return (
    <li className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            {p.region === "HK" ? "🇭🇰 香港" : "🇬🇧 英国"} · {p.schoolCn}
          </p>
          <h2 className="mt-0.5 font-semibold text-slate-800">{p.nameCn}</h2>
          <p className="text-sm text-slate-500">{p.name}</p>
        </div>
        <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{p.duration}</span>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-slate-500">语言</dt>
        <dd>{p.language}</dd>
        <dt className="text-slate-500">材料</dt>
        <dd>{p.materials.length} 项</dd>
      </dl>

      <fieldset>
        <legend className="mb-1 text-sm text-slate-500">申请轮次</legend>
        <div className="space-y-1">
          {p.rounds.map((r, i) => {
            const left = daysUntil(r.deadline);
            const closed = left < 0;
            return (
              <label
                key={r.name}
                className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm ${round === i ? "bg-brand-soft" : ""} ${closed ? "text-slate-400" : ""}`}
              >
                <input
                  type="radio"
                  name={`round-${p.id}`}
                  checked={round === i}
                  onChange={() => setRound(i)}
                  disabled={closed}
                  className="accent-brand"
                />
                <span className="w-16">{r.name}</span>
                <span>{formatDate(r.deadline)}</span>
                <span className="ml-auto text-xs">{daysText(left)}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <SourceBadge program={p} />

      <button
        type="button"
        onClick={onAdd}
        disabled={added}
        className="mt-auto rounded-lg bg-brand py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {added ? "已在我的申请中" : "添加到我的申请"}
      </button>
    </li>
  );
}
