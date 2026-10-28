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

// 学校缩写和常用叫法，按学校英文名（school 字段）对应，一所学校只写一次。
// 学生搜索基本用缩写（UCL、港大、NUS），加新学校时记得补这里
const SCHOOL_ALIASES: Record<string, string[]> = {
  "Imperial College London": ["IC", "ICL", "帝国理工", "帝国"],
  "University College London": ["UCL", "伦敦大学学院", "大伦敦"],
  "King's College London": ["KCL", "国王学院", "伦国王"],
  "London School of Economics and Political Science": ["LSE", "伦敦政经", "伦政经"],
  "The University of Edinburgh": ["Edinburgh", "UoE", "爱丁堡", "爱大"],
  "The University of Manchester": ["Manchester", "UoM", "曼大", "曼彻斯特"],
  "University of Warwick (Warwick Business School)": ["Warwick", "WBS", "华威"],
  "The University of Hong Kong": ["HKU", "港大"],
  "The University of Hong Kong (HKU Business School)": ["HKU", "港大", "港大商学院"],
  "The Chinese University of Hong Kong": ["CUHK", "港中文", "中大"],
  "The Hong Kong University of Science and Technology": ["HKUST", "UST", "港科大", "科大"],
  "City University of Hong Kong": ["CityU", "城大", "港城大"],
  "The Hong Kong Polytechnic University": ["PolyU", "理大", "港理工"],
  "National University of Singapore": ["NUS", "新国立", "国大"],
  "Nanyang Technological University": ["NTU", "南洋理工", "南大"],
  "University of Bristol": ["Bristol", "布里斯托", "布大"],
  "University of Glasgow": ["Glasgow", "格拉斯哥", "格大"],
  "Durham University": ["Durham", "杜伦", "杜大"],
  "University of Leeds": ["Leeds", "利兹", "利兹大学"],
  "University of Sheffield": ["Sheffield", "谢菲尔德", "谢大"],
  "University of Nottingham": ["Nottingham", "诺丁汉", "诺大"],
};

/**
 * 项目库搜索：学校名、项目名按包含匹配；学校别名要完全一致。
 * 别名不能用包含或开头匹配，否则搜「HKU」会把「HKUST」（港科大）也搜出来
 */
export function matchesQuery(p: Program, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if ([p.school, p.schoolCn, p.name, p.nameCn].some(s => s.toLowerCase().includes(q))) return true;
  return (SCHOOL_ALIASES[p.school] ?? []).some(a => a.toLowerCase() === q);
}

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
