from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """所有配置从环境变量读取；本地开发可写在 backend/.env（已被 git 忽略）"""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:///./dev.db"
    # 签发登录 token 的密钥，生产环境必须设置成足够长的随机串
    jwt_secret: str = "dev-only-change-me"
    jwt_expire_days: int = 30

    # 允许跨域访问 API 的前端地址，逗号分隔
    cors_origins: str = "http://localhost:3123,https://shentu-demo.vercel.app"

    # 邮件：不填 RESEND_API_KEY 时验证码只打印到日志，方便本地开发
    resend_api_key: str = ""
    mail_from: str = "申途 <onboarding@resend.dev>"

    # 演示模式：不发邮件，接口直接返回验证码。任何人都能用任意邮箱登录，
    # 只能在账号下还没有真实用户数据时开启
    auth_demo_mode: bool = False

    # 验证码规则
    code_ttl_minutes: int = 10
    code_max_attempts: int = 5
    code_resend_seconds: int = 60
    code_daily_limit_per_email: int = 10

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
