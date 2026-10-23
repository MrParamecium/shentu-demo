// 校验 data/programs.json：字段齐全、id 唯一、日期合法且按顺序、链接是 https
// 用法：npm run check:programs
import fs from "node:fs";

const FILE = new URL("../data/programs.json", import.meta.url);
const REGIONS = new Set(["HK", "UK"]);
const FIELDS = new Set(["business", "finance", "cs", "data"]);
const REQUIRED = [
  "id", "region", "field", "school", "schoolCn", "name", "nameCn",
  "duration", "language", "rounds", "officialUrl", "officialLabel", "updatedAt", "verified",
];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isRealDate = s => DATE.test(s) && !Number.isNaN(Date.parse(s)) && new Date(s).toISOString().startsWith(s);

const programs = JSON.parse(fs.readFileSync(FILE, "utf8"));
const errors = [];
const seen = new Set();

programs.forEach((p, i) => {
  const at = `#${i} ${p.id ?? "(无 id)"}`;
  for (const k of REQUIRED) if (p[k] === undefined || p[k] === "") errors.push(`${at}: 缺少字段 ${k}`);
  if (seen.has(p.id)) errors.push(`${at}: id 重复`);
  seen.add(p.id);
  if (p.id && !/^[a-z0-9-]+$/.test(p.id)) errors.push(`${at}: id 只能用小写字母、数字和 -`);
  if (!REGIONS.has(p.region)) errors.push(`${at}: region 必须是 HK 或 UK`);
  if (!FIELDS.has(p.field)) errors.push(`${at}: field 必须是 ${[...FIELDS].join(" / ")}`);
  if (p.officialUrl && !p.officialUrl.startsWith("https://")) errors.push(`${at}: officialUrl 必须是 https 链接`);
  if (p.updatedAt && !isRealDate(p.updatedAt)) errors.push(`${at}: updatedAt 不是合法日期`);

  if (!Array.isArray(p.rounds) || p.rounds.length === 0) {
    errors.push(`${at}: rounds 至少要有一轮`);
    return;
  }
  let prev = "";
  for (const r of p.rounds) {
    if (!r.name) errors.push(`${at}: 有一轮缺少 name`);
    if (!isRealDate(r.deadline ?? "")) errors.push(`${at}: 「${r.name}」截止日期 ${r.deadline} 不合法`);
    else if (prev && r.deadline <= prev) errors.push(`${at}: 「${r.name}」截止日期没有晚于上一轮`);
    prev = r.deadline ?? prev;
  }
});

if (errors.length) {
  console.error(`programs.json 校验失败（${errors.length} 处）：\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
const byRegion = programs.reduce((m, p) => ({ ...m, [p.region]: (m[p.region] ?? 0) + 1 }), {});
console.log(`programs.json 校验通过：共 ${programs.length} 个项目（${Object.entries(byRegion).map(([k, v]) => `${k} ${v}`).join("，")}）`);
