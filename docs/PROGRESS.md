# 申途 · 开发进度

最后更新：2026-10-23

## 线上地址
- 前端：https://shentu-demo.vercel.app （Vercel，`frontend/`）
- 后端：https://shentu-api.onrender.com （Render，`backend/`，接口文档 `/docs`）

## 模块状态

| 模块 | 状态 | 说明 |
|---|---|---|
| 首页五段式流程 | ✅ 完成 | 参考 Offer多多 |
| 项目库 | ✅ 完成 | 8 个英港项目，2027 入学截止日期 2026-10-20 对照官网核实 |
| 我的申请看板 / 详情 | ✅ 完成 | 材料清单、英港 7 节点、留位费/补交截止倒计时；**数据仍存浏览器本地** |
| 邮箱验证码登录 | ⏸ 暂缓（演示模式） | 见下 |
| 申请数据同步到账号 | ⬜ 未开始 | |
| 截止日期提醒 | ⬜ 未开始 | 依赖真实发信 |
| 微信 / QQ / 手机号登录 | ⬜ 未开始 | 需要 ICP 备案，见下 |

## 登录模块：暂缓原因与恢复步骤

**现状**：后端登录接口、限流、测试都已完成并上线；线上开启 `AUTH_DEMO_MODE=true`，不发邮件，接口直接把验证码返回给前端并自动填入。

**为什么暂缓**：Resend 未验证自有域名前，只能用测试发件地址 `onboarding@resend.dev`，且只能发给 Resend 账号本人邮箱（Resend 403：*The resend.dev domain is for testing and can only send to your own email address*）。

**⚠️ 演示模式的风险**：任何人填任意邮箱都能登录。只能在账号下没有真实用户数据时使用；做「申请数据同步」之前必须关掉。

**恢复步骤**：
1. 买域名
2. Resend → Domains 添加域名，按提示配置 DNS
3. Render 环境变量：`MAIL_FROM=申途 <noreply@你的域名>`，`AUTH_DEMO_MODE=false`
4. 实测 QQ、163、Gmail 收件箱 / 垃圾箱

## 国产登录调研结论（2026-10-21，官方文档核实）
- 微信扫码、短信验证码都需要 **ICP 备案**；ICP 备案只针对中国内地服务器，海外服务器（Vercel、Render）办不了
- 微信网站应用：审核要求官网有备案信息 + 提交含 ICP 备案号的《网站信息登记表》；个人主体可申请
- 短信签名：需企事业单位名 / 注册商标 / 已备案网站，不支持个人签名；运营商报备 5–10 个工作日
- 竞品：知乎 = 微信扫码 / 验证码 / 邮箱 / 密码；小红书 = 微信扫码 / 手机号验证码
- 后端已按 `users` + `auth_identities` 设计，新增登录方式只加 provider

## 已知限制
- Render 免费实例 15 分钟无访问休眠，唤醒约 1 分钟
- **Render 免费 Postgres 创建 30 天后过期**，有真实用户数据前必须升级
- 线上后端 CORS 只放行 `shentu-demo.vercel.app`；本地开发用本机 FastAPI（`.claude/launch.json` 里的 `shentu-api`）
