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
