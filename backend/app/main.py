import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import auth

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="申途 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)


@app.get("/health", tags=["meta"])
def health() -> dict[str, str]:
    # Render 健康检查用
    return {"status": "ok"}
