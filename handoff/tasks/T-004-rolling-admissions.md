# T-004 卡片支持「滚动录取 / 无固定截止」

- **负责人**：友涵
- **状态**：⬜ 待开始
- **分支**：建议直接在 T-003 的 `program-library` 分支上做（数据和展示一起改）
- **布置人 / 日期**：浩翔 / 2026-10-23

## 背景
LSE 的 MSc Finance、MSc Data Science 官网写的是「没有固定截止日期，滚动录取，招满即止」。现在的数据结构要求每个项目至少有一轮截止日期，放不进去。

## 要做什么
- [ ] `ProgramRecord` 加一个可选字段，如 `rolling: true`，表示滚动录取
- [ ] 允许 `rounds` 为空，但前提是 `rolling: true`；同步改 `scripts/check-programs.mjs` 的校验
- [ ] 项目卡片：没有轮次时显示「滚动录取 · 招满即止，建议尽早申请」，不显示空的轮次选择
- [ ] 有轮次但官网也写了滚动审理的（如港中文金融、港科大 BDT），卡片上加一个「滚动审理」小标签
- [ ] 看板 / 详情页：没有截止日期的项目，「下一个截止」显示「滚动录取」，排序放在有截止日期的后面
- [ ] `lib/deadline.ts` 的 `nextDeadline` 处理空 `rounds`，不能报错

## 完成标准
- [ ] 把 LSE 两个项目加进 `programs.json`，`npm run check:programs` 通过
- [ ] 浏览器里：项目库能看到 LSE 卡片并能添加；看板上显示「滚动录取」；详情页正常打开
- [ ] `npm run build`、`npm run lint` 通过

## 参考资料
- LSE 已核实数据：见 [T-003](T-003-program-library.md) 的「已核实」部分
- 相关文件：`frontend/src/lib/types.ts`、`lib/deadline.ts`、`app/programs/ProgramList.tsx`、`components/DeadlinePill.tsx`、`scripts/check-programs.mjs`

## 进度日志
（暂无）
