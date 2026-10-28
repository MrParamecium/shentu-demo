# T-006 复核报告：Batch 18–25（PR #36–#42）

- 复核人 / 日期：浩翔（Claude）/ 2026-10-28
- 方法：不看证据文件，直接打开官网核对。curl 能读的用 curl；Cloudflare、前端渲染、按国家切换内容的页面用用户 Chrome（CDP）渲染后读 `innerText`。逐项查四件事：① 截止日和轮次（含已过期轮次）② 证据引文是否真的在该页截止日区块 ③ 是否全日制 ④ 是否写明 2027 入学
- 抽查量：新学校**全量**（剑桥 10 / 诺丁汉 18 / 伯明翰 23 / 牛津 5 + Saïd 4 页），老学校全量（NUS 5 / NTU 2 / 港科大 1 + 另 5 个存疑项目）。共核对 64 个新项目 + 9 个排除 / 存疑页面
- 修正都已提交到对应分支（各分支 commit 见文末）

## PR #42 | 牛津 | 抽查 5 项 + Saïd 4 页 | ✅ 5 项一致 | ❌ 1 条（未改数据）
- ✅ ox-msc-acs / mfocs / mcf / statsci / sds：页面都写 "Full time"、"Upcoming application deadline for 2027-28 entry"，轮次日期、学制和证据一致；MCF / StatSci / SDS 的两档日期是各页自己的原文，不是复用
- ✅ Saïd 排除项核实：MSc Applied Financial Economics "Part-time. Two years"；MSc AI for Business "Duration 2-4 years Time commitment Part time"；MSc Major Programme Management "Duration 2 years Time commitment Part time"
- ❌ **排除说明漏了 MSc Financial Economics（MFE）**：Saïd 目录里有这个项目（sbs.ox.ac.uk/programmes/degrees/msc-financial-economics），原文 "Duration 9 months Time commitment Full time Start dates 20 September 2027"，"2027 entry deadlines (11.59pm UK time): Stage 1: Wednesday 21 October 2026 Stage 2: Wednesday 6 January 2027 Stage 3: Wednesday 3 March 2027"。证据文件写的「Saïd 无全日制商科/金融 MSc」**不成立**。按 T-006 规则，经济类（Financial Economics）不收（伯明翰、诺丁汉同名项目都按经济域排除过），所以不补录，只改排除说明。**已修**（evidence 头部说明）

## PR #36 | 剑桥 | 抽查 10 项 | ✅ 9 项一致 | ❌ 1 条（已修）
- ✅ 9 个 MPhil 页面都写 "Study Mode : Taught Master of Philosophy (MPhil)" 和 "N months full-time"；"Dates and deadlines: Michaelmas 2027 … Application deadline …" 日期都一致。HIAI 页面另写 "21 months part-time"，但也有全日制，可以收
- ✅ cam-mfin 是全日制：MFin 主页 "Format Full-time"，FAQ 写 "No, the MFin is a full-time programme. There is no part-time or online option."
- ❌ **cam-mfin 漏标 rolling**：申请页原文 "Applications are accepted on a rolling basis until the final application deadline on 31 May 2027"，notes 里写了，但数据没设 `rolling: true`。**已修**

## PR #37 | 诺丁汉 | 抽查 18 项 | ✅ 18 项全日制 / 2027 一致 | ❌ 1 条（已修）
- ✅ 18 页都有原文 "Full-time: 12 months Part-time: Not available Start date: September 2027"；课程页确实**没有** deadline 区块
- ❌ **「没有截止日」的说法不对**：诺丁汉截止日写在统一申请页（pgstudy/apply/apply-for-a-taught-course），原文 "Applications for 2026/27 entry Standard application deadlines … Postgraduate taught 21 September 2026 3 August 2026 24 August 2026 … To be confirmed - Applications for 2027/28 entry"。也就是说，**2027/28 截止日官方还没公布**，不是滚动录取。18 条 notes 已改为如实描述；`rolling: true` 保留（只用于显示「无固定截止」）。**需要后续跟进**：日期公布后补「国际生截止」。**已修**

## PR #39 | 伯明翰 | 抽查 23 项 | ✅ 23 项全日制 / 2027 一致 | ❌ 23 项截止日错（已修）
- ✅ 23 页逐页确认，"27 August 2027 Application deadline for UK and non visa requiring applicants" 每页都有，不是照抄；"1 year full-time" 也是每页原文
- ❌ **截止日记错（23 个全部）**：页面「Application process」区块会随国家下拉切换。默认显示的是 UK / 非签证生的截止日 27 August 2027；选 China 后原文是 "**2 July 2027** Application deadline for international students requiring a visa. We will close applications as soon as the programme is full."。按规则只记需要签证的截止日，所以 23 个都改为 **国际生截止 2027-07-02**。证据文件里「国际生无单独截止」不成立，已逐行加复核修正
- ❌ 6 个有 1 月入学的项目（hrm / ib / mkt / finmgmt / acs / cs），需要签证的 1 月入学截止是 "30 October 2026 … for January start"（原记的 2026-12-18 是非签证生的），notes 已更正。**已修**

## PR #40 | NUS | 抽查 5 项 | ✅ 5 项日期一致 | ❌ 2 条（已修）
- ✅ 5 个申请页都有 "Intake Opening Date Closing Date August 2027 1 October 2026 31 January 2027"；学制 FT 1.5 年（General Track 1.5–2 年）和课程页原文一致；页面写了 full-time 和 part-time 都开，收全日制没问题
- ✅ **不重复**：5 个页面标题分别是 MComp (General Track) / (IS Specialisation) / (InfoSec Specialisation) / MComp in AI / MSc DFinTech。库里原有的 nus-mcomp-cs 是 CS Specialisation，6 个是 NUS 官网分开列的不同方向
- ❌ **证据复用**：「Effective from AY2025, there will only be one intake」这句只在 gen / isys / isec 三页有，mcomp-ai 和 mdft 申请页**没有**，那两行证据和 notes 已删掉这句
- ❌ **nus-msc-dft 语言**：mdft/admissions 页原文 "The minimum TOEFL scores for Internet Based Test (IBT) is 90 or 4.5; the minimum IELTS score is 6.0." → 改成 IELTS 6.0 / TOEFL iBT 90。**已修**

## PR #41 | 南洋理工 | 抽查 2 项 | ✅ 2 项一致 | 无问题
- ✅ ntu-msc-mfe：页面 "Round 1: 30 November 2026 Round 2: 31 January 2027 Round 3: 31 March 2027"、"Applications are reviewed on a rolling basis"、"Full-Time 12 months (3 trimesters or 6 mini terms)"、"July 2027 intake"
- ✅ ntu-msc-acc：轮次同上；"Our MACC programme is a 12-month full time programme"
- 备注：notes 写「另设 2 年非全日制」，MACC 页面没读到 Part-time 原文（MFE 有）。不影响收录，合并后可以把这半句删掉

## PR #38 | 港科大商学院 | 抽查 1 项 + 5 个存疑项 | ✅ 0 | ❌ 1 条错日期 + 3 个漏收（已修）
- ❌ **hkust-msc-go 截止日错**：「02.10.2026」是首页新闻的**发布日期**，不是截止日。日程页（msgo…/admissions/application-schedule-procedures，前端渲染）原文 "Application Deadline (23:59 HK Time) … Phase 1 Oct 11 2026 … Phase 2 Nov 29 2026 … Phase 3 Jan 10 2027 … Phase 4 Feb 28 2027"，并写 "Admissions operate on a rolling basis"。已改为 Phase 1–4、补 rolling；学制补为 "one-year full time"，语言补 IELTS 6.5（单项 5.5）/ TOEFL 80，链接改为日程页
- ❌ **3 个项目漏收**：ZCode 只看了首页（「Coming Soon」是 6 月的旧新闻）。ISM、MIMT、FOFB 的日程页都已经公布全日制 Phase 1–4（和 MSGO 同一组日期），已补录 hkust-msc-ism / hkust-msc-im / hkust-msc-fofb，证据写进 batch-25。FOFB 页面没写 rolling，所以不标
- 存疑保留：Marketing（原文只有 "Priority Round from July 2 to August 15, 2026, followed by Regular Rounds starting in September 2026"，没有具体截止日）；Accounting —— **待复核-网站打不开**（curl 000，Chrome ERR_CERT_AUTHORITY_INVALID）

## 总结
**7 个 PR 修正后都可以合并**，没有需要整批退回的。但这一轮又发现 1 批**错日期**（伯明翰 23 个、港科大 MSGO 1 个）和 3 处**没核实就下的结论**（牛津「Saïd 无全日制」、诺丁汉「无截止」、港科大「未公布」），问题都出在**页面内容动态加载**：按国家切换的区块、前端渲染的日程页、首页新闻。

**给 ZCode 的新规则**（建议写进 T-006「证据规则」第 6、7 条）：
6. 截止日区块有国家 / 申请人类型下拉的（如伯明翰），必须选 China 或 International 再读
7. 「没公布」「没有」这类结论，要先找学校的统一申请页 / 日程页确认；首页轮播和新闻日期不能当截止日

## 合并提醒
7 个 PR **单独和当前 main 合都没有冲突**（逐个试合，check:programs 都通过；伯明翰那个合进去后 build 通过）。但**它们之间会互相冲突**：都在 `programs.json` 末尾追加数据、都在 T-006 进度日志末尾追加内容，#37 / #39 / #36 / #42 还都在 `SCHOOL_ALIASES` 末尾加了一行别名。合完第一个，后面每个都会冲突，解法都一样：两边内容都保留（JSON 数组里两段新项目都留下，日志和别名两边都留），然后跑 `npm run check:programs`。

## 各分支修正 commit
| PR | 分支 | 复核 commit | 改了什么 |
|---|---|---|---|
| #42 | t-006-batch-18-oxford | 28c1db0 | evidence：Saïd MFE 排除理由更正 |
| #36 | t-006-batch-19 | 06bfaab | cam-mfin 补 rolling；evidence 加复核行 |
| #40 | t-006-batch-20 | 7288a10 | nus-msc-dft 语言；ai / dft 证据删掉复用的那句 |
| #41 | t-006-batch-21 | —（无改动） | — |
| #39 | t-006-batch-23 | 4fbbb07 | 23 个截止日 08-27 → 国际生 07-02；1 月入学签证生截止更正；evidence 逐行复核 |
| #37 | t-006-batch-24 | ebcb774 | 18 条 notes 改为「2027/28 截止 To be confirmed」；evidence 补中央申请页原文 |
| #38 | t-006-batch-25 | 4827598 | MSGO 截止日改为 Phase 1–4；补录 ISM / MIMT / FOFB 3 个；存疑更新 |
