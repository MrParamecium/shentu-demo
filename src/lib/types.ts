export type Region = "HK" | "UK";

/** 一个申请轮次，deadline 为 ISO 日期（YYYY-MM-DD） */
export interface Round {
  name: string;
  deadline: string;
}

/** 项目库里的一个项目（demo 阶段为示例数据） */
export interface Program {
  id: string;
  region: Region;
  school: string;
  schoolCn: string;
  name: string;
  nameCn: string;
  duration: string;
  language: string;
  rounds: Round[];
  materials: string[];
  officialUrl: string;
  officialLabel: string;
  updatedAt: string;
  verified: boolean;
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
}
