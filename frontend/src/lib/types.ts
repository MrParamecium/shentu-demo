export type Region = "HK" | "UK" | "SG" | "US";

/** 专业大类，用于项目库筛选 */
export type Field = "business" | "finance" | "cs" | "data";

/** 一个申请轮次，deadline 为 ISO 日期（YYYY-MM-DD） */
export interface Round {
  name: string;
  deadline: string;
}

/** data/programs.json 里的一条原始记录；materials 由地区默认清单 + extraMaterials 生成 */
export interface ProgramRecord {
  id: string;
  region: Region;
  field: Field;
  school: string;
  schoolCn: string;
  name: string;
  nameCn: string;
  duration: string;
  language: string;
  /** 可以为空，但此时 rolling 必须为 true（无固定截止日期） */
  rounds: Round[];
  /** 滚动录取 / 滚动审理：边收边审，招满即止 */
  rolling?: boolean;
  extraMaterials?: string[];
  officialUrl: string;
  officialLabel: string;
  updatedAt: string;
  verified: boolean;
  notes?: string[];
}

/** 项目库里的一个项目 */
export interface Program {
  id: string;
  region: Region;
  /** 项目库筛选用；用户手动添加的项目没有 */
  field?: Field;
  school: string;
  schoolCn: string;
  name: string;
  nameCn: string;
  duration: string;
  language: string;
  rounds: Round[];
  rolling?: boolean;
  materials: string[];
  officialUrl: string;
  officialLabel: string;
  updatedAt: string;
  verified: boolean;
  /** 申请费、押金、特殊规则等补充说明，均摘自官网 */
  notes?: string[];
  /** 用户手动添加的项目（不在项目库里，未核实） */
  custom?: boolean;
}

export type Outcome = "pending" | "waitlist" | "rejected";

/** 用户添加到看板的一条申请 */
export interface Application {
  id: string;
  programId: string;
  roundIndex: number;
  createdAt: string;
  materials: Record<string, boolean>;
  stage: number;
  outcome: Outcome;
  depositDeadline?: string;
  conditionDeadline?: string;
  conditions?: string;
  note?: string;
  /** 用户手动添加、项目库里没有的项目；有它时 programId 为 "custom" */
  customProgram?: CustomProgram;
}

/** 用户手动填的项目信息，未经核实 */
export interface CustomProgram {
  region: Region;
  school: string;
  name: string;
  rounds: Round[];
  rolling?: boolean;
  officialUrl?: string;
}
