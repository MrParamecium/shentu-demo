import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROGRAMS } from "@/lib/programs";
import { REGION_GUIDES, REGION_INFO, REGION_ORDER, REGION_SLUG, regionFromSlug } from "@/lib/regions";
import { STAGES } from "@/lib/stages";
import { SIM_PROGRAM_ID } from "@/lib/apply-sim";
import RegionApplications from "./RegionApplications";

// 只预渲染 /uk、/hk、/sg；其他地址由 regionFromSlug 判断后 notFound() 返回 404
// （cacheComponents 开启时不能用 dynamicParams = false）
export function generateStaticParams() {
  return REGION_ORDER.map(r => ({ region: REGION_SLUG[r] }));
}

export async function generateMetadata(props: PageProps<"/[region]">) {
  const region = regionFromSlug((await props.params).region);
  return { title: region ? `${REGION_INFO[region].label}硕士申请 · 申途 Demo` : "申途 Demo" };
}

const STEP_COLORS = [
  "bg-sky-100 text-sky-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-orange-100 text-orange-800",
  "bg-rose-100 text-rose-800",
];

export default async function RegionPage(props: PageProps<"/[region]">) {
  const region = regionFromSlug((await props.params).region);
  if (!region) notFound();

  const info = REGION_INFO[region];
  const guide = REGION_GUIDES[region];
  const slug = REGION_SLUG[region];
  const count = PROGRAMS.filter(p => p.region === region).length;
  const hasSim = !!SIM_PROGRAM_ID[region];

  return (
    <div className="space-y-8">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← 选择其他地区
      </Link>

      <section className="relative overflow-hidden rounded-2xl shadow-sm">
        <div className="relative h-56 md:h-72">
          <Image
            src={guide.image}
            alt={guide.imageAlt}
            fill
            sizes="(max-width: 1200px) 100vw, 1120px"
            preload
            className="object-cover"
            style={{ objectPosition: guide.heroPosition }}
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white md:p-8">
            <h1 className="text-3xl font-bold md:text-4xl">
              <span aria-hidden>{info.flag} </span>
              {info.label}硕士申请
            </h1>
            <p className="mt-2 text-white/90">{guide.tagline}</p>
            {count === 0 && (
              <p className="mt-2 text-sm text-white/80">项目库正在收录{info.label}项目，现在可以先手动添加你要申的项目。</p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {count > 0 && (
                <Link
                  href={`/programs?region=${region}`}
                  className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-soft"
                >
                  浏览{info.label} {count} 个项目
                </Link>
              )}
              {hasSim && (
                <Link
                  href={`/${slug}/apply`}
                  className="rounded-lg border border-white/70 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                >
                  模拟一次网申
                </Link>
              )}
              <Link
                href={`/programs/custom?region=${region}`}
                className={
                  count > 0
                    ? "rounded-lg border border-white/70 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10"
                    : "rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-brand-dark hover:bg-brand-soft"
                }
              >
                手动添加项目
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="highlights-title" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 id="highlights-title" className="font-semibold text-slate-800">
          申{info.label}要特别注意
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {guide.highlights.map(h => (
            <li key={h} className="flex gap-2 text-sm text-slate-700">
              <span aria-hidden className="text-brand">
                ●
              </span>
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="flow-title">
        <h2 id="flow-title" className="mb-3 font-semibold text-slate-800">
          {info.label}申请流程
        </h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {guide.flow.map((step, i) => (
            <li key={step.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className={`px-5 py-3 text-lg font-bold ${STEP_COLORS[i]}`}>
                {i + 1}.{step.title}
              </div>
              <ul className="space-y-2 px-5 py-4 text-sm text-slate-700">
                {step.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-slate-500">
          看板里的申请节点：{STAGES[region].map(s => s.label).join(" → ")}
        </p>
      </section>

      <RegionApplications region={region} slug={slug} />
    </div>
  );
}
