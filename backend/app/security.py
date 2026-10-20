import hashlib
import hmac
import secrets
from datetime import datetime, timedelta, timezone

import jwt

from .config import get_settings

ALGORITHM = "HS256"


def generate_code() -> str:
    """6 位数字验证码，用密码学安全的随机数"""
    return f"{secrets.randbelow(1_000_000):06d}"


def hash_code(target: str, code: str) -> str:
    # 用 jwt_secret 做 HMAC 密钥：数据库泄露时也无法离线枚举出验证码
    key = get_settings().jwt_secret.encode()
    return hmac.new(key, f"{target}:{code}".encode(), hashlib.sha256).hexdigest()


def codes_match(stored_hash: str, target: str, code: str) -> bool:
    return hmac.compare_digest(stored_hash, hash_code(target, code))


def create_access_token(user_id: int) -> str:
    s = get_settings()
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user_id), "iat": now, "exp": now + timedelta(days=s.jwt_expire_days)}
    return jwt.encode(payload, s.jwt_secret, algorithm=ALGORITHM)


def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, get_settings().jwt_secret, algorithms=[ALGORITHM])
        return int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        return None
