import Link from "next/link";
import { notFound } from "next/navigation";
import { REGION_INFO, REGION_ORDER, REGION_SLUG, regionFromSlug } from "@/lib/regions";
import { SIM_SPECIFICS, SIM_VIDEO, simProgram } from "@/lib/apply-sim";
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
  const info = REGION_INFO[region];
  if (!program) {
    return (
      <div className="space-y-6">
        <Link href={`/${REGION_SLUG[region]}`} className="text-sm text-brand hover:underline">
          ← 返回{info.label}申请
        </Link>
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-800">{info.label}模拟网申即将上线</h1>
          <p className="mt-2 text-sm text-slate-600">
            我们还在收录{info.label}项目，选好代表项目、录好真实网申演示视频后会放在这里。
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href={`/${REGION_SLUG[region]}`} className="text-sm text-brand hover:underline">
        ← 返回{REGION_INFO[region].label}申请
      </Link>
      <header>
        <h1 className="text-2xl font-bold text-slate-800">模拟网申：{program.schoolCn} · {program.nameCn}</h1>
        <p className="mt-2 text-sm text-slate-600">
          先看真实网申的演示视频，再用一套示例材料自己动手走一遍，到提交前停。项目的截止日期、语言要求来自项目库（官网核实于{" "}
          {program.updatedAt}）；表单是各校网申系统的通用结构，不是这所学校系统的复刻。
        </p>
        <p className="mt-1 text-xs text-slate-500">
          全程在你的浏览器里进行：不保存、不上传任何文件，也不会向学校提交。到最后的「提交」按钮前会停下。
        </p>
      </header>
      <section aria-labelledby="video-title" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="video-title" className="font-semibold text-slate-800">
          演示视频：真实网申系统操作录屏
        </h2>
        {SIM_VIDEO[region] ? (
          <video controls preload="metadata" className="mt-3 w-full rounded-xl bg-black" src={SIM_VIDEO[region] ?? undefined}>
            你的浏览器不支持视频播放。
          </video>
        ) : (
          <p className="mt-3 rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            录制中：我们正在用真实账号录这个项目的网申全过程（到提交前停），录好后放在这里。
          </p>
        )}
      </section>

      <section aria-labelledby="specifics-title" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="specifics-title" className="font-semibold text-slate-800">
          这个项目网申的特别要求
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {(SIM_SPECIFICS[region] ?? []).map(t => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="text-brand">
                ●
              </span>
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-500">
          摘自{" "}
          <a href={program.officialUrl} target="_blank" rel="noreferrer" className="text-brand underline">
            {program.officialLabel}
          </a>{" "}
          及学校申请指引，2026-10-27 核实。下面的模拟是各校通用的网申结构，可以先用示例材料练一遍。
        </p>
      </section>

      <ApplySimulator region={region} program={program} />
    </div>
  );
}
