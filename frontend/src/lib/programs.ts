import type { Application, CustomProgram, Field, Program, ProgramRecord, Region } from "./types";
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

export const CUSTOM_PROGRAM_ID = "custom";

/** 把用户手动填的项目转成和项目库一样的结构，看板、详情页不用区分来源 */
export function customToProgram(c: CustomProgram): Program {
  return {
    id: CUSTOM_PROGRAM_ID,
    region: c.region,
    school: c.school,
    schoolCn: c.school,
    name: c.name,
    nameCn: c.name,
    duration: "—",
    language: "以官网为准",
    rounds: c.rounds,
    rolling: c.rolling,
    materials: DEFAULT_MATERIALS[c.region],
    officialUrl: c.officialUrl ?? "",
    officialLabel: c.officialUrl ? "官网链接（自行填写）" : "",
    updatedAt: "",
    verified: false,
    custom: true,
  };
}

/** 一条申请对应的项目：手动添加的用自带信息，否则查项目库 */
export function resolveProgram(app: Application): Program | undefined {
  return app.customProgram ? customToProgram(app.customProgram) : programById(app.programId);
}
