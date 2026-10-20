import os
import tempfile

# 测试用独立数据库，必须在导入 app 之前设置。
# 默认临时 SQLite；设置 TEST_DATABASE_URL 可改用 Postgres（与生产一致）
_db_file = os.path.join(tempfile.mkdtemp(), "test.db")
os.environ["DATABASE_URL"] = os.environ.get("TEST_DATABASE_URL", f"sqlite:///{_db_file}")
os.environ["RESEND_API_KEY"] = ""
os.environ["JWT_SECRET"] = "test-secret-at-least-32-bytes-long-xx"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import mailer  # noqa: E402
from app.db import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture
def sent_codes(monkeypatch):
    """拦截发信，记录每个邮箱收到的验证码"""
    box: dict[str, list[str]] = {}

    def fake_send(email: str, code: str) -> None:
        box.setdefault(email, []).append(code)

    monkeypatch.setattr(mailer, "send_login_code", fake_send)
    monkeypatch.setattr("app.routers.auth.send_login_code", fake_send)
    return box


@pytest.fixture
def client():
    Base.metadata.create_all(engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(engine)
