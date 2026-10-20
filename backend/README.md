# 申途后端（FastAPI）

## 本地开发

```bash
cd backend
uv venv --python 3.13 .venv
uv pip install -r requirements-dev.txt
.venv/bin/alembic upgrade head          # 默认用 SQLite：backend/dev.db
.venv/bin/uvicorn app.main:app --reload --port 8000
```

- 接口文档：http://localhost:8000/docs
- 不设置 `RESEND_API_KEY` 时，验证码不会真的发邮件，而是打印在服务日志里
- 配置项见 `app/config.py`，本地可写进 `backend/.env`（已被 git 忽略）

## 测试

```bash
.venv/bin/pytest -q                                                     # SQLite
TEST_DATABASE_URL=postgresql://user@localhost:5432/test .venv/bin/pytest -q   # Postgres（与生产一致）
```

## 改数据库表

改完 `app/models.py` 后生成迁移，检查生成的文件再提交：

```bash
.venv/bin/alembic revision --autogenerate -m "说明"
.venv/bin/alembic upgrade head
```

## 登录接口

| 接口 | 说明 |
|---|---|
| `POST /auth/email/request-code` | 发送 6 位邮箱验证码；同一邮箱 60 秒内只能发一次，每天最多 10 次 |
| `POST /auth/email/verify` | 校验验证码，返回 `access_token`；邮箱首次登录自动注册 |
| `GET /auth/me` | 带 `Authorization: Bearer <token>` 获取当前用户 |

验证码 10 分钟有效，错 5 次作废，数据库只存 HMAC 哈希。

用户和登录方式分两张表（`users` / `auth_identities`），以后接微信、QQ、手机号只需新增 `provider`，不改用户表。

## 部署（Render）

仓库根目录的 `render.yaml` 定义了 API 服务和 Postgres。Render 控制台 → New → Blueprint → 选本仓库，创建时填入 `RESEND_API_KEY`。
