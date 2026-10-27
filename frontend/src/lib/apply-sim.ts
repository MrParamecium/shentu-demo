import { programById } from "./programs";
import type { Program, Region } from "./types";

/**
 * 模拟网申：每个地区选一个真实项目（项目库里已核实的），用示例申请人和示例材料
 * 一步步填表、上传，到「提交」前打住。表单是各校网申系统的通用结构，不是某校系统的复刻。
 * 不保存任何数据，文件只在浏览器内存里，不上传到任何地方。
 */
export const SIM_PROGRAM_ID: Record<Region, string> = {
  UK: "ucl-msc-ba",
  HK: "cuhk-msc-ba",
  SG: "nus-msc-ba",
};

export function simProgram(region: Region): Program {
  const p = programById(SIM_PROGRAM_ID[region]);
  if (!p) throw new Error(`模拟项目 ${SIM_PROGRAM_ID[region]} 不在项目库里`);
  return p;
}

/** 虚构的示例申请人，和 public/mock-materials 里的 PDF 一致 */
export const SAMPLE_APPLICANT = {
  email: "ming.li@example.com",
  givenName: "Ming",
  familyName: "LI",
  birthDate: "2005-01-01",
  nationality: "中国",
  passportNo: "X00000000",
  school: "Example University of Technology",
  major: "信息管理与信息系统",
  degree: "理学学士（BSc）",
  start: "2023-09",
  end: "2027-06",
  gpa: "3.6 / 4.0",
  testType: "IELTS Academic",
  testScore: "总分 7.0（听 7.0 / 读 7.5 / 写 6.5 / 说 6.5）",
  testDate: "2026-08-15",
  referees: [
    { name: "Prof. Wei ZHANG", email: "referee1@example.com", relation: "数据挖掘课程老师" },
    { name: "Dr. Hua CHEN", email: "referee2@example.com", relation: "科研助理导师" },
  ],
};

export interface DocSlot {
  key: string;
  label: string;
  hint: string;
  sample: string;
  /** 项目不要求时可以不传 */
  optional?: boolean;
}

const BASE = "/mock-materials";

/** 上传区的材料格；推荐信由推荐人提交，不在这里 */
/** 项目页写明不要求语言成绩（如 NUS MSBA） */
export const noTestRequired = (program: Program) => /无需/.test(program.language);

export function docSlots(program: Program): DocSlot[] {
  const noTest = noTestRequired(program);
  return [
    { key: "cv", label: "简历 CV", hint: "PDF，一到两页", sample: `${BASE}/sample-cv.pdf` },
    { key: "ps", label: "个人陈述 PS", hint: "PDF，回答为什么申请这个项目", sample: `${BASE}/sample-personal-statement.pdf` },
    { key: "transcript", label: "本科成绩单", hint: "在读生先交已出的成绩", sample: `${BASE}/sample-transcript.pdf` },
    { key: "enrolment", label: "在读证明", hint: "毕业后再补学位证、毕业证", sample: `${BASE}/sample-enrolment-certificate.pdf` },
    {
      key: "language",
      label: "语言成绩单",
      hint: noTest ? `这个项目：${program.language}，可不传` : "雅思 / 托福成绩单",
      sample: `${BASE}/sample-english-test-report.pdf`,
      optional: noTest,
    },
    { key: "passport", label: "护照个人信息页", hint: "姓名拼写要和网申表一致", sample: `${BASE}/sample-passport-page.pdf` },
  ];
}

/** 模拟的上传限制，真实限制以各校系统为准 */
export const MAX_UPLOAD_MB = 10;

/** 从项目备注里找申请费的说明（只用已核实的原文），没有就返回 null */
export function feeNote(program: Program): string | null {
  return program.notes?.find(n => n.includes("申请费")) ?? null;
}

export const SIM_STEPS = [
  { key: "program", title: "确认项目和轮次" },
  { key: "account", title: "注册网申账号" },
  { key: "personal", title: "个人信息" },
  { key: "education", title: "教育背景" },
  { key: "english", title: "语言成绩" },
  { key: "documents", title: "上传材料" },
  { key: "referees", title: "推荐人" },
  { key: "review", title: "核对与声明" },
  { key: "submit", title: "缴费与提交" },
] as const;

export type SimStepKey = (typeof SIM_STEPS)[number]["key"];
