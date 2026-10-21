// 后端地址：Vercel 上通过环境变量配置，本地默认连本机 FastAPI
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** FastAPI 的 detail 可能是字符串，也可能是字段校验错误数组 */
function detailMessage(detail: unknown, status: number): string {
  if (typeof detail === "string") return detail;
  if (status === 422) return "输入格式不正确";
  return "请求失败，请稍后再试";
}

export async function api<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const { token, headers, ...rest } = init;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(0, "连不上服务器，请检查网络后重试");
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, detailMessage(body?.detail, res.status));
  return body as T;
}
