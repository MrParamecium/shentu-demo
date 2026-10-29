import { programById } from "./programs";
import type { Program, Region } from "./types";

/**
 * 模拟网申：每个地区选一个真实项目（项目库里已核实的），用示例申请人和示例材料
 * 一步步填表、上传，到「提交」前打住。表单是各校网申系统的通用结构，不是某校系统的复刻。
 * 不保存任何数据，文件只在浏览器内存里，不上传到任何地方。
 */
// 选择理由见 handoff/tasks/T-013-apply-videos.md：材料最全、申请人多、学校有代表性
// 美国项目库还没收录，暂不设模拟项目；没有的地区不显示模拟网申入口
export const SIM_PROGRAM_ID: Partial<Record<Region, string>> = {
  UK: "ic-msc-ba",
  HK: "hku-msc-ba",
  SG: "nus-mcomp-cs",
};

/** 演示视频（友涵录制，T-013）；还没录好时为 null，页面显示「录制中」 */
export const SIM_VIDEO: Partial<Record<Region, string | null>> = {
  UK: null,
  HK: null,
  SG: null,
};

/**
 * 这个项目网申里特有的要求，摘自官网（2026-10-27 核实），出处见 T-013。
 * 模拟表单是通用结构，这里补上真实网申会遇到、通用表单没体现的部分
 */
export const SIM_SPECIFICS: Partial<Record<Region, string[]>> = {
  UK: [
    "3 篇定题文书：毕业后职业规划（350 词）、为什么选帝国并如何贡献社区（500 词）、结合帝国五项价值观讲一段经历（500 词）",
    "另需量化背景说明（列最多 5 门最量化的课程）和编程 / 软件经验",
    "2 位推荐人（两位学术，或一位学术一位工作）；不接受私人或免费邮箱，提交申请后系统才通知推荐人",
    "可以先不交语言成绩；GMAT 非必须但会加分，入围者有约 20 分钟在线面试",
  ],
  HK: [
    "在港大研究生网申系统（TOLA）申请，每个项目要单独注册账号；申请费只能用 Visa / Mastercard 信用卡",
    "材料不在网申表里传，而是在商学院单独的材料上传系统上传，最晚在该轮截止后 2 个工作日",
    "内地学生要上传学信网《教育部学历证书电子注册备案表》和《中国高等教育学位在线验证报告》，中英文版都要，有效期设 6 个月或最长",
    "2 位推荐人，至少 1 位是本科学校的学术推荐人，推荐表里要附老师在学校官网的个人主页链接，否则视为不完整",
    "另需实习 / 工作证明；个人陈述、GMAT/GRE、专业证书合成一个 PDF 放「Others」；可能被邀请录制入学视频",
  ],
  SG: [
    "在 NUS 研究生网申系统申请，所有材料只收 PDF",
    "本科非英语授课要交雅思或托福，并让考试机构把成绩电子送分到 NUS",
    "至少 1 位推荐人，填邮箱后系统发邮件给推荐人，可以在系统里发提醒",
    "需要资金证明（银行流水、近期工资单或担保人信）和护照页",
    "申请费 S$109（含消费税），不退；结果约 5 月底在系统里公布",
  ],
};

/** 这个地区的模拟项目；还没设的返回 null（页面显示「即将上线」） */
export function simProgram(region: Region): Program | null {
  const id = SIM_PROGRAM_ID[region];
  if (!id) return null;
  const p = programById(id);
  if (!p) throw new Error(`模拟项目 ${id} 不在项目库里`);
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
