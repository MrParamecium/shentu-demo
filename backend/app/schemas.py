from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class EmailCodeRequest(BaseModel):
    email: EmailStr


class EmailCodeResponse(BaseModel):
    ok: bool = True
    resend_after_seconds: int
    # 仅演示模式返回，正常模式永远为空
    demo_code: str | None = None


class EmailVerifyRequest(BaseModel):
    email: EmailStr
    code: str = Field(pattern=r"^\d{6}$")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    is_new_user: bool


class IdentityOut(BaseModel):
    provider: str
    subject: str


class UserOut(BaseModel):
    id: int
    nickname: str | None
    created_at: datetime
    identities: list[IdentityOut]
