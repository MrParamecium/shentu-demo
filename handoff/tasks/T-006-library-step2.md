# T-006 项目库第二步：英港新热门学校的四大类项目

- **负责人**：智谱 ZCode（浩翔在旁抽查）
- **状态**：🔄 进行中
- **分支**：每批一个分支，`t-006-batch-N`（N 从 1 开始）
- **布置人 / 日期**：浩翔 / 2026-10-23；2026-10-26 改为交给 ZCode 持续做

## 背景
三步走的第二步，见 `DECISIONS.md`「项目库分三步走」。现在库里 38 个，目标是**热门学校的热门项目尽量全收**，越多越好。
**准确是我们的卖点**：每一条都必须能在官网核对。宁可少一个，也不要错一个。

## 范围
- 地区：UK / HK / SG
- 专业大类（`field`）四选一：`business` 商科管理 / `finance` 金融会计 / `cs` 计算机AI / `data` 数据科学
- 只收**授课型硕士**（MSc / MA / MSocSc / MBA 除外 / 不收 MPhil、PhD、EMBA、在职兼读）
- 只收**全日制**
- 只收官网明确写了 **2027 年入学**（2027 entry / 2027-28 / Sept 2027 / AY2027-28）的信息

## 学校名单（按优先级，一批做一两所学校）
学校名单来自浩翔凭经验列的「中国学生申请多的学校」，**不是统计数据**。开工前请对照最新一期 QS，在进度日志里记下用的榜单年份；有学校明显遗漏就补。

**第一优先：库里已有的学校，把四大类补全**
- UK：UCL、LSE、Imperial、KCL、爱丁堡、曼彻斯特、华威
- HK：港大（含港大商学院）、港中文、港科大、城大、理大
- SG：NUS、NTU

**第二优先：英国其他热门学校**
布里斯托、格拉斯哥、杜伦、巴斯、伯明翰、利兹、南安普顿、埃克塞特、谢菲尔德、诺丁汉、玛丽女王、卡迪夫、利物浦、兰卡斯特、约克、城市大学（Bayes/Cass 现名以官网为准）、苏格兰的圣安德鲁斯、阿伯丁

**第三优先：香港其他、新加坡其他**
- HK：浸会大学、岭南大学
- SG：新加坡管理大学 SMU（榜单排名低于前两所，但中国学生申请多，可收）

牛津、剑桥授课型硕士很少且申请规则特殊，放最后，单独讨论。

## 每个学校怎么做
1. 在该校官网授课型硕士列表页，筛出属于上面四大类的全部项目，先列清单（项目官网全名、专业大类、项目页链接）
2. 逐个项目打开项目页，按下面「字段怎么填」收集；官网拦截就换浏览器 / 换页面，仍打不开就记进「查不到 / 存疑」，**不要凭记忆或第三方网站补**
3. 一个学校做完一次提交，不要攒太多

## 字段怎么填
照着 `frontend/data/programs.json` 里已有项目的格式写，规则同 [T-003](T-003-program-library.md) 的「字段怎么填」和 `rounds` 规则，这里只列要点：

- `id`：学校缩写-学位-专业缩写，小写加横线，不重复
- `rounds`：日期 `YYYY-MM-DD`，按时间先后；多轮写「第一轮」「第二轮」；单一截止日写「统一截止」；英国分需签证 / 不需签证的只写**需要签证**的，叫「国际生截止」
- 滚动录取没有固定截止日：设 `"rolling": true`，`rounds` 留空数组，`notes` 里写「滚动录取，招满即止」
- `officialUrl`：写着截止日期的那个页面，必须 https
- `updatedAt`：你核实的当天日期
- `verified`：官网明确写了 2027 入学信息才填 `true`
- `notes`：1–3 条中文短句，只写官网上有的，**不写「一般」「通常」这类推测**
- 语言要求项目页没写具体分数 → 写「见学校统一英语要求（以官网为准）」

## 加新学校时别忘了
- **搜索别名**：在 `frontend/src/lib/programs.ts` 的 `SCHOOL_ALIASES` 里给新学校加缩写和常用叫法，key 必须和 `school` 字段完全一致。没配的话 `npm run check:programs` 会报错
- **轮次名**：以「截止」结尾的（统一截止、国际生截止）原样显示；其他会自动加「网申截止」

## 不能犯的错（宁可不加）
- 官网只写了 2026 年的日期 → 不加，记进存疑
- 两个页面日期不一致 → 以项目页为准，冲突记进存疑
- 日期只写月日没写年份 → 要在页面上找到 Year of entry 之类证据，找不到就不加
- 项目改名、停招、暂停申请 → 不加，记进存疑
- 看不到的内容（人机验证、需要登录）→ 不要猜，记进存疑，让浩翔在浏览器里补

## 每批交付
1. `programs.json` 新增项目，`npm run check:programs` 通过，`npm run build`、`npm run lint` 通过
2. **证据文件** `handoff/evidence/T-006-batch-N.md`：每个新项目一行
   ```
   - ucl-msc-ba | https://官网链接 | 访问日期 | "Application deadline: 31 March 2027 ..."（官网英文原文）
   ```
   证据必须是从页面里实际读到的原文，**不能是回忆或改写**
3. 任务文件里「进度日志」追加一条：本批做了哪所学校、几个项目、每个大约花多久、存疑项
4. 开 PR 到 main（标题 `T-006 项目库第 N 批：学校名 新增 M 个项目`），PR 描述贴证据文件的链接
5. 每批的 `handoff/sessions/日期-zcode.md` 交接记录（可每天一条，不用每批一条）

## 浩翔怎么抽查
每批随机抽 3–5 个，对照官网原文核对日期、语言、学制。发现错误 → 整批退回重查同学校其余项目，并在进度日志记下错在哪。

## 完成标准（第二步整体）
- [ ] 第一优先名单的 14 所学校四大类补全
- [ ] 第二、三优先学校按进度逐步收录
- [ ] 所有新项目 `verified: true` 且证据文件齐全
- [ ] 每个学校的「查不到 / 存疑」都有记录

## 查不到 / 存疑
（暂无）

### Batch 1 · UCL（2026-10-27）
- **UCL Strategic Accounting and Finance MSc**：2027/28 在招，但页面 LOCATION 标注 "Distance learning programme"（远程教学，非全日制在校），按「只收全日制」规则不收
- **UCL Technology Management MSc**：2027/28 在招（开设于 Space and Climate Physics 系），属太空科技领域的技术管理，按领域范围暂不收；要收的话请浩翔确认
- **旧版 A-Z 列表 ≠ 2027 权威清单**：`/prospective-students/graduate/taught-degrees`（537 个）还是 2026/27 信息；2027/28 权威清单在新版 `/study/prospective-students/graduate/courses`（708 个）。坑：旧版无后缀链接对新目录部分项目 404 **≠ 停招**（Entrepreneurship、People Analytics、Integrated Machine Learning Systems 等新目录 slug 改成了 `msc-` 前缀），判断是否在招必须查新版目录
- **领域边界决定（请浩翔抽查时确认）**：收了 Business and Sustainability（Bartlett 环境学院）、Supply Chain Management with Sustainability and Analytics（管理学院）、Private Equity with Digital Finance（土木系）、Statistics（归 data）、Scientific and Data Intensive Computing（物理系 CDIS 中心）；**没收**应用域项目（AI and Medical Imaging、AI for Biomedicine and Healthcare、Medical Robotics and AI、AI for Sustainable Development、Health Data Science、Medical Statistics and Data Science、Sociology and Data Science、Social and Geographic Data Science、Crime Science with Data Science、Ecology and Data Science、Energy Systems and Data Analytics、Urban and Spatial Data Science、Knowledge Information and Data Science 等）、建造类项目管理（Management of Complex Projects、Strategic Management of Projects、Digital Engineering Management 等）、Law and Finance、Engineering with Finance、Global Healthcare Management ×3、Biotech and Pharmaceutical Management、Drug Discovery and Pharma Management

### Batch 3 · Imperial（2026-10-27）
- **Imperial 2027 目录没有独立的数据科学硕士**：原 MSc Statistics（数学系）未出现在 2027 课程目录（目录里数学系只有 Applied Mathematics、Pure Mathematics 等）；finder 里 slug `data-science` 的页面实际是 **Biomedical Research (Data Science)**（生物医学域，不收）→ Imperial 的 data 类本批零新增，待浩翔确认要不要补
- **商学院项目不在课程 finder 全集里**：`/study/courses` finder 只列了 6 个 BS 课程，商学院官网 `/business-school/programmes/` 列了 13 个——查 Imperial 商学院必须单独看商学院官网。Management、Strategic Marketing、Investment & Wealth Management、Risk Management & Financial Engineering、Innovation, Entrepreneurship & Management 都还在 2027 招生
- **不收**：MSc Strategic Marketing (Online)（在线版）、Global Health Management（医疗域）、MSc Biomedical Research (Data Science)（生物医学域）、两个 MBA
- **边界决定（请浩翔确认）**：收了 AI, Economics and Policy（官网写由计算机系开设、商学院招生，归 business）、Climate Change, Management & Finance（气候域商科，类比 UCL Business and Sustainability）；MSc Risk Management 的官方全称是 Risk Management **and** Financial Engineering（slug 只有 risk-management）

### Batch 4 · KCL（2026-10-27）
- **KCL Artificial Intelligence MSc 未出现在 2027 A-Z 课程列表**（只有 AI & Data in Culture and Society MA，社会学科不收），校内 Cyber Security MSc 也只剩 Online 版——疑停招/改名，待浩翔用浏览器确认
- **不收**：Health Data Science（医疗域）、Urban Informatics（城市域）、Applied Bioinformatics（生物域）、Advanced Cyber Security (Online)（在线版）、Healthcare Management（医疗域）、MedTech Innovation & Entrepreneurship（医疗域）
- KCL 截止结构特殊：不是分轮录取，是「首轮截止（2027-03-09）→ 未满员继续收到最终截止」，库里写两轮：首轮截止 + 国际生截止（2027-07-25），Home 最终截止写进备注

### Batch 5 · 爱丁堡（2026-10-27）
- **边界决定（请浩翔确认）**：收了 AI for Business（商学院）、Climate Change Finance and Investment（商学院，气候变化方向）、Finance, Technology and Policy（商学院）、Computational Mathematical Finance / Financial Modelling and Optimization（数学系，归 finance）、Statistics with AI / Statistics with Data Science / Operational Research with Data Science（数学系，归 data）；**没收**：Service Management and Design（艺术人文社科学院）、Design Informatics（设计域）、HPC 系列（含 Online Learning 版）、Data and AI Ethics（伦理域）、Economics 系列（经济域）、International Banking Law and Finance LLM（法学域）、Bioinformatics / Data Science for Biology（生物域）、Climate Change Management（地质学院气候域，非商学院）

### Batch 6 · 曼彻斯特（2026-10-27）
- **不收**：MSc Financial Management（官网写 "Part-time blended learning for 2 years"，在线混合非全日制）、MSc Financial Economics（社科学院，经济域）、DS&AI 的 Social Analytics / Urban Analytics 路径、Economics and Data Science（经济域）、International Fashion Marketing（时尚域）、Real Estate Finance and Investment（房地产域）、工学院项目管理类（Management of Projects / Commercial / Engineering PM）、Business Psychology / Organisational Psychology（心理学域）、MSc Accounting and Finance 已在库不重复
- **DS&AI 新家族归 data**：曼大 2026 新开 MSc Data Science and Artificial Intelligence 大家族（官网列 School of Social Sciences 跨学科项目），收了 Business and Management / Computer Science Data Informatics / Mathematics 三个路径，Social Analytics / Urban Analytics 按域规则没收；field 统一记 data（核心学科是数据科学），浩翔抽查时可确认
- CS 系 4 个新项目（AI / Machine Learning / Cyber Security / Software Engineering）项目页不写英语分数，按规则记「见学校统一英语要求」（库里 Advanced Computer Science 的 7.0/6.5 是友涵之前在页面上核实过的，别混用）

### Batch 7 · 华威（2026-10-27）
- **Business with Finance MSc 已改名 Finance & Management MSc**（旧 slug msc-business-finance 现指向同名页面），只收一条，归 finance
- **Global Central Banking and Financial Regulation 不收**：MSc 变体页面写 "2-3 years (MSc), part-time, online"，非全日制在线
- **不收**：Engineering Business Management / Engineering Design Management / Healthcare Operational Management / Humanitarian Engineering（WMG 工程域）、Biotechnology/Medical Biotechnology Business Management（生物域）、Behavioural and Data Science / Behavioural and Economic Science（行为科学域）、Big Data and Digital Futures（跨学科数字未来域）、Social Data Science（社会域）、Economics 系列（经济域）、Intercultural Communication for Business（传播域）、LLM、Computer Science MSc by Research（研究型）、MBA；另有 WMG「Digital & AI Leadership MSc」未评估（面向管理者的领导力项目，疑在职向），浩翔可定
- 英语按院系两档（页面原文）：WBS = IELTS 7.0（两项 6.0/6.5 其余 ≥7.0）；WMG/计算机系/统计系 = 6.5（单项 ≥6.0）。库里原有两条华威写的「见学校统一英语要求」可以后续补成具体分数

### Batch 8 · 港大（2026-10-27）
- **港大商学院 2027 入学起硕士为 2 年制**：portal 各页 "Expected Duration 2 years"（Full-time），与库内 MFin/MSc BA 口径一致，新增 9 个商学院项目都按 2 年记
- **MSc in Financial Technology and Data Analytics（FTDA）需复核**：2027 portal 目录标注 **Part-Time**（"MSc(FTDA) Part-Time"），但库里 hku-msc-ftda 已有条目（轮次 主轮/补录轮）——按「只收全日制」规则可能要下架，浩翔定
- **MSc in Computer Science 新增 AI 与去中心化技术方向**（Delta X Fellowship 版本），作为独立条目收录（hku-msc-cs-aidt），与原有通用方向条目并列
- **不收**：MBA / EMBA / IMBA（MBA 类）、Master of Economics（经济域）、Infrastructure/Innovative Design/Low-Altitude/Microelectronics 等工学院 MSc(Eng)（工程域）、Environmental Management（环境域，已 Closed）、Food Industry Management（食品域）、Delta X Fellowship 通用方向版本（与库内条目重复）

### Batch 9 · 港中文（2026-10-27）
- **MSc in Information and Technology Management 只招 Part-time**（页面写 "Part-time Mode Only"）→ 不收；其全日制版为 MSc in Information Science and Technology Management（已收，归 business，研究院列商学院）
- **不收**：Real Estate（房地产域）、Aviation Management / Sports Business Management / Family Business Management / Leadership for Experience Economy（领域管理域）、Professional Accountancy (Shanghai)（上海校区）、Electronic Engineering / Information Engineering / Mechanical / Microelectronics / Biomedical（工程域）、AI for Science（科学域）、Earth and Environmental Analytics（环境域）、Mathematics 纯数学、Chemistry/Physics/Nutrition/Bio 等
- **边界决定（请浩翔确认）**：收了 Information Science and Technology Management（跨院项目，归 business）、Financial Technology（工程学系开设，归 finance）、Actuarial Science and Insurance Analytics（精算保险，归 finance）、Risk Management Science and Data Analytics（统计系，归 data）、E-Commerce and Logistics Technologies（工程学院，归 cs）；CUHK 无独立 Data Science MSc，统计系三个项目（Advanced Studies in Statistics and DS / DS and Business Statistics / RMS and DA）按 data 收

### Batch 10 · 港科大（2026-10-27）
- **港科大 2027/28 目录（prog-crs）尚未上线**，现在能核实的只有工学院系网页（seng.hkust.edu.hk）——本批只收了页面上有 2027/28 Fall intake + 明确轮次的 4 个：AI、AI and Entrepreneurship（CSE 新项目）、Engineering Enterprise Management、Financial Technology（工学院统一两轮 2026-12-01 / 2027-03-01）
- **商学院 6 个记存疑**：Marketing / Information Systems Management / Global Operations / International Management / Accounting / Family Office and Family Business——项目页写 "Application for 2027/28 intake opens NOW!" 但优先轮日期 "Coming Soon"（未公布），日期出来后下批补；Global Finance（与 NYU Stern 双学位）页面写 "Final Deadline October 17, 2026 ... Class of 2027"，无法确认是 2027/28 Fall intake，存疑
- **其他存疑**：Mathematical Finance（mafm.hkust.edu.hk）与 Data-Driven Modeling（物理系，msdm.hkust.edu.hk）主页未读到 2027/28 日期，需浏览器深挖招生子页
- **不收**：Electronic Engineering / Integrated Circuits / Telecommunications（EE 域）、Aeronautical / Mechanical / Intelligent Building（机械域）、Biotechnology / Drug Regulatory / Entrepreneurial Leadership in Biotechnology（生物域）、Chemistry/Physics/Environment/Ocean 系列（理学院域）、Mathematics for Educators（教育域）、Economics MSc（经济域）、Global China Studies（社科域）、Digital and Sustainable Cities（土木域）

### Batch 11-12 · 城大 + 理大（2026-10-27）
- **城大本轮跳过**：官网 www.cityu.edu.hk/pg 用 Imperva（Incapsula）反爬，curl 和内置浏览器都拦（首次空白页，重载后能过验证但旧目录链接 404）；新版目录（/en/pg/taught-postgraduate-programmes/introduction）写明 50 个项目但卡片列表 JS 渲染不出链接 → 按规则记存疑跳过，让浩翔用日常浏览器看一眼目录结构或下次再试
- **理大新增 16 个**：business 6 / finance 5 / cs 4 / data 1。库里 218 → 234（HK 62 / UK 167 / SG 5）。理大四大类：business 6 / finance 5 / cs 5 / data 2
- 理大 2027 入学统一 Main Round 截止 **2027-02-25**（本地与非本地相同，卡片原文），库记「统一截止」；卡片直接写学制与入学年，证据最规整
- **不收**：AI for the Professions（09003，官网标注 "offered subject to approval" 待批准，等批准后收）、Project Management（建造学院项目管理，按口径）、Medical Data Science / Health Informatics（医疗域）、Economics（经济域）及酒店/时装/体育/民航/设施/航运等域
- 证据：`handoff/evidence/T-006-batch-11-cityu-skip.md`（城大跳过说明并入 batch-12 文件头部注记）与 `handoff/evidence/T-006-batch-12.md`；`check:programs` / `build` / `lint` 全过

## 进度日志
（暂无）

### 2026-10-27 · ZCode（Batch 1：UCL）
- **新增 29 个**：business 7 / finance 9 / cs 9 / data 4。库里 38 → 67（UK 48 / HK 14 / SG 5）。UCL 四大类补全：business 8 / finance 9 / cs 10 / data 5（含原有 BA、CS、DS 三个）
- 方法：浏览器打开 UCL 新版 2027/28 目录，翻完 40 页拿到全量 677 条，按四大类筛候选后逐页抓「APPLICATION DEADLINES / DURATION / English language level」；语言按 UCL 五级制对照官方 IELTS 表换算（Level 1=6.5/6.0、L2=7.0/6.5、L3=7.0 且读写 6.5 听说 7.0、L4=7.5/7.0，对照表页面同日核实）
- **耗时**：整校约 1.5 小时，其中探路（新旧目录并存、列表懒加载、Cloudflare 验证）约 40 分钟；页面结构摸清后单项目 2–3 分钟
- 2026/27 → 2027/28 变化：改名 1 个（Venture Capital and Private Equity with Financial Technology → **Private Equity with Digital Finance**）、新项目 2 个（**Management: Strategy, Finance and Technology**、**Supply Chain Management with Sustainability and Analytics**，都是管理学院）、变远程 1 个（Strategic Accounting and Finance，不收）
- 港大 MSc BA（2026-12-04 第二轮）遗留复核项不在本批范围，未动
- 证据：`handoff/evidence/T-006-batch-1.md`；`check:programs` / `build` / `lint` 全过
- QS 参考：UCL 课程页自述 "QS World University Rankings 2027"；学校执行顺序仍按本任务页浩翔的优先级名单（下一所 LSE）

### 2026-10-27 · ZCode（Batch 2：LSE）
- **新增 18 个**：business 6 / finance 8 / data 4（另有 Finance FT、Data Science 已在库）。库里 67 → 85（UK 66 / HK 14 / SG 5）。**cs 类为空是 LSE 学校性质**：没有计算机/ AI 授课硕士，最接近的 MSc Management of Information Systems and Digital Innovation 归入 business
- LSE 全部项目**滚动录取**（页面原文 "Application deadline: None – rolling admissions"），按 `rolling: true` + `rounds: []` 写入；18 个英语要求都是 Standard 档（LSE 官方对照表：IELTS 7.0，各单项 6.5，官方页同日核对）
- 方法：LSE 课程搜索页筛 Graduate (Taught) 得 140 个授课型硕士（`?studyType=...&pageIndex=N`），curl 逐页核实（LSE 不拦脚本）。**耗时**：整校约 40 分钟（目录 12 页翻页 + 18 个项目页），页面结构统一后单项目 1–2 分钟，比 UCL 快很多
- **边界决定（请浩翔确认）**：收了 Applied Social Data Science（方法系，和 MSc DS 同系）、Statistics / Financial Statistics（统计系，全日制 9 个月）、Operations Research and Analytics（数学系）、Accounting and Data Analytics（会计系）、MSc Social Innovation and Entrepreneurship（管理系）；**没收**：Real Estate Economics and Finance（房地产域，建议浩翔定要不要收）、MPA in Data Science for Public Policy（公共政策）、Law and Finance、Geographic / Health Data Science、Mathematics and Computation、各 (Research) 变体（MSc Statistics (Research) 等，教 Jacobs 学位论文版本）
- 学制注意：LSE 多数项目 FT/PT 并存，只记全日制；MSc Statistics / Financial Statistics 全日制 9 个月（页面 "Nine months"），金融系几个项目 8 月有先修课
- 证据：`handoff/evidence/T-006-batch-2.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 3：Imperial）
- **新增 18 个**：business 6 / finance 4 / cs 8（data 0，原因见存疑）。库里 85 → 103（UK 84 / HK 14 / SG 5）。Imperial 四大类现状：business 7 / finance 6 / cs 9 / data 0
- 方法：课程 finder 翻 12 页（`?page=N`，239 条含本研）拿全量 99 个 PGT 链接 → 筛四大类 → curl 逐页抓轮次/学制；商学院 10 个项目逐页抓 admissions 子页（轮次表 + IELTS 句）。**耗时**：整校约 50 分钟，其中 15 分钟花在发现「finder 不含商学院全部项目」并改从商学院官网补全
- 2027/28 变化：计算机系**新增两个独立 AI 硕士**（MSc Artificial Intelligence、MSc Artificial Intelligence and Machine Learning）；MSc Statistics 从 2027 目录消失；data-science 链接实为 Biomedical Research (Data Science)
- 轮次口径：商学院项目记全部四轮（R1 2026-09-29 / R2 2027-01-06 / R3 2027-03-10 / R4 2027-04-28，23:59 UK time）；计算机/EEE 官网写明第一轮仅限商学院，从第二轮开始记
- 英语：商学院 10 个 admissions 页都写了 "IELTS (academic): A minimum score of 7.0 with minimum scores of 6.5 in all elements"；计算机/EEE 项目页不写具体分数，按惯例记「见学校统一英语要求」
- 证据：`handoff/evidence/T-006-batch-3.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 4：KCL）
- **新增 15 个**：business 4 / finance 8 / cs 3（data 0，DS 已在库、Health DS 不收）。库里 103 → 118（UK 99 / HK 14 / SG 5）。KCL 四大类：business 4 / finance 8 / cs 3 / data 1
- 方法：A-Z 列表页按字母筛选逐字母点开（175 个课程链接）→ 筛四大类 → 内置浏览器逐页抓（**KCL 课程页 JS 渲染，curl 只能拿到 meta**）：Overview 抓截止、Entry requirements 标签抓 English language band。**耗时**：整校约 70 分钟，其中列表翻页 10 分钟、页面结构摸底 15 分钟（先试 curl 失败才换浏览器）
- 截止结构：KCL 是「首轮截止 + 最终截止」不是分轮（15 页一致：首轮 2027-03-09、国际生最终 2027-07-25、Home 最终 2027-08-25，均 23:59 UK time），库里按两轮写
- 英语按院系分 Band：商学院和信息系 = Band B（IELTS 7.0/6.5），NMES（数学系）和机器人 = Band D（IELTS 6.5/6.0），Band 对照表官方页同日核对
- 证据：`handoff/evidence/T-006-batch-4.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 5：爱丁堡）
- **新增 18 个**：business 7 / finance 6 / cs 2 / data 3。库里 118 → 136（UK 117 / HK 14 / SG 5）。爱丁堡四大类：business 7 / finance 7 / cs 3 / data 4
- 方法：Degree Finder 的 **A-Z 子页一页列全部 240 个 PGT 课程**（`study.ed.ac.uk/programmes/postgraduate-taught-a-z`，搜索页每页只渲染 10 条别去翻）→ curl 逐页核实（爱丁堡课程页不拦脚本）。**耗时**：整校约 45 分钟，其中 15 分钟在找对列表入口（搜索页懒加载坑）
- 轮次：商学院 11 个五轮（2026-10-14 起，申请费 £60）；数学系 6 个三轮（15 December / 31 March / 31 May，页面只写月日但注明适用 2027/28 入学，年份据此定，沿用 T-003 爱丁堡 DS 先例）；信息学院 2 个两轮（31 March / 31 May）
- 学制注意：多个数学系项目 award 选择器有 1 年全日制 + 2 年非全日制两档，默认展示可能选中非全日制（meta 显示 2 years），只记 1 年全日制
- 英语三档都来自项目页原文：商学院 7.0/6.0、数学系 6.5/6.0、信息学院 7.0（三项 ≥6.5 一项 ≥6.0）
- 证据：`handoff/evidence/T-006-batch-5.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 6：曼彻斯特）
- **新增 21 个**：business 10 / finance 4 / cs 4 / data 3。库里 136 → 157（UK 138 / HK 14 / SG 5）。曼大四大类：business 12 / finance 6 / cs 5 / data 3
- 方法：大学课程 finder 页（浏览器渲染出 315 个课程卡，标题在 `.degree` 标签、链接是卡片祖先 `<a>`）→ 按 slug 筛四大类 → curl 逐页核实（曼大课程页不拦脚本）。**耗时**：整校约 55 分钟，其中 20 分钟耗在 finder 的懒加载/卡片结构摸底
- 轮次：AMBS 13 个统一五轮（2026-12-06 起，how-to-apply 页 2026-10-27 重核，开放日 2026-10-10，申请费 £60）；CS 系 4 个四轮（2026-11-06 起）；Mathematical Finance 四轮（2026-11-06 起，S3 结果日 04-16 与 CS 系不同）；DS&AI 三个路径四轮（2026-12-06 起）
- 2026 新项目进了 2027 目录：AMBS Digital Transformation、Sustainable Business；CS 系 AI / ML / Cyber Security / Software Engineering；DS&AI 大家族（5 路径收 3）
- 证据：`handoff/evidence/T-006-batch-6.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 7：华威）
- **新增 29 个**：business 12 / finance 6 / cs 7 / data 4。库里 157 → 186（UK 167 / HK 14 / SG 5）。华威四大类：business 14 / finance 8 / cs 7 / data 4
- 方法：公开课程搜索页（271 个结果，每次显示 10 条，循环点 show more 收 155 个授课型）→ 筛四大类 → curl 逐页核实（华威课程页不拦脚本）。**耗时**：整校约 40 分钟（列表 show-more 循环 8 分钟，逐页核实很快，页面结构统一）
- 轮次：华威全校统一 on-time deadline **2027-08-02**（"starting in September/October 2027"），无分轮，库里记「统一截止」（与原有两条华威条目口径一致）；2027-09-27 开学
- 英语按院系两档（页面原文）：WBS = IELTS 7.0（两项 6.0/6.5 其余 ≥7.0），WMG/计算机系/统计系 = 6.5（单项 ≥6.0）
- 改名 1 个：Business with Finance → Finance & Management；Global Central Banking（part-time online）不收
- 证据：`handoff/evidence/T-006-batch-7.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 8：港大）
- **新增 14 个**：business 4 / finance 6 / cs 3 / data 1。库里 186 → **200**（HK 28 / UK 167 / SG 5）。港大四大类：business 5 / finance 8 / cs 5 / data 2
- 方法：portal 项目列表页数字分页 17 页逐页点击收集 170 个项目 → 筛四大类 → 内置浏览器逐页抓详情（portal 是 JS 渲染，curl 拿不到正文；详情页的轮次日期在标签行的下一行，要带上下文抓）。**耗时**：整校约 75 分钟，其中 25 分钟耗在列表分页/懒加载和详情页结构摸底
- 轮次：商学院 9 个三轮（提前轮 2026-07-24 / 第一轮 2026-09-28 / 第二轮 2026-12-04，香港时间中午 12:00，前两轮已过）；计算与数据科学学院、创新学院为主轮+补录轮两轮制（主轮 2026-11-16 ~ 2027-01-15 不等，补录 2027-02-01 / 2027-04-30）
- 学制：商学院 9 个页面写 2 年（全日制），创新学院/计算机系 1 年，MSc(AI) 1.5 年
- 语言：全部为港大统一最低线 IELTS 6.0（单项 ≥5.5）/ TOEFL 80（页面原文核实）
- 证据：`handoff/evidence/T-006-batch-8.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 9：港中文）
- **新增 14 个**：business 4 / finance 4 / cs 3 / data 3。库里 200 → 214（HK 42 / UK 167 / SG 5）。港中文四大类：business 5 / finance 6 / cs 5 / data 3
- 方法：研究院 gs.cuhk.edu.hk 按学院列表页（curl 可读，项目名在 HTML 文本里）→ 筛四大类 → curl 逐页核实研究院项目页。**耗时**：整校约 35 分钟（港中文页面结构最规整，抓取最快）
- 轮次：商学院 6 个统一截止 2027-03-31（提前轮 2026-07-31 已过期，滚动审理）；工程学院 FinTech/AI 三轮（2026-10-02 / 11-06 / 12-31）；统计系 3 个两轮（优先 2026-12-31 / 最终 2027-02-28）；Robotics 03-31、ECLT 03-16、GWM 03-31
- 学制：AI 页写全日制 1.5 年（页面原文）；其余全日制 1 年；ITM 只招 Part-time 不收
- 证据：`handoff/evidence/T-006-batch-9.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 10：港科大）
- **新增 4 个**：business 1 / finance 1 / cs 2。库里 214 → 218（HK 46 / UK 167 / SG 5）。港科大四大类：business 2 / finance 2 / cs 4 / data 2（不算存疑项）
- 港科大 2027/28 目录（prog-crs）未上线，商学院轮次日期未公布 → 本批只收工学院页有完整 2027/28 信息的 4 个，其余 9 个记存疑（见上节）
- 方法：prog-crs 目录（浏览器渲染，40 个 MSc）筛四大类 → 各系网项目页逐页核实（seng.hkust.edu.hk 和各项目专属站点）。**耗时**：整校约 50 分钟，一半时间耗在「目录未上线、商学院日期未公布」的确认上
- 证据：`handoff/evidence/T-006-batch-10.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（Batch 11-12：城大跳过 + 理大）
- **城大跳过**（反爬+JS 列表抓不到，存疑见上节）；**理大新增 16 个**（business 6 / finance 5 / cs 4 / data 1），库 218 → 234（HK 62 / UK 167 / SG 5）
- 理大方法：/study/pg 导航进 "Programme by A-Z"（/study/pg/taught-postgraduate/programme-z-tpg），卡片自带 2027 入学、学制、截止原文 → 滚动收集 128 条 → 筛四大类。**耗时**：城大 25 分钟（卡在反爬，按 30 分钟规则跳过）+ 理大 25 分钟
- 理大统一 Main Round 截止 2027-02-25（本地=非本地）；学制卡片原文直接可引；语言在折叠区读不到 → 「见学校统一英语要求」
- AI for the Professions（09003）官网标 "offered subject to approval" 待批准 → 存疑，批准后收录
- 证据：`handoff/evidence/T-006-batch-12.md`；`check:programs` / `build` / `lint` 全过

### 2026-10-27 · ZCode（新加坡两所网络不通，记存疑）
- **NUS、NTU 本轮无法核实**：当前网络环境访问 `*.nus.edu.sg`、`*.ntu.edu.sg` 全部连接失败（curl code=000 超时；内置浏览器同样空白页）。2026-10-24 T-008 曾加过 5 个新加坡项目，当时网络可达；现状态恢复后（换网络/代理）再补 NUS、NTU 其余四大类项目
- 第一优先 14 所至此全部处理完毕：UK 7 所 + HK 港大/港中文/港科大/理大（城大存疑）+ SG 两所（网络不通存疑）。库 38 → 234（UK 167 / HK 62 / SG 5）
- 下一步转入第二优先名单（英国其他热门学校）：布里斯托 → 格拉斯哥 → 杜伦 → 巴斯 → …

### Batch 13 · 布里斯托（2026-10-27）
- **新增 26 个**：business 13 / finance 7 / cs 4 / data 2。库里 234 → **260**（UK 193 / HK 62 / SG 5）。**新学校，SCHOOL_ALIASES 已加 University of Bristol（Bristol/布里斯托/布大）**
- 布里斯托口径统一（26 页一致）：September 2027 开学，海外生截止 2027-08-12 / 本土生 2027-09-09（库里记「国际生截止」），全日制 1 年；英语按 profile 分档、页面正文无具体分数 → 记「见学校统一英语要求」
- 方法：课程搜索页（Vue 应用，要浏览器等 ~25 秒才渲染，curl 拿不到）滚动收集 153 个 taught 项目 → 筛四大类 → curl 逐页核实（课程详情页不拦脚本）。**耗时**：整校约 40 分钟
- **边界决定（请浩翔确认）**：收了 Management 8 个方向（含 Project Management——管理学院开设，与「工程/建造学院 PM 不收」口径不冲突）、三个创新创业变体（Business/普通/Social）；MSc Economics 系列全部不收（经济学院）；AI Governance and Ethics / AI for Medicine and Health / Engineering with AI（域外）；MA Digital Business Innovation 等四个 MA（设计创意域）；Environmental Data Science（环境域）；Medical Statistics and Health Data Science（医疗域）；Mathematical Sciences（纯数学）
- 布里斯托无独立 MSc Finance（金融类是 Accounting and Finance / Finance and Investment / Global Banking and Finance 等）；无独立 Statistics MSc
- 证据：`handoff/evidence/T-006-batch-13.md`；`check:programs` / `build` / `lint` 全过

### Batch 14 · 格拉斯哥（2026-10-27）
- **新增 19 个**：business 7 / finance 6 / cs 3 / data 3。库里 260 → 279（UK 212 / HK 62 / SG 5）。**新学校，SCHOOL_ALIASES 已加 University of Glasgow（Glasgow/格拉斯哥/格大）**
- 格拉斯哥全校统一六轮（19 页一致，轮内滚动审理）：R1 2026-11-05 → R6 2027-07-08（国际生），UK 本土截止 2027-08-24；库记六轮
- **不收**：Media Management / Public Policy & Management（传媒/政策域）、Geomatics & Management / Archives Records & Information Management（测绘/档案域）、Economics 系列（经济域，含 Economics International Banking & Finance、Data Analytics for Economics & Finance）、Data Analytics Online（在线）、Advanced Mathematics / Advanced Applied Mathematics / Mathematical Sciences（纯数学）、Data Science for Ecology & Epidemiology（生态域）、各类工程 & Management（工程域）
- 证据：`handoff/evidence/T-006-batch-14.md`；`check:programs` / `build` / `lint` 全过

### Batch 15 · 杜伦（2026-10-27）
- **新增 18 个**：business 5 / finance 8 / cs 5（data 0）。库里 279 → 297（UK 230 / HK 62 / SG 5）。**新学校，SCHOOL_ALIASES 已加 Durham University（Durham/杜伦/杜大）**
- 杜伦 18 页**均无固定申请截止**（商学院页写 2026-10-01 开放 + 建议尽早递交；计算机系页无 deadline 区块）→ 全部记 rolling: true
- 杜伦计算机系 2026 年大改版，新开一批 AI 项目（Applied AI and Data Science / AI Infrastructure Platforms / AI for Robotics & Computer Vision / AI 等），全部收录
- **不收**：Applied AI & DS in Bioinformatics / Digital Humanities、AI for Engineering、AI and Environmental DS（应用域）、Computational Astrophysics（天文域）、Computational Environmental & GIS（环境域）、Health Data Science（医疗域）、Social & Behavioural DS（社会域）、Data Science in Cultural Heritage（遗产域）、MSc Law and Finance（法学域）、Economics 组三个（经济域）、Mathematical Sciences 类（若有无，纯数学）
- 证据：`handoff/evidence/T-006-batch-15.md`；`check:programs` / `build` / `lint` 全过

### Batch 16 · 利兹（2026-10-27）
- **新增 22 个**：business 9 / finance 5 / cs 6 / data 2。库里 297 → **319**（UK 252 / HK 62 / SG 5）。**新学校，SCHOOL_ALIASES 已加 University of Leeds（Leeds/利兹/利兹大学）**
- 利兹口径（22 页一致）：September 2027 开学，IELTS 6.5（单项 ≥6.0）；**绝大多数项目页不列固定申请截止 → 记 rolling: true**；CS 系 4 个 ACS 项目写最终期限 30 July 2027；Data Science MSc 明确国际生截止 2027-07-30
- 方法：课程搜索页是 Funnelback 异步加载（浏览器渲染），分页为 URL 参数（?page=N&type=PGT&term=202728），逐页收集 262 个课程 → 筛四大类 → curl 逐页核实（课程详情页 curl 可读）。**耗时**：整校约 60 分钟（列表方案试错 20 分钟）
- **不收**：AI online / Data Science Statistics online / Genomic Medicine online（在线）、Engineering Project Management / Engineering Technology and Business Management（工程域）、Economics / Ecological Economics / Economics and Finance（经济域）、Advertising and Marketing MA / Corporate Communications MAR（传播域）、Global Fashion Management（时装域）、Arts Management and Heritage Studies（艺术域）、Digital Chemistry（化学域）、Environmental DS with ML（环境域）、Health Informatics with DS ×2 / Genomic Medicine（医疗域）、Biotechnology with Business Enterprise（生物域）
- 证据：`handoff/evidence/T-006-batch-16.md`；`check:programs` / `build` / `lint` 全过
