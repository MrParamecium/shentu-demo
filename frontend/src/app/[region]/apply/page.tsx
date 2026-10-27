import Link from "next/link";
import { notFound } from "next/navigation";
import { REGION_INFO, REGION_ORDER, REGION_SLUG, regionFromSlug } from "@/lib/regions";
import { simProgram } from "@/lib/apply-sim";
import ApplySimulator from "./ApplySimulator";

export function generateStaticParams() {
  return REGION_ORDER.map(r => ({ region: REGION_SLUG[r] }));
}

export async function generateMetadata(props: PageProps<"/[region]/apply">) {
  const region = regionFromSlug((await props.params).region);
  return { title: region ? `模拟网申 · ${REGION_INFO[region].label} · 申途 Demo` : "申途 Demo" };
}

export default async function ApplyPage(props: PageProps<"/[region]/apply">) {
  const region = regionFromSlug((await props.params).region);
  if (!region) notFound();
  const program = simProgram(region);

  return (
    <div className="space-y-6">
      <Link href={`/${REGION_SLUG[region]}`} className="text-sm text-brand hover:underline">
        ← 返回{REGION_INFO[region].label}申请
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-slate-800">模拟网申：{program.schoolCn} · {program.nameCn}</h1>
        <p className="mt-2 text-sm text-slate-600">
          用一个真实项目和一套示例材料，把网申从注册到提交前走一遍。项目的截止日期、语言要求来自项目库（官网核实于{" "}
          {program.updatedAt}）；表单是各校网申系统的通用结构，不是这所学校系统的复刻。
        </p>
        <p className="mt-1 text-xs text-slate-500">
          全程在你的浏览器里进行：不保存、不上传任何文件，也不会向学校提交。到最后的「提交」按钮前会停下。
        </p>
      </header>
      <ApplySimulator region={region} />
    </div>
  );
}
