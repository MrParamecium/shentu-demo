import type { Region } from "./types";

/** 英港新授课型硕士的申请节点，按顺序推进；三地节点下标一一对应（OFFER_STAGE 等常量通用） */
export const STAGES: Record<Region, { key: string; label: string; hint: string }[]> = {
  HK: [
    { key: "prep", label: "准备材料", hint: "按清单把材料备齐" },
    { key: "submitted", label: "已提交网申", hint: "交申请费，等审核" },
    { key: "interview", label: "面试", hint: "部分项目有面试，没有可跳过" },
    { key: "offer", label: "收到录取", hint: "多为有条件录取，看清补交条件" },
    { key: "deposit", label: "已交留位费", hint: "港校留位费截止通常很短" },
    { key: "conditions", label: "已满足条件", hint: "补交毕业证、学位证、语言成绩" },
    { key: "visa", label: "签证", hint: "学校代办入境处签证申请" },
  ],
  UK: [
    { key: "prep", label: "准备材料", hint: "按清单把材料备齐" },
    { key: "submitted", label: "已提交网申", hint: "等审核" },
    { key: "interview", label: "面试", hint: "部分项目有面试，没有可跳过" },
    { key: "offer", label: "收到录取", hint: "多为有条件录取，看清补交条件" },
    { key: "deposit", label: "已交押金", hint: "部分学校要求交押金锁位" },
    { key: "conditions", label: "已满足条件", hint: "补交成绩单、学位证、语言成绩，转无条件" },
    { key: "visa", label: "CAS / 签证", hint: "拿到 CAS 后申请学生签证" },
  ],
  // 新加坡学生准证流程依据移民与关卡局官网（ica.gov.sg/reside/STP，2026-10-24 核实）
  SG: [
    { key: "prep", label: "准备材料", hint: "按清单把材料备齐" },
    { key: "submitted", label: "已提交网申", hint: "交申请费，等审核" },
    { key: "interview", label: "面试", hint: "部分项目有面试，没有可跳过" },
    { key: "offer", label: "收到录取", hint: "看清接受录取的期限和条件" },
    { key: "deposit", label: "已交押金", hint: "部分项目接受录取时要交押金" },
    { key: "conditions", label: "已满足条件", hint: "补交毕业证、学位证、语言成绩" },
    { key: "visa", label: "学生准证", hint: "开课前 2–3 个月网上申请，获批后凭 IPA 信入境办理" },
  ],
};

export const OFFER_STAGE = 3;
export const DEPOSIT_STAGE = 4;
export const CONDITIONS_STAGE = 5;
