import type { Region } from "./types";

/** 地区的显示信息集中在这里，加新地区时只改这一处 */
export const REGION_INFO: Record<Region, { flag: string; label: string; depositWord: string }> = {
  HK: { flag: "🇭🇰", label: "香港", depositWord: "留位费" },
  UK: { flag: "🇬🇧", label: "英国", depositWord: "押金" },
  SG: { flag: "🇸🇬", label: "新加坡", depositWord: "押金" },
  US: { flag: "🇺🇸", label: "美国", depositWord: "押金" },
};

export const REGION_ORDER: Region[] = ["UK", "HK", "SG", "US"];

/** 地区在网址里的写法：/uk、/hk、/sg */
export const REGION_SLUG: Record<Region, string> = { UK: "uk", HK: "hk", SG: "sg", US: "us" };

export function regionFromSlug(slug: string): Region | null {
  const hit = REGION_ORDER.find(r => REGION_SLUG[r] === slug.toLowerCase());
  return hit ?? null;
}

export interface FlowStep {
  title: string;
  points: string[];
}

export interface RegionGuide {
  /** 首页卡片和地区页顶部的图片（public/regions/，来源见 CREDITS.md） */
  image: string;
  imageAlt: string;
  /** 地区页横幅很扁，用 object-position 把地标留在画面里 */
  heroPosition: string;
  landmark: string;
  tagline: string;
  /** 这个地区申请最需要注意的几件事，地区页顶部展示 */
  highlights: string[];
  /** 地区专属的五段流程，替代首页原来的通用流程卡片 */
  flow: FlowStep[];
}

// 文案只写已核实或学校官网普遍通用的规则；具体到某个项目的要求以项目卡片上的官网链接为准
export const REGION_GUIDES: Record<Region, RegionGuide> = {
  UK: {
    image: "/regions/uk.webp",
    imageAlt: "伦敦塔桥夜景",
    heroPosition: "center 35%",
    landmark: "伦敦塔桥",
    tagline: "分轮截止 · 有条件录取 · CAS",
    highlights: [
      "很多商学院分轮截止，越早轮次名额越多",
      "录取多为有条件录取，毕业后补交成绩、学位证、语言成绩转为无条件",
      "部分学校要交押金才能锁位，押金一般不退",
      "拿到 CAS（录取确认函）后才能申请学生签证",
    ],
    flow: [
      { title: "选项目", points: ["看清是分轮截止还是滚动录取", "注意签证生和非签证生截止日期可能不同"] },
      { title: "备材料", points: ["CV、个人陈述、两封推荐信", "成绩单、在读证明、语言成绩"] },
      { title: "交网申", points: ["按轮次提交，部分项目有视频面试", "提交后留意邮箱和申请系统状态"] },
      { title: "跟录取", points: ["有条件录取：看清补交条件和期限", "按时交押金锁位", "补齐条件，转为无条件录取"] },
      { title: "办签证", points: ["学校发 CAS", "凭 CAS 申请英国学生签证"] },
    ],
  },
  HK: {
    image: "/regions/hk.webp",
    imageAlt: "香港维多利亚港夜景",
    heroPosition: "center 55%",
    landmark: "维多利亚港",
    tagline: "多轮截止 · 留位费 · 学校代办签证",
    highlights: [
      "多数项目分主轮、补录轮，或写明滚动审理、招满即止",
      "网申通常要交申请费",
      "收到录取后留位费期限往往很短，别错过",
      "签证一般由学校协助向入境处申请",
    ],
    flow: [
      { title: "选项目", points: ["对比各轮截止日期", "留意「滚动审理、可能提前截止」的项目"] },
      { title: "备材料", points: ["CV、个人陈述、两封推荐信", "成绩单、在读证明、语言成绩"] },
      { title: "交网申", points: ["网申同时交申请费", "部分项目有面试"] },
      { title: "跟录取", points: ["多为有条件录取", "按期交留位费", "毕业后补交毕业证、学位证"] },
      { title: "办签证", points: ["按学校指引提交签证材料", "学校协助向入境处申请"] },
    ],
  },
  SG: {
    image: "/regions/sg.webp",
    imageAlt: "新加坡滨海湾金沙夜景",
    heroPosition: "center 20%",
    landmark: "滨海湾金沙",
    tagline: "申请窗口 · 押金 · 学生准证",
    highlights: [
      "多数项目设申请窗口，部分分轮或滚动审理",
      "接受录取时常要交押金或入学费，一般不退",
      "学生准证要在开课前 2–3 个月网上申请",
      "获批后凭 IPA 信入境，再预约去移民与关卡局办手续",
    ],
    flow: [
      { title: "选项目", points: ["看清申请窗口的开放和截止日期", "部分奖学金截止早于申请截止"] },
      { title: "备材料", points: ["CV、个人陈述、两封推荐信", "成绩单、在读证明、语言成绩"] },
      { title: "交网申", points: ["网申同时交申请费", "部分项目有面试"] },
      { title: "跟录取", points: ["在期限内接受录取", "按要求交押金或入学费"] },
      { title: "办准证", points: ["开课前 2–3 个月网上申请学生准证", "获批后凭 IPA 信入境办理"] },
    ],
  },
  US: {
    image: "/regions/us.webp",
    imageAlt: "纽约曼哈顿下城夜景",
    heroPosition: "center 60%",
    landmark: "纽约曼哈顿",
    tagline: "多轮截止 · 3 封推荐信 · I-20 / F-1 签证",
    highlights: [
      "很多项目分 Early / Regular 等多轮截止，每个项目日期都不同",
      "推荐信多为 3 封，部分项目要求 GRE / GMAT 或写作样本",
      "录取后接受 offer 时很多项目要交押金锁位",
      "签证流程：学校发 I-20 → 交 SEVIS 费 → 填 DS-160 面签；最早开学前 30 天入境",
    ],
    flow: [
      { title: "选项目", points: ["对比各项目的截止轮次", "看清是否要求 GRE / GMAT"] },
      { title: "备材料", points: ["简历、目的陈述（SOP）、3 封推荐信", "成绩单、在读证明、语言成绩"] },
      { title: "交网申", points: ["网申同时交申请费", "部分项目有面试"] },
      { title: "跟录取", points: ["在期限内回复录取", "按要求交押金锁位"] },
      { title: "办签证", points: ["提交资金证明，学校发 I-20", "交 SEVIS 费、填 DS-160，预约面签"] },
    ],
  },
};
