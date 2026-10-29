# T-015 加入美国地区（框架，暂不收项目）

- **负责人**：浩翔
- **状态**：👀 待审核（PR 已开）
- **分支**：`t-014-us-region`
- **布置人 / 日期**：浩翔 / 2026-10-29

## 背景
用户要加美国。这一步只搭地区框架，**项目先不找**；项目库收录范围、学校名单另行讨论（不要直接交给 ZCode 开抓）。

## 做了什么
- [x] `Region` 加 `US`；`npm run check:programs` 接受 `region: "US"`
- [x] 首页第 4 张地区卡片（曼哈顿下城夜景，Wikimedia Commons CC0，原图右下角作者水印已裁去，出处在 `public/regions/CREDITS.md`）；卡片显示「项目收录中」
- [x] `/us` 地区页：注意事项、五段流程、7 个看板节点（最后一步「I-20 / 签证」）。没有项目时隐藏「浏览 N 个项目」，主按钮改为「手动添加项目」
- [x] 美国默认材料清单：简历、个人陈述 / 目的陈述 SOP、推荐信 ×3、成绩单、在读 / 学位证明、语言成绩、资金证明、网申表 + 申请费（GRE / GMAT、写作样本按项目放 `extraMaterials`）
- [x] 项目库按美国筛选、看板美国标签、手动添加美国项目都能用；`/us/apply` 显示「美国模拟网申即将上线」（`SIM_PROGRAM_ID` 改为可选）

## 依据（官网原文，2026-10-29）
- 美国国务院 travel.state.gov 学生签证页："The SEVP-approved school will issue you a Form I-20. After you receive the Form I-20 and register in SEVIS, you may apply at a U.S. Embassy or Consulate"；"Student (F and M) visas for new students can be issued up to 365 days before the start date … you will not be allowed to enter the United States on your student visa more than 30 days before the start date."
- 国土安全部 studyinthestates.dhs.gov："Before you pay the I-901 … SEVIS Fee, you must receive the Form I-20"；ICE 收费表 F/M 学生 I-901 费 $350（文案里没写金额）
- 「推荐信多为 3 封」「多轮截止」「接受录取常要交押金」是美国硕士普遍情况，文案都写了「多为 / 很多项目」，具体以项目官网为准

## 下一步（待定）
- 美国项目库：学校范围（建议同样按 QS 2027 前 100）、四大类、核实规则（美国常见：分轮截止、GRE 要求、申请费减免、I-20 资金证明金额）
- 美国模拟网申的代表项目与演示视频
