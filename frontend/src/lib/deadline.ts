import type { Application, Program } from "./types";
import { REGION_INFO } from "./regions";
import { DEPOSIT_STAGE, OFFER_STAGE } from "./stages";

export interface NextDeadline {
  label: string;
  date: string;
  daysLeft: number;
}

/** 没有固定截止日期、按滚动录取处理的待办（只出现在网申阶段） */
export interface RollingDeadline {
  label: string;
  rolling: true;
}

export type Upcoming = NextDeadline | RollingDeadline;

export const isRolling = (u: Upcoming | null): u is RollingDeadline => !!u && "rolling" in u;

const DAY = 24 * 60 * 60 * 1000;

/** 距离某个 YYYY-MM-DD 还有几天（按本地日期计，当天为 0） */
export function daysUntil(date: string, now = new Date()): number {
  const [y, m, d] = date.split("-").map(Number);
  const target = new Date(y, m - 1, d).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  return Math.round((target - today) / DAY);
}

/**
 * 网申轮次的截止标签：「第一轮」→「第一轮网申截止」；
 * 轮次名本身已带「截止」的（国际生截止、统一截止…）原样显示，避免「国际生截止网申截止」
 */
export function roundDeadlineLabel(roundName: string): string {
  return roundName.endsWith("截止") ? roundName : `${roundName}网申截止`;
}

/** 当前节点对应的下一个截止日期：网申截止 → 留位费截止 → 补交条件截止 */
export function nextDeadline(app: Application, program: Program): Upcoming | null {
  if (app.outcome !== "pending") return null;
  let label: string | null = null;
  let date: string | undefined;
  if (app.stage < 1) {
    const round = program.rounds[app.roundIndex] ?? program.rounds[0];
    // 没有固定截止日期的滚动录取项目
    if (!round) return { label: "网申截止", rolling: true };
    label = roundDeadlineLabel(round.name);
    date = round.deadline;
  } else if (app.stage === OFFER_STAGE) {
    label = `${REGION_INFO[program.region].depositWord}截止`;
    date = app.depositDeadline;
  } else if (app.stage === DEPOSIT_STAGE) {
    label = "补交条件截止";
    date = app.conditionDeadline;
  }
  if (!label || !date) return null;
  return { label, date, daysLeft: daysUntil(date) };
}

export type Urgency = "overdue" | "urgent" | "soon" | "normal";

export function urgencyOf(daysLeft: number): Urgency {
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 7) return "urgent";
  if (daysLeft <= 30) return "soon";
  return "normal";
}

export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y}年${Number(m)}月${Number(d)}日`;
}

export function daysText(daysLeft: number): string {
  if (daysLeft < 0) return `已过期 ${-daysLeft} 天`;
  if (daysLeft === 0) return "今天截止";
  return `还剩 ${daysLeft} 天`;
}
