# T-015 待核实项目（52 个，不在网站上）

这些项目**不在** `frontend/data/programs.json` 里，网站不显示。数据在 `pending-programs.json`，每条带 `_pending.reasons`（为什么不能 100% 确定）和 `_pending.source`（来自哪个分支 / PR）。

**补到官网原文后怎么移回**：把该项目的对象复制进 `frontend/data/programs.json`，删掉 `_pending`，`verified` 改成 `true`，`updatedAt` 写核实日期，在 PR 里贴上官网原文。

| id | 学校 | 项目 | 原因 | 来源 |
|---|---|---|---|---|
| man-msc-acf | 曼彻斯特大学 | 会计与金融硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| nus-msc-ba | 新加坡国立大学 | 商业分析硕士 | 标了 rolling，但页面未读到 rolling / 招满即止原文；官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| nus-msc-fin | 新加坡国立大学 | 金融学硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| man-msc-baai | 曼彻斯特大学 | 商业分析与人工智能硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| ic-msc-esb | 帝国理工学院 | 经济与商业战略硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| ic-msc-mim | 帝国理工学院 | 管理硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| hkust-msc-aie | 香港科技大学 | 人工智能与创业硕士 | 官网未读到明确的全日制原文（只在导航菜单出现不算） | main |
| dur-msc-mgmt-consulting | 杜伦大学 | 管理学硕士（咨询） | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-mgmt-entre | 杜伦大学 | 管理学硕士（创业） | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-hrm | 杜伦大学 | 人力资源管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-sclm | 杜伦大学 | 供应链与物流管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-mgmt-fin | 杜伦大学 | 管理与金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-if | 杜伦大学 | 伊斯兰金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-acs | 杜伦大学 | 高级计算机科学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-aaids | 杜伦大学 | 应用人工智能与数据科学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-aiip | 杜伦大学 | 人工智能基础设施平台硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-aircv | 杜伦大学 | 机器人与计算机视觉人工智能硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| dur-msc-ai | 杜伦大学 | 人工智能硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-mgmt | 利兹大学 | 管理学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-ib | 利兹大学 | 国际商务硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-imm | 利兹大学 | 国际营销管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-hrm | 利兹大学 | 人力资源管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-gscm | 利兹大学 | 全球供应链管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-gsim | 利兹大学 | 全球战略与创新管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-bads | 利兹大学 | 商业分析与决策科学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-dhrm | 利兹大学 | 数字化人力资源管理与数据分析硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-cams | 利兹大学 | 消费者分析与营销战略硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-af | 利兹大学 | 会计与金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-bf | 利兹大学 | 银行与金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-fi | 利兹大学 | 金融与投资硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-frm | 利兹大学 | 金融风险管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-qf | 利兹大学 | 定量金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-cs | 利兹大学 | 计算机科学硕士（转专业） | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| leeds-msc-cs-ai | 利兹大学 | 计算机科学硕士（人工智能方向） | 无截止日，但页面未读到 rolling / 招满即止原文 | main |
| nott-msc-bm | 诺丁汉大学 | 商务与管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-dm | 诺丁汉大学 | 数字营销硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-eim | 诺丁汉大学 | 创业、创新与管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-hrmo | 诺丁汉大学 | 人力资源管理与组织硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-imis | 诺丁汉大学 | 工业管理与信息系统硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-ib | 诺丁汉大学 | 国际商务硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-mgmt | 诺丁汉大学 | 管理学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-mkt | 诺丁汉大学 | 市场营销硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-scom | 诺丁汉大学 | 供应链与运营管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-af | 诺丁汉大学 | 会计与金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-bf | 诺丁汉大学 | 银行与金融硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-fi | 诺丁汉大学 | 金融与投资硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-rm | 诺丁汉大学 | 风险管理硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-acs | 诺丁汉大学 | 高级计算机科学（或人工智能方向）硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-cps | 诺丁汉大学 | 信息物理系统硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-cybersec | 诺丁汉大学 | 网络安全硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-ds | 诺丁汉大学 | 数据科学硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
| nott-msc-daai | 诺丁汉大学 | 数据分析与人工智能硕士 | 无截止日，但页面未读到 rolling / 招满即止原文；诺丁汉：统一申请页写 2027/28 截止 To be confirmed，官方未公布 | t-006-batch-24 |
