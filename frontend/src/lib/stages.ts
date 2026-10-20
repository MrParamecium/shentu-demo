import type { Region } from "./types";

/** 英港授课型硕士的申请节点，按顺序推进 */
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
};

export const OFFER_STAGE = 3;
export const DEPOSIT_STAGE = 4;
export const CONDITIONS_STAGE = 5;
