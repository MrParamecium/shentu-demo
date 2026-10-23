# 项目背景速览

## 申途是什么
帮陆本学生 DIY / 半 DIY 申请**英国、香港授课型硕士**（之后加新加坡）的进度管家：添加项目 → 自动带出分轮截止日期和材料清单 → 跟踪网申、有条件录取、留位费、补交条件、CAS 等节点。核心卖点是**准确、可核对官网来源**（关键词「放心」）。

## 线上地址
- 前端：https://shentu-demo.vercel.app （Vercel）
- 后端：https://shentu-api.onrender.com （Render，接口文档 `/docs`）
- 仓库：https://github.com/MrParamecium/shentu-demo （私有）

## 目录结构
```
frontend/   Next.js 16 + Tailwind 4，部署在 Vercel
  data/programs.json   项目库数据（T-003 之后）
  scripts/             数据校验脚本
backend/    FastAPI + SQLAlchemy + Alembic，部署在 Render
render.yaml Render 部署配置
docs/       进度文档（旧，逐步迁到 handoff/）
handoff/    交接书架（你现在在这里）
```

## 本地怎么跑
**前端**
```bash
cd frontend
npm install
npm run dev -- -p 3123     # http://localhost:3123
```
本地前端默认连本机后端 `http://localhost:8000`（见 `frontend/.env.development`）。线上后端只允许 Vercel 域名访问，本地前端连不上线上后端。

**后端**
```bash
cd backend
uv venv --python 3.13 .venv
uv pip install -r requirements-dev.txt
.venv/bin/alembic upgrade head
AUTH_DEMO_MODE=true .venv/bin/uvicorn app.main:app --reload --port 8000
.venv/bin/pytest -q          # 跑测试
```
不设 `RESEND_API_KEY` 时验证码打印在后端日志里。

## 账号和权限
- GitHub、Vercel、Render、Resend 都在浩翔账号下
- 需要线上环境变量、部署权限时找浩翔；**密钥不要发在聊天里，也不要写进仓库**

## Render 免费版限制
- 15 分钟没人访问会休眠，再访问要等约 1 分钟
- 免费 Postgres 创建 30 天后过期，有真实用户数据前必须升级
