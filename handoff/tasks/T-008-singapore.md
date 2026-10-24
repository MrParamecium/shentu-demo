# T-008 加入新加坡（新国立、南洋理工）

- **负责人**：浩翔
- **状态**：✅ 完成（已上线）
- **分支**：`t-008-singapore`（基于 `t-004-rolling-admissions`）
- **布置人 / 日期**：浩翔 / 2026-10-24

## 背景
产品定位是「英港新」，之前只有英国和香港。这是 [T-006](T-006-library-step2.md) 第二步里「加新加坡」的部分，提前做。

## 已完成
- [x] 数据结构支持 `region: "SG"`：类型、校验脚本、地区筛选（全部 / 英国 / 香港 / 新加坡）、首页入口
- [x] 地区显示集中到 `frontend/src/lib/regions.ts`（国旗、名称、押金叫法），以后加地区只改这一处
- [x] 新加坡申请节点：最后一步是「学生准证」，依据移民与关卡局官网（见下）
- [x] 全站文案「英港」改为「英港新」；项目库页的项目数改为自动统计
- [x] 新增 5 个新加坡项目（2026-10-24 对照官网核实）

## 新加坡学生准证（ICA 官网，2026-10-24 核实）
- 来源：https://www.ica.gov.sg/reside/STP/apply/ihl 、https://www.ica.gov.sg/reside/STP/collect
- 开课前**至少 2 个月、最多 3 个月**网上申请；不用在新加坡
- 获批后发 **IPA 信**（原则上批准信），需要签证的话已包含在 IPA 里；凭 IPA 入境，预约去 ICA 服务中心办手续领准证
- 手续费 S$45，不退

## 新增项目
| id | 截止 | 滚动 | 官网 |
|---|---|---|---|
| nus-msc-ba | 统一截止 2027-01-31 | ✅ | https://msba.nus.edu.sg/msba-programme/ |
| nus-mcomp-cs | 统一截止 2027-01-31 | — | https://www.comp.nus.edu.sg/programmes/pg/mcs/application/ |
| nus-msc-fin | 第一轮 2026-11-15 · 第二轮 2027-02-15 | — | https://mscfin.nus.edu.sg/admissions/application-process/ |
| ntu-msc-ba | 2026-11-30 · 2027-01-31 · 2027-03-31 | ✅ | https://www.ntu.edu.sg/business/admissions/graduate-studies/msc-business-analytics/admissions |
| ntu-msc-fin | 2026-11-30 · 2027-01-31 · 2027-03-31 | ✅ | https://www.ntu.edu.sg/business/admissions/graduate-studies/msc-finance/admissions |

## 查不到 / 存疑
- **南洋理工 MSc Artificial Intelligence（MSAI）没加**：项目页只有 AY2027/28 学费，没写截止日期；全校申请指南的表格里计算与数据科学学院那几行分组看不清，没法确定哪个日期对应 MSAI。等官网写清楚再加
- **NUS 金融硕士的 TOEFL**：页面写「iBT ≥5.0」，疑为新版 1–6 分制，数据里已注明「见官网」
- **南洋理工金融硕士开学月份**：同一页截止部分写 7 月、学费表写 8 月，数据里已注明
- **NUS、南洋商学院的网站会拦截脚本抓取**，核实要用浏览器打开

## 进度日志

### 2026-10-24 · 浩翔
- 完成上面所有内容；浏览器走查：首页新加坡入口 → 筛选出 5 个项目（3 个带滚动审理标签）→ 添加 NUS 金融 → 看板倒计时正常 → 详情页节点为「…已交押金 → 已满足条件 → 学生准证」，押金日期框文案为「押金截止日期」
- 两个南洋项目的截止日期、NUS 计算机的截止日期我自己又对了一遍官网原文
