import logging

import resend

from .config import get_settings

log = logging.getLogger("shentu.mailer")


def send_login_code(email: str, code: str) -> None:
    s = get_settings()
    if not s.resend_api_key:
        # 本地开发没配邮件服务时，验证码打印到日志
        log.warning("RESEND_API_KEY 未设置，验证码未发送。%s 的验证码：%s", email, code)
        return

    resend.api_key = s.resend_api_key
    minutes = s.code_ttl_minutes
    resend.Emails.send(
        {
            "from": s.mail_from,
            "to": [email],
            "subject": f"申途登录验证码：{code}",
            "html": (
                '<div style="font-family:sans-serif;font-size:15px;color:#1f2a30">'
                "<p>你好，</p>"
                f'<p>你的申途登录验证码是：<strong style="font-size:24px;letter-spacing:4px">{code}</strong></p>'
                f"<p>验证码 {minutes} 分钟内有效。如果不是你本人操作，请忽略这封邮件。</p>"
                "</div>"
            ),
            "text": f"你的申途登录验证码是 {code}，{minutes} 分钟内有效。如果不是你本人操作，请忽略这封邮件。",
        }
    )
