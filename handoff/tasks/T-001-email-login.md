# T-001 邮箱验证码登录

- **负责人**：浩翔
- **状态**：⏸ 暂缓（线上演示模式）
- **分支**：已合并（PR #1 后端、#2 前端登录页、#3 演示模式）
- **布置人 / 日期**：浩翔 / 2026-10-20

## 背景
登录是数据同步、截止提醒的前提。

## 已完成
- [x] 后端：`POST /auth/email/request-code`、`POST /auth/email/verify`、`GET /auth/me`
- [x] 限流：同一邮箱 60 秒一次、每天 10 次；验证码 10 分钟有效、错 5 次作废、只能用一次
- [x] 数据库只存验证码 HMAC 哈希；`users` + `auth_identities` 分表，方便以后加微信 / QQ / 手机号
- [x] 前端 `/login` 两步表单、顶栏登录 / 退出、服务唤醒提示
- [x] 演示模式 `AUTH_DEMO_MODE`：不发邮件，验证码直接返回并自动填入
- [x] 14 个后端测试（SQLite + Postgres）

## 为什么暂缓
Resend 未验证自有域名前，只能从 `onboarding@resend.dev` 发给 Resend 账号本人（chenghaoxiang66@gmail.com），发给 QQ 等邮箱会被拒（403）。

## 恢复条件
完成 [T-002](T-002-buy-domain.md) 后：Render 上设 `MAIL_FROM=申途 <noreply@域名>`、`AUTH_DEMO_MODE=false`，实测 QQ / 163 / Gmail。

## 进度日志

### 2026-10-23 · 浩翔
- 线上开启演示模式；顺手修了「发信失败也计入冷却和每日次数」的 bug
