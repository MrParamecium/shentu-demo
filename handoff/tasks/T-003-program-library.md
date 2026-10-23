# T-003 扩充项目库（第一批：英港热门 30 个）

- **负责人**：友涵
- **状态**：⬜ 待开始
- **分支**：`program-library`（浩翔已推了框架，在这个分支上继续）
- **布置人 / 日期**：浩翔 / 2026-10-23
- **预计**：每个项目 10–20 分钟，30 个约 1–2 周（课余时间）

## 背景
现在项目库只有 8 个项目，大多数用户找不到自己要申的项目，试一次就走。项目库是产品的核心价值，**准确是我们的卖点**：用户不找中介就是怕信息不准，所以每条数据都必须能在官网核对。

**范围说明**：这一批先做 30 个英港热门项目，验证流程、把数据格式跑顺。「港新 QS 前 100 全部项目」的大范围扩充单独讨论（规模估算见文末），这批做完再定。

## 你要交付什么
1. `frontend/data/programs.json` 里新增 **≥ 22 个项目**（加上已有 8 个，总数 ≥ 30）
2. 每个新项目都附**官网原文证据**（写在 PR 描述里，格式见下）
3. 查不到或存疑的项目，记在本文件「查不到 / 存疑」一节，不要硬填

## 开始前（第一次做先读完这节）
1. `git fetch && git checkout program-library && git pull`
2. 读这几个文件，10 分钟就够：
   - `frontend/src/lib/types.ts` 里的 `ProgramRecord`：每个项目有哪些字段
   - `frontend/data/programs.json`：已有 8 个项目，照着它们的格式写
   - `handoff/DECISIONS.md`：为什么数据放 JSON、为什么强调准确
3. 本地跑起来，看看项目库页面长什么样：
   ```bash
   cd frontend && npm install && npm run dev -- -p 3123
   ```
   打开 http://localhost:3123/programs

## 每个项目的操作步骤
1. **找官网项目页**：Google 搜「学校英文名 + 项目英文名」，**只认学校官网域名**（`*.ac.uk`、`*.edu.hk`、`*.hku.hk` 等）。不用中介、论坛、小红书、排名网站
2. **确认是 2027 年入学的信息**：页面上要明确写「2027 entry」「2027/28」「September 2027」之类。**只写了 2026 年的，不要加**，记进「查不到 / 存疑」
3. **按下表填字段**，复制一个已有项目改
4. **复制一句英文原文**当证据，写进 PR 描述
5. 每加完 5 个跑一次 `npm run check:programs`，有报错马上改

## 字段怎么填
| 字段 | 怎么填 | 例子 |
|---|---|---|
| `id` | 学校缩写-学位-专业缩写，小写加横线，不能重复 | `ucl-msc-ba` |
| `region` | `UK` 或 `HK` | `UK` |
| `field` | 四选一：`business` 商科管理 / `finance` 金融会计 / `cs` 计算机AI / `data` 数据科学 | `business` |
| `school` / `schoolCn` | 学校英文全称 / 中文常用名 | `University College London` / `伦敦大学学院` |
| `name` / `nameCn` | 官网项目英文全称 / 中文意译 | `Business Analytics MSc` / `商业分析硕士` |
| `duration` | 全日制学制 | `1 年` |
| `language` | 写**项目页**上的要求；项目页没写具体分数就写「见学校统一英语要求（以官网为准）」 | `IELTS 7.0（单项 ≥6.5）` |
| `rounds` | 每轮 `{"name", "deadline"}`，日期 `YYYY-MM-DD`，按时间先后 | 见下 |
| `officialUrl` | **写着截止日期的那个页面**，必须 https | |
| `officialLabel` | 链接显示的文字 | `UCL Business Analytics MSc 课程页` |
| `updatedAt` | 你核实的日期 | `2026-10-25` |
| `verified` | 官网明确写了 2027 入学日期才填 `true` | `true` |
| `notes` | 1–3 条中文短句，只写官网上有的 | 见下 |
| `extraMaterials` | 选填，项目额外要的材料 | `["GMAT/GRE（可选）"]` |

**`rounds` 的规则**
- 多轮：`第一轮`、`第二轮`…；曼大、华威这类叫 stage 的也写「第一轮」
- 只有一个截止日：`统一截止`
- 英国分「需要签证 / 不需要签证」两个截止日的，**只写需要签证的那个**，叫 `国际生截止`
- 港中文研究院页面是两栏（全日制 | 非全日制），**只取全日制**
- 滚动录取、没有固定截止日的（如 LSE）：先放进「查不到 / 存疑」，等 [T-004](T-004-rolling-admissions.md) 做完再加

**`notes` 写什么**（挑有的写）
- 截止时间点：「截止时间为英国时间 23:59」「香港时间中午 12:00」
- 滚动审理：「滚动审理，招满即止，建议尽早申请」
- 申请费、押金：「申请费 £80；押金 £2,000，录取后 30 天内缴纳」
- 改名、特殊要求：「原名 xxx，2027 年起更名」「需提交视频面试」
- **不写推测**，不写「一般」「通常」这类官网没说的话

## 待核实清单（22 个，按优先级）
**英国**
- [ ] UCL Computer Science MSc（ucl.ac.uk 有时打不开，换浏览器或稍后再试）
- [ ] UCL Business Analytics MSc
- [ ] KCL Data Science MSc
- [ ] Imperial MSc Computing
- [ ] Imperial Business School MSc Finance（商学院页面有分轮：`.../business-school/masters/<项目>/admissions/`）
- [ ] KCL International Management MSc
- [ ] 曼大 MSc Advanced Computer Science
- [ ] 爱丁堡 MSc Data Science（以课程页为准，信息学院页面年份写错过）
- [ ] 爱丁堡商学院 MSc Finance（或当前主推的金融硕士）
- [ ] 华威商学院 MSc Business Analytics
- [ ] 华威商学院 MSc Finance

**香港**
- [ ] 港大 Master of Data Science（MDASC）
- [ ] 港大 MSc in Financial Technology and Data Analytics
- [ ] 港大商学院 Master of Finance
- [ ] 港大商学院 MSc in Business Analytics
- [ ] 港科大 MSc in Information Technology
- [ ] 港科大商学院 MSc in Finance
- [ ] 港科大商学院 MSc in Business Analytics
- [ ] 港中文 MSc in Computer Science
- [ ] 港中文商学院 MSc in Business Analytics
- [ ] 城大 MSc Computer Science
- [ ] 理大 MSc in Data Science and Analytics

**选这些的理由**：中国学生申请最多的英港学校 × 四个专业大类（商科、金融、计算机、数据），每个大类英港都有覆盖。名单是浩翔凭经验选的，**不是统计数据**；如果你觉得某个项目更热门，可以替换，在进度日志里写一句原因。

## 已核实，可直接用（2026-10-23）
| 项目 | 截止 | 语言 | 官网 | 备注 |
|---|---|---|---|---|
| 曼大 MSc Business Analytics and Artificial Intelligence | 第一轮 2026-12-06 · 第二轮 2027-03-01 · 第三轮 2027-05-04 · 第四轮 2027-07-04 · 第五轮 2027-08-23 | IELTS 7.0（单项 ≥6.5）；不接受 Duolingo、TOEFL Home Edition | https://www.alliancembs.manchester.ac.uk/study/masters/how-to-apply/ | 原 Operational Research and Risk Analysis 版本已没有；申请费 £60；2026-10-10 开放申请 |
| LSE MSc Finance (full-time) | **无固定截止，滚动录取，招满即止** | IELTS 7.0（单项 ≥6.5） | https://www.lse.ac.uk/study-at-lse/graduate/msc-finance-full-time | 等 T-004 做完再加 |
| LSE MSc Data Science | **无固定截止，滚动录取** | IELTS 7.0（单项 ≥6.5） | https://www.lse.ac.uk/study-at-lse/graduate/msc-data-science | 等 T-004 做完再加 |

曼大这个可以直接写进 `programs.json`，算在你的 22 个里。

## 官网小技巧
- **港大**：项目页要浏览器打开（JS 渲染），入口 `https://portal.hku.hk/tpg-admissions/programme-listing`，按学院筛选；截止写作「Main Round / Clearing Round」。语言要求项目页没写的，港大统一最低线是 IELTS 6.0（单项 ≥5.5）
- **港科大**：`prog-crs.hkust.edu.hk` 经常超时；工学院 `seng.hkust.edu.hk` 的项目页可用；商学院有独立网站
- **港中文**：研究院 `gs.cuhk.edu.hk/programmes/<学院>/<项目>` 能看到截止日期，商学院项目在 `masters.bschool.cuhk.edu.hk/programmes/<代码>/`，两边对一下
- **曼大商学院**：所有项目的分阶段截止统一在 how-to-apply 页面
- 同一学校不同页面日期冲突时，**以项目页为准**，冲突写进「查不到 / 存疑」

## PR 怎么提
- 标题：`T-003 项目库第一批：新增 N 个项目`
- 描述里每个新项目一行，方便浩翔抽查：
  ```
  - ucl-msc-ba | https://官网链接 | "Application deadline: 31 March 2027 ..."（原文）
  ```

## 完成标准
- [ ] `programs.json` 总数 ≥ 30，英国、香港各 ≥ 12 个，四个专业大类都有
- [ ] 每个新项目 `verified: true`，PR 描述里有官网链接 + 英文原文
- [ ] `npm run check:programs`、`npm run build`、`npm run lint` 全过
- [ ] 浏览器里：按地区、专业筛选和搜索都正常；随便挑 3 个新项目点「添加到我的申请」，看板上截止日期显示正确
- [ ] 浩翔抽查 5 个，和官网一致

## 遇到问题
- 不确定的字段先留空或写「以官网为准」，在进度日志里写下来，**不要猜**
- 卡住超过 30 分钟就在进度日志里写清楚卡在哪，跳过做下一个

## 查不到 / 存疑
- LSE MSc Finance、LSE MSc Data Science：滚动录取，等 T-004

## 进度日志

### 2026-10-23 · 浩翔
- 搭好框架：数据移到 JSON、地区 + 专业筛选、`npm run check:programs` 校验脚本，推到 `program-library`
- 核实了曼大 BA&AI、LSE ×2（见上表）
- 布置给友涵

## 附：「港新 QS 前 100 全部项目」规模估算（讨论用，不在本任务范围）
- 港中文研究院列出的授课型硕士约 **124 个**（2026-10-23 数官网页面，已排除 MPhil/PhD、EMBA）
- 港新进 QS 前 100 的学校大约 7 所（港大、港中文、港科大、城大、理大、新国立、南洋理工；**排名名单需按最新 QS 核对**）
- 粗估合计 **700–900 个项目**，人工核实按每个 15 分钟算，约 **175–225 小时**，而且每年都要重新核一遍
