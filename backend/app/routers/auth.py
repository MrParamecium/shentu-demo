import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from ..config import get_settings
from ..deps import CurrentUser, DbSession
from ..mailer import send_login_code
from ..models import AuthIdentity, User, VerificationCode
from ..schemas import EmailCodeRequest, EmailCodeResponse, EmailVerifyRequest, IdentityOut, TokenResponse, UserOut
from ..security import codes_match, create_access_token, generate_code, hash_code

router = APIRouter(prefix="/auth", tags=["auth"])
log = logging.getLogger("shentu.auth")

INVALID_CODE = "验证码错误或已过期"


def _as_utc(dt: datetime) -> datetime:
    # SQLite 读回来的时间不带时区，统一按 UTC 处理
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def _normalize_email(email: str) -> str:
    return email.strip().lower()


@router.post("/email/request-code", response_model=EmailCodeResponse)
def request_email_code(body: EmailCodeRequest, db: DbSession) -> EmailCodeResponse:
    s = get_settings()
    email = _normalize_email(body.email)
    now = datetime.now(timezone.utc)

    latest = db.scalar(
        select(VerificationCode)
        .where(VerificationCode.channel == "email", VerificationCode.target == email)
        .order_by(VerificationCode.created_at.desc())
        .limit(1)
    )
    if latest:
        wait = s.code_resend_seconds - int((now - _as_utc(latest.created_at)).total_seconds())
        if wait > 0:
            raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, f"请 {wait} 秒后再获取验证码")

    sent_today = db.scalar(
        select(func.count())
        .select_from(VerificationCode)
        .where(
            VerificationCode.channel == "email",
            VerificationCode.target == email,
            VerificationCode.created_at >= now - timedelta(days=1),
        )
    )
    if sent_today >= s.code_daily_limit_per_email:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "今天获取验证码次数过多，请明天再试")

    code = generate_code()
    record = VerificationCode(
        channel="email",
        target=email,
        code_hash=hash_code(email, code),
        created_at=now,
        expires_at=now + timedelta(minutes=s.code_ttl_minutes),
    )
    db.add(record)
    db.commit()

    if s.auth_demo_mode:
        log.info("演示模式：未发送邮件，验证码直接返回给 %s", email)
        return EmailCodeResponse(resend_after_seconds=s.code_resend_seconds, demo_code=code)

    try:
        send_login_code(email, code)
    except Exception:
        log.exception("验证码邮件发送失败：%s", email)
        # 没发出去的码不算数：删掉记录，用户可以马上重试，也不占每日次数
        db.delete(record)
        db.commit()
        # 最常见原因：发信域名未验证，只能发给 Resend 账号本人的邮箱
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY,
            "验证码邮件发送失败。内测期间暂时只支持受邀邮箱，请稍后再试或联系我们",
        )

    return EmailCodeResponse(resend_after_seconds=s.code_resend_seconds)


@router.post("/email/verify", response_model=TokenResponse)
def verify_email_code(body: EmailVerifyRequest, db: DbSession) -> TokenResponse:
    s = get_settings()
    email = _normalize_email(body.email)
    now = datetime.now(timezone.utc)

    # 只认最新一条验证码：重新获取后，旧码自动失效
    record = db.scalar(
        select(VerificationCode)
        .where(VerificationCode.channel == "email", VerificationCode.target == email)
        .order_by(VerificationCode.created_at.desc())
        .limit(1)
    )
    if (
        not record
        or record.used_at is not None
        or _as_utc(record.expires_at) < now
        or record.attempts >= s.code_max_attempts
    ):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, INVALID_CODE)

    if not codes_match(record.code_hash, email, body.code):
        record.attempts += 1
        db.commit()
        left = s.code_max_attempts - record.attempts
        detail = INVALID_CODE if left > 0 else "错误次数过多，请重新获取验证码"
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail)

    record.used_at = now

    identity = db.scalar(select(AuthIdentity).where(AuthIdentity.provider == "email", AuthIdentity.subject == email))
    is_new = identity is None
    if is_new:
        user = User(nickname=email.split("@")[0][:50])
        user.identities.append(AuthIdentity(provider="email", subject=email))
        db.add(user)
    else:
        user = identity.user
    user.last_login_at = now
    db.commit()

    return TokenResponse(access_token=create_access_token(user.id), is_new_user=is_new)


@router.get("/me", response_model=UserOut)
def me(user: CurrentUser) -> UserOut:
    return UserOut(
        id=user.id,
        nickname=user.nickname,
        created_at=user.created_at,
        identities=[IdentityOut(provider=i.provider, subject=i.subject) for i in user.identities],
    )
