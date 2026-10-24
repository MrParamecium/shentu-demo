import type { Field, Program, ProgramRecord, Region } from "./types";
import records from "../../data/programs.json";

// 项目数据在 frontend/data/programs.json，改数据走 PR 审核；
// 提交前跑 `npm run check:programs` 校验格式和日期
const DEFAULT_MATERIALS: Record<Region, string[]> = {
  HK: ["简历 CV", "个人陈述 PS", "推荐信 ×2", "本科成绩单", "在读/学位证明", "语言成绩", "网申表 + 申请费"],
  UK: ["简历 CV", "个人陈述 PS", "推荐信 ×2", "本科成绩单", "在读/学位证明", "语言成绩", "网申表"],
  SG: ["简历 CV", "个人陈述 PS", "推荐信 ×2", "本科成绩单", "在读/学位证明", "语言成绩", "网申表 + 申请费"],
};

export const FIELD_LABELS: Record<Field, string> = {
  business: "商科管理",
  finance: "金融会计",
  cs: "计算机 / AI",
  data: "数据科学",
};

export const PROGRAMS: Program[] = (records as ProgramRecord[]).map(({ extraMaterials, ...r }) => ({
  ...r,
  materials: [...DEFAULT_MATERIALS[r.region], ...(extraMaterials ?? [])],
}));

export const programById = (id: string) => PROGRAMS.find(p => p.id === id);
