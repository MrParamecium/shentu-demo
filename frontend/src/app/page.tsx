import Link from "next/link";

// 首页：参考 Offer多多 的五段式流程卡片，每一步对应申请中的一个阶段
const STEPS = [
  {
    no: 1,
    title: "选项目",
    color: "bg-sky-100 text-sky-800",
    items: [
      { label: "香港硕士项目", href: "/programs?region=HK" },
      { label: "英国硕士项目", href: "/programs?region=UK" },
      { label: "新加坡硕士项目", href: "/programs?region=SG" },
      { label: "全部项目", href: "/programs" },
    ],
    soon: ["智能选校"],
  },
  {
    no: 2,
    title: "备材料",
    color: "bg-emerald-100 text-emerald-800",
    items: [
      { label: "材料清单", href: "/dashboard" },
      { label: "语言要求", href: "/programs" },
    ],
    soon: ["文书素材整理", "推荐信进度"],
  },
  {
    no: 3,
    title: "管截止",
    color: "bg-amber-100 text-amber-800",
    items: [
      { label: "我的申请看板", href: "/dashboard" },
      { label: "分轮截止日期", href: "/programs" },
    ],
    soon: ["截止提醒"],
  },
  {
    no: 4,
    title: "跟录取",
    color: "bg-orange-100 text-orange-800",
    items: [
      { label: "有条件录取", href: "/dashboard" },
      { label: "留位费 / 押金", href: "/dashboard" },
      { label: "补交条件", href: "/dashboard" },
    ],
    soon: [],
  },
  {
    no: 5,
    title: "办签证",
    color: "bg-rose-100 text-rose-800",
    items: [{ label: "CAS / 签证节点", href: "/dashboard" }],
    soon: ["行前清单", "找新生群"],
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="rounded-2xl bg-white px-8 py-12 text-center shadow-sm">
        <h1 className="text-3xl font-bold text-brand-dark">英港新硕士申请，一张看板管到底</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          添加项目，自动带出分轮截止日期和材料清单；从网申到有条件录取、留位费、补交条件、CAS，每个节点都不漏。
          每条信息都附官网来源，用得放心。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/programs" className="rounded-lg bg-brand px-6 py-3 font-medium text-white hover:bg-brand-dark">
            添加第一个项目
          </Link>
          <Link href="/dashboard" className="rounded-lg border border-brand px-6 py-3 font-medium text-brand hover:bg-brand-soft">
            查看我的申请
          </Link>
        </div>
      </section>

      <section aria-labelledby="flow-title">
        <h2 id="flow-title" className="sr-only">申请流程</h2>
        <ol className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(step => (
            <li key={step.no} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className={`px-5 py-3 text-lg font-bold ${step.color}`}>
                {step.no}.{step.title}
              </div>
              <ul className="divide-y divide-dashed divide-slate-200 px-5 py-2">
                {step.items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="block py-2.5 text-slate-700 hover:text-brand">
                      {item.label}
                    </Link>
                  </li>
                ))}
                {step.soon.map(label => (
                  <li key={label} className="flex items-center justify-between py-2.5 text-slate-400">
                    {label}
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px]">即将上线</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
