# T-015 已核实项目库：只上线 100% 能对上官网原文的项目

- **负责人**：浩翔（Claude 执行）
- **日期**：2026-10-29
- **结果**：候选 405 个 → **353 个上线**（HK 64 / UK 279 / SG 10），**52 个暂不上线**（另一个 PR，标为待核实）

## 候选从哪来
main 的 338 个 + 7 个待合并 PR（#36–#42，含复核修正）新增的 64 个 + #38 复核补录 3 个 = 405 个。另外采纳 GPT #46 里经浩翔复核确认正确的两处：谢菲尔德 20 个补「国际生截止 2027-08-26」、利兹 5 个计算机项目补 2027-07-30。#46 其余改动（格拉斯哥、理大、港中文）**不采纳**，见 #46 复核评论。

## 怎么判「100% 确定」
每个项目都在 2026-10-28/29 **重新抓了官网页面**，用 curl 抓一遍，再用本机 Chrome 抓一遍。Chrome 会展开折叠区；伯明翰页面先选 China；KCL 等前端渲染页面等截止区块加载出来再读。截止页和全日制说明不在同一页的，再抓一个官方页面。然后脚本逐项判定，**任何一项对不上就不上线**：

1. `rounds` 里**每一个**截止日都必须以英文日期形式出现在本次抓到的官网正文里。爱丁堡的截止表只写日和月，页面同时写了 "Year of entry: 2027" 才算通过
2. 没有截止日的（rounds 为空），页面必须有 rolling / continuous basis / 招满即止原文
3. 标了 `rolling: true` 的，页面必须有 rolling / 招满即止原文
4. 必须读到**明确的全日制原文**，比如 "Duration 1 year Full-time"、"one-year full-time programme"、曼大 Course options 表里 Full-time 一栏为 Y。导航菜单里的 "Full-time MBA" 不算
5. 页面必须出现 2027

**按学校的规则也逐所人工核对过**（页面上有多个截止日时，要确认库里记的是需要签证的国际生那一个）：

| 学校 | 库里记的是 | 官网原文依据 |
|---|---|---|
| UCL | 需签证申请人截止 | "Applicants who require a visa 19 Oct 2026 - 22 Mar 2027"（HCI 只有 "All applicants" 一档） |
| KCL | 国际生最终截止 + 首轮 | "Overseas (international) fee status: 25 July 2027" |
| 布里斯托 | 海外申请人截止 | "Overseas applicants: 12 August 2027. Home applicants: 9 September 2027" |
| 格拉斯哥 | 国际生 6 轮 | 折叠区 "International application rounds … Round 1: 1 October 2026 to 5 November 2026 … Round 6: 14 May 2027 to 8 July 2027"；24 August 2027 是 "UK applicants" |
| 伯明翰 | 需签证国际生截止 | 选 China 后："2 July 2027 Application deadline for international students requiring a visa" |
| 利兹 | 国际生截止 | "30 July 2027 – International applicants 10 September 2027 – UK applicants" |
| 谢菲尔德 | 需签证截止（学校统一页） | sheffield.ac.uk/postgraduate/deadlines："Thursday 26 August 2027 Last date to apply for a postgraduate course if you'll need a visa to study in the UK"；课程页未另列日期 |
| 华威 | 统一截止 | "The on-time deadline for taught postgraduate courses starting in September/October 2027 is 2 August 2027" |
| 理大 | 提前轮 + 主轮 | "Non-local - Mixed Mode Sept 2027 Entry Early Round: 2026-10-20 Main Round: 2027-02-25" |
| 港科大 MSc Finance | 全日制 4 个 Phase | 页面分 "Full-time mode" / "Part-time mode" 两张表，库里用的是全日制那张 |

## 暂不上线的 52 个（另开 PR，`verified: false`）
| 学校 | 个数 | 原因 |
|---|---|---|
| 诺丁汉 | 18 | 学校统一申请页写 2027/28 截止 "To be confirmed"，官方没公布 |
| 利兹 | 16 | 课程页指向 How to Apply 页，没写本课程截止；统一页只说国际生"通常"截止 30 July 2027、部分课程可能更早 |
| 杜伦 | 11 | 课程页没有截止日，也没有 rolling / 招满即止原文 |
| 曼大 | 2 | Business Analytics & AI、Accounting & Finance：库里链接是统一的 how-to-apply 页，没有读到本项目的全日制原文 |
| 帝国理工 | 2 | Economics, Strategy & Business、Management：没有读到全日制原文 |
| NUS | 2 | MSBA、MSc Finance：没有读到全日制原文 |
| 港科大 | 1 | MSc AI & Entrepreneurship：没有读到全日制原文 |

这 52 个**不是说数据错了**，而是现在拿不出 100% 的官网原文。补到原文后，可以逐个移回已核实库。

## 复现
脚本放在 `handoff/evidence/T-015/`：`check.py`（判定规则）、`audit.py`（Chrome 抓取）、`verdict.json`（405 个项目的判定和原因）。
