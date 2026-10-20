import type { Program } from "@/lib/types";

/** 官网摘录的补充说明：申请费、押金、特殊规则 */
export default function ProgramNotes({ program }: { program: Program }) {
  if (!program.notes?.length) return null;
  return (
    <ul className="space-y-1 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
      {program.notes.map(n => (
        <li key={n} className="flex gap-1.5">
          <span aria-hidden className="text-slate-400">
            •
          </span>
          {n}
        </li>
      ))}
    </ul>
  );
}
