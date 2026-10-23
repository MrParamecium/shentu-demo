# T-003 扩充项目库到 30+ 个英港项目

- **负责人**：友涵
- **状态**：⬜ 待开始
- **分支**：`program-library`（浩翔已推了框架，在这个分支上继续）
- **布置人 / 日期**：浩翔 / 2026-10-23

## 背景
现在只有 8 个项目，大多数用户找不到自己要申的项目，试一次就走。项目库是产品的核心价值，而且**准确是卖点**：每条数据都要能在官网核对。

## 已经做好的框架（分支 `program-library`）
- 数据在 `frontend/data/programs.json`，字段见 `frontend/src/lib/types.ts` 的 `ProgramRecord`
- 材料清单按地区自动生成，个别项目额外的材料写 `extraMaterials`
- 校验：`cd frontend && npm run check:programs`（字段、id 唯一、日期合法、轮次顺序、https 链接）
- 项目库页面已有「地区 + 专业」筛选；专业 `field` 取值：`business` 商科管理 / `finance` 金融会计 / `cs` 计算机AI / `data` 数据科学

## 要做什么
- [ ] 按下面的清单逐个去**官网**核实 2027 年入学信息，写进 `programs.json`
- [ ] 先做 [T-004](T-004-rolling-admissions.md)（滚动录取），不然 LSE 这类项目放不进去
- [ ] 每加一批跑一次 `npm run check:programs`

## 每个项目要查的字段
| 字段 | 说明 |
|---|---|
| `officialUrl` | 写有截止日期的那个官方页面 |
| `name` / `nameCn` | 官网英文全称；改名了用新名，在 `notes` 说明 |
| `rounds` | 每轮 `{name, deadline}`，日期 `YYYY-MM-DD`；轮次名用「第一轮」「统一截止」等；英国区分签证/非签证的只写**需要签证**的那个 |
| `language` | 如「IELTS 7.0（单项 ≥6.5）」；项目页没写具体分数就写「见学校统一英语要求（以官网为准）」 |
| `notes` | 1–3 条中文短句：截止时间点、出结果时间、申请费、押金、改名、特殊要求。**不写推测** |
| `verified` | 只有官网明确写了 **2027 入学** 的日期才填 `true` |
| `updatedAt` | 你核实的日期 |

**只用学校官网**，不用中介、论坛。只找到 2026 或更早年份日期的项目先**不加**，记在下面「查不到 / 存疑」里。

## 待核实清单
**英国 · 伦敦**
- [x] LSE MSc Finance（已核实，见下）
- [x] LSE MSc Data Science（已核实，见下）
- [ ] UCL Computer Science MSc（ucl.ac.uk 对 curl 返回 403，要用浏览器看）
- [ ] UCL Business Analytics MSc
- [ ] KCL Data Science MSc
- [ ] Imperial MSc Computing
- [ ] Imperial Business School MSc Finance（商学院页面有分轮：`.../business-school/masters/<项目>/admissions/`）
- [ ] KCL International Management MSc

**英国 · 其他城市**
- [x] 曼大 MSc Business Analytics and AI（已核实，见下）
- [ ] 曼大 MSc Advanced Computer Science
- [ ] 爱丁堡 MSc Data Science（以课程页为准，信息学院页面年份写错过）
- [ ] 爱丁堡商学院 MSc Finance
- [ ] 华威商学院 MSc Business Analytics
- [ ] 华威商学院 MSc Finance
- [ ] 布里斯托 MSc Computer Science（转专业）
- [ ] 格拉斯哥 MSc Data Science

**香港 · 港大 / 港科大**
- [ ] 港大 Master of Data Science（MDASC）
- [ ] 港大 MSc in Financial Technology and Data Analytics
- [ ] 港大商学院 Master of Finance
- [ ] 港大商学院 MSc in Business Analytics
- [ ] 港科大 MSc in Information Technology
- [ ] 港科大商学院 MSc in Finance
- [ ] 港科大商学院 MSc in Business Analytics

**香港 · 港中文 / 城大 / 理大**
- [ ] 港中文 MSc in Computer Science
- [ ] 港中文商学院 MSc in Business Analytics
- [ ] 港中文 数据科学类授课硕士
- [ ] 城大 MSc Computer Science
- [ ] 城大商学院 MSc Finance
- [ ] 理大 金融科技类授课硕士
- [ ] 理大 MSc in Data Science and Analytics

**官网小技巧**
- 港大项目页是 JS 渲染：`https://portal.hku.hk/tpg-admissions/programme-listing`，按学院筛选；截止写作「Main Round / Clearing Round」，香港时间中午 12 点
- 港科大 `prog-crs.hkust.edu.hk` 经常超时；工学院 `seng.hkust.edu.hk` 的项目页可用
- 港中文：研究院 `gs.cuhk.edu.hk/programmes/...` 是两栏（全日制 | 非全日制），**只取全日制**；商学院项目在 `masters.bschool.cuhk.edu.hk/programmes/<代码>/`
- 曼大商学院分阶段截止统一在 `alliancembs.manchester.ac.uk/study/masters/how-to-apply/`

## 已核实（2026-10-23，可直接用）
| 项目 | 截止 | 语言 | 官网 | 备注 |
|---|---|---|---|---|
| LSE MSc Finance (full-time) | **无固定截止，滚动录取，招满即止** | IELTS 7.0（单项 ≥6.5） | https://www.lse.ac.uk/study-at-lse/graduate/msc-finance-full-time | 原文：*"Application deadline None – rolling admissions … applications will close once the programme is full"* |
| LSE MSc Data Science | **无固定截止，滚动录取** | IELTS 7.0（单项 ≥6.5） | https://www.lse.ac.uk/study-at-lse/graduate/msc-data-science | 同上 |
| 曼大 MSc Business Analytics and Artificial Intelligence | 第一阶段 2026-12-06 · 第二 2027-03-01 · 第三 2027-05-04 · 第四 2027-07-04 · 第五 2027-08-23 | IELTS 7.0（单项 ≥6.5）；不接受 Duolingo、TOEFL Home Edition | https://www.alliancembs.manchester.ac.uk/study/masters/how-to-apply/ | 原名 Operational Research and Risk Analysis 版本已没有；申请费 £60；2026-10-10 开放申请；各阶段出结果 2027-02-19 / 05-02 / 06-18 / 07-30 / 08-31 |

## 完成标准
- [ ] `programs.json` 至少 30 个项目，英国、香港各 15 个左右，四个专业大类都有
- [ ] `npm run check:programs`、`npm run build`、`npm run lint` 全过
- [ ] 浏览器里按地区 / 专业筛选、搜索都正常
- [ ] PR 描述里列出每个新项目的官网链接，方便浩翔抽查

## 查不到 / 存疑
（核实时遇到只有旧年份、页面冲突的项目记在这里）

## 进度日志

### 2026-10-23 · 浩翔
- 搭好框架：数据移到 JSON、专业筛选、校验脚本，推到 `program-library`
- 并行核实时 API 额度用完中断，只核实完上面 3 个；剩下的交给友涵
