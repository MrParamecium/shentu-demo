# T-006 Batch 24：诺丁汉新增 18 个项目证据

- 核实日期：2026-10-28
- 核实方式：逐字母抓官网课程目录（`nottingham.ac.uk/pgstudy/courses/courses.aspx?letter=X&year=2027`，138 个 taught 课程）→ 筛四大类 → curl 逐个打开项目详情页核实（页面为服务端渲染，curl 可读）
- 18 页逐页核实，关键字段原文（每页单独抓取）："Full-time: 12 months · Part-time: Not available · Start date: September 2027" + 各页 IELTS 行
- **18 页均无固定申请截止日期区块**（页面无 deadline 字段）→ 按库里现行约定记 `rolling: true` + rounds: []，notes 只写「未列固定申请截止日期」，未断言滚动审理
- 语言三档（页面原文）：Business/Finance 类 "IELTS 6.5 (no less than 6.0 in each element)"；CS 类 "6.5 with at least 6.0 in each element" 或 "6.5 (no less than 6.0 in any element)"；Data Analytics and AI 为 "IELTS 6.0 with no less than 5.5 in each area"
- **排除**：Human Computer Interaction MSc（页面仍显示 September 2026，2027 页未更新）；Financial Economics MSc（社科学院经济系开设，按经济域规则不收）；MBA；Business Consulting and Analytics (online)（在线）；两个 2 年全日制变体（CS 与 CPS，含行业年，未单独收录）；Economics and Data Science（经济域）

- nott-msc-bm | https://www.nottingham.ac.uk/pgstudy/course/taught/business-and-management-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-dm | https://www.nottingham.ac.uk/pgstudy/course/taught/digital-marketing-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-eim | https://www.nottingham.ac.uk/pgstudy/course/taught/entrepreneurship-innovation-and-management-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-hrmo | https://www.nottingham.ac.uk/pgstudy/course/taught/human-resource-management-and-organisation-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-imis | https://www.nottingham.ac.uk/pgstudy/course/taught/industrial-management-and-information-systems | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-ib | https://www.nottingham.ac.uk/pgstudy/course/taught/international-business-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-mgmt | https://www.nottingham.ac.uk/pgstudy/course/taught/management-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-mkt | https://www.nottingham.ac.uk/pgstudy/course/taught/marketing-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-scom | https://www.nottingham.ac.uk/pgstudy/course/taught/supply-chain-and-operations-management-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-af | https://www.nottingham.ac.uk/pgstudy/course/taught/accounting-and-finance-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-bf | https://www.nottingham.ac.uk/pgstudy/course/taught/banking-and-finance-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-fi | https://www.nottingham.ac.uk/pgstudy/course/taught/finance-and-investment-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-rm | https://www.nottingham.ac.uk/pgstudy/course/taught/risk-management-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in each element)"
- nott-msc-acs | https://www.nottingham.ac.uk/pgstudy/course/taught/computer-science-artificial-intelligence | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 with at least 6.0 in each element"
- nott-msc-cps | https://www.nottingham.ac.uk/pgstudy/course/taught/cyberphysical-systems-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 with at least 6.0 in each element"
- nott-msc-cybersec | https://www.nottingham.ac.uk/pgstudy/course/taught/cybersecurity | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 (no less than 6.0 in any element)"
- nott-msc-ds | https://www.nottingham.ac.uk/pgstudy/course/taught/data-science-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.5 with at least 6.0 in each element"
- nott-msc-daai | https://www.nottingham.ac.uk/pgstudy/course/taught/data-analytics-and-ai-msc | 2026-10-28 | "Full-time: 12 months · Part-time: Not available · Start date: September 2027" · "IELTS 6.0 with no less than 5.5 in each area"
