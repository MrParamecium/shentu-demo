from datetime import datetime, timedelta, timezone

from sqlalchemy import select, update

from app.db import SessionLocal
from app.models import VerificationCode

EMAIL = "Student@QQ.com"


def _request(client, email=EMAIL):
    return client.post("/auth/email/request-code", json={"email": email})


def _verify(client, code, email=EMAIL):
    return client.post("/auth/email/verify", json={"email": email, "code": code})


def _age_codes(seconds: int):
    """把已发验证码的创建时间往前挪，模拟时间流逝"""
    with SessionLocal() as db:
        for row in db.scalars(select(VerificationCode)):
            row.created_at = row.created_at - timedelta(seconds=seconds)
        db.commit()


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_full_login_flow_creates_user_then_logs_in_again(client, sent_codes):
    r = _request(client)
    assert r.status_code == 200
    code = sent_codes["student@qq.com"][-1]  # 邮箱统一转小写

    r = _verify(client, code)
    assert r.status_code == 200
    body = r.json()
    assert body["is_new_user"] is True

    me = client.get("/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.status_code == 200
    assert me.json()["identities"] == [{"provider": "email", "subject": "student@qq.com"}]
    user_id = me.json()["id"]

    # 第二次登录：同一个用户，不是新用户
    _age_codes(120)
    _request(client)
    r = _verify(client, sent_codes["student@qq.com"][-1])
    assert r.json()["is_new_user"] is False
    me2 = client.get("/auth/me", headers={"Authorization": f"Bearer {r.json()['access_token']}"})
    assert me2.json()["id"] == user_id


def test_code_cannot_be_reused(client, sent_codes):
    _request(client)
    code = sent_codes["student@qq.com"][-1]
    assert _verify(client, code).status_code == 200
    assert _verify(client, code).status_code == 400


def test_wrong_code_locks_after_max_attempts(client, sent_codes):
    _request(client)
    code = sent_codes["student@qq.com"][-1]
    wrong = "000000" if code != "000000" else "111111"
    for _ in range(5):
        assert _verify(client, wrong).status_code == 400
    # 错满 5 次后，正确的码也不再接受
    r = _verify(client, code)
    assert r.status_code == 400


def test_expired_code_rejected(client, sent_codes):
    _request(client)
    code = sent_codes["student@qq.com"][-1]
    with SessionLocal() as db:
        db.execute(update(VerificationCode).values(expires_at=datetime.now(timezone.utc) - timedelta(seconds=1)))
        db.commit()
    assert _verify(client, code).status_code == 400


def test_resend_cooldown(client, sent_codes):
    assert _request(client).status_code == 200
    r = _request(client)
    assert r.status_code == 429
    assert "秒后" in r.json()["detail"]


def test_new_code_invalidates_old_one(client, sent_codes):
    _request(client)
    old = sent_codes["student@qq.com"][-1]
    _age_codes(120)
    _request(client)
    new = sent_codes["student@qq.com"][-1]
    if old != new:
        assert _verify(client, old).status_code == 400
    assert _verify(client, new).status_code == 200


def test_daily_limit(client, sent_codes):
    for _ in range(10):
        assert _request(client).status_code == 200
        _age_codes(120)
    assert _request(client).status_code == 429


def test_invalid_input_rejected(client):
    assert _request(client, email="not-an-email").status_code == 422
    assert client.post("/auth/email/verify", json={"email": EMAIL, "code": "12ab"}).status_code == 422


def test_me_requires_valid_token(client):
    assert client.get("/auth/me").status_code == 401
    assert client.get("/auth/me", headers={"Authorization": "Bearer nonsense"}).status_code == 401


def test_codes_are_stored_hashed(client, sent_codes):
    _request(client)
    code = sent_codes["student@qq.com"][-1]
    with SessionLocal() as db:
        row = db.query(VerificationCode).one()
        assert code not in row.code_hash
