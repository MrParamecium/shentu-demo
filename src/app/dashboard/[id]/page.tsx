import { Suspense } from "react";
import AppDetail from "./AppDetail";

export const metadata = { title: "申请详情 · 申途 Demo" };

// id 只存在于用户浏览器的 localStorage，构建时无法预知，需在 Suspense 内读取 params
async function Detail({ params }: { params: PageProps<"/dashboard/[id]">["params"] }) {
  const { id } = await params;
  return <AppDetail id={id} />;
}

export default function AppDetailPage(props: PageProps<"/dashboard/[id]">) {
  return (
    <Suspense fallback={<p className="text-slate-400">加载中…</p>}>
      <Detail params={props.params} />
    </Suspense>
  );
}
