import Image from "next/image";
import Link from "next/link";
import { PROGRAMS } from "@/lib/programs";
import { REGION_GUIDES, REGION_INFO, REGION_ORDER, REGION_SLUG } from "@/lib/regions";

// 首页：先选地区。点进去是该地区自己的流程、项目库和看板
export default function Home() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-brand-dark">你想去哪里读硕士？</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">
          选一个地区，看它自己的申请流程、截止日期和材料清单。每条信息都附官网来源，用得放心。
        </p>
      </section>

      <ul className="grid gap-6 md:grid-cols-3">
        {REGION_ORDER.map((r, i) => {
          const guide = REGION_GUIDES[r];
          const count = PROGRAMS.filter(p => p.region === r).length;
          return (
            <li key={r}>
              <Link
                href={`/${REGION_SLUG[r]}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl shadow-sm transition hover:shadow-lg focus-visible:ring-4 focus-visible:ring-brand/40 focus-visible:outline-none md:aspect-[3/4]"
              >
                <Image
                  src={guide.image}
                  alt={guide.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  // 三张卡片都在首屏，桌面端最大的那张可能是任意一张
                  loading="eager"
                  preload={i === 0}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                {/* 底部渐变遮罩，保证白字在亮图上也看得清 */}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-sm text-white/80">{guide.landmark}</p>
                  <h2 className="mt-1 text-3xl font-bold">
                    <span aria-hidden>{REGION_INFO[r].flag} </span>
                    {REGION_INFO[r].label}
                  </h2>
                  <p className="mt-2 text-sm text-white/90">{guide.tagline}</p>
                  <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
                    {count} 个已核实项目
                    <span aria-hidden className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-5 shadow-sm">
        <div>
          <h2 className="font-semibold text-slate-800">同时申好几个地区？</h2>
          <p className="mt-1 text-sm text-slate-500">「我的申请」把所有地区的项目放在一张看板上，按截止日期排好。</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark">
            查看我的申请
          </Link>
          <Link
            href="/programs"
            className="rounded-lg border border-brand px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft"
          >
            浏览全部项目
          </Link>
        </div>
      </section>
    </div>
  );
}
