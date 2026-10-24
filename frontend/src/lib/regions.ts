import type { Region } from "./types";

/** 地区的显示信息集中在这里，加新地区时只改这一处 */
export const REGION_INFO: Record<Region, { flag: string; label: string; depositWord: string }> = {
  HK: { flag: "🇭🇰", label: "香港", depositWord: "留位费" },
  UK: { flag: "🇬🇧", label: "英国", depositWord: "押金" },
  SG: { flag: "🇸🇬", label: "新加坡", depositWord: "押金" },
};

export const REGION_ORDER: Region[] = ["UK", "HK", "SG"];
