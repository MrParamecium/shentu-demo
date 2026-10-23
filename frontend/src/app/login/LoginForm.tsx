"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError } from "@/lib/api";
import { requestEmailCode, useAuth, verifyEmailCode } from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 免费版后端休眠后唤醒约 1 分钟；请求超过 4 秒还没响应就提示用户在唤醒
const SLOW_MS = 4000;

export default function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") || "/dashboard";
  const auth = useAuth();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeRef.current?.focus();
  }, [step]);

  // 包一层：处理 loading、慢响应提示和错误文案
  async function run(task: () => Promise<void>) {
    setError("");
    setLoading(true);
    const timer = setTimeout(() => setSlow(true), SLOW_MS);
    try {
      await task();
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "出错了，请稍后再试";
      setError(msg);
      // 冷却期内被拒，从文案里读出剩余秒数
      const m = msg.match(/(\d+) 秒后/);
      if (e instanceof ApiError && e.status === 429 && m) setCooldown(Number(m[1]));
    } finally {
      clearTimeout(timer);
      setSlow(false);
      setLoading(false);
    }
  }

  const sendCode = () =>
    run(async () => {
      const { wait, demoCode } = await requestEmailCode(email.trim());
      setCooldown(wait);
      setDemoCode(demoCode);
      if (demoCode) setCode(demoCode);
      setStep("code");
    });

  const verify = () =>
    run(async () => {
      await verifyEmailCode(email.trim(), code);
      router.replace(next);
    });

  if (auth && step === "email") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <p className="text-slate-600">
          你已登录：<span className="font-medium break-all">{auth.email}</span>
        </p>
        <button
          type="button"
          onClick={() => router.replace(next)}
          className="mt-6 rounded-lg bg-brand px-6 py-2 text-sm font-medium text-white hover:bg-brand-dark"
        >
          继续
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-dark">登录 / 注册</h1>
      <p className="mt-1 text-sm text-slate-500">用邮箱验证码登录，首次登录自动注册</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={e => {
          e.preventDefault();
          if (step === "email") sendCode();
          else verify();
        }}
        noValidate
      >
        <label className="block">
          <span className="text-sm text-slate-600">邮箱</span>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={step === "code"}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand disabled:bg-slate-50 disabled:text-slate-500"
          />
        </label>

        {step === "code" && (
          <>
            <label className="block">
              <span className="text-sm text-slate-600">验证码</span>
              <input
                ref={codeRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="6 位数字"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 tracking-[0.4em] outline-none focus:border-brand"
              />
            </label>
            {demoCode ? (
              <p role="status" className="rounded-md bg-sky-50 p-3 text-xs text-sky-800">
                演示模式：暂未开通邮件发送，验证码 <span className="font-mono font-semibold">{demoCode}</span>{" "}
                已自动填入，直接点「登录」即可。
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                验证码已发送到 {email.trim()}，10 分钟内有效。没收到的话看看垃圾邮件箱。
              </p>
            )}
            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
                className="text-slate-500 hover:text-brand"
              >
                换个邮箱
              </button>
              <button
                type="button"
                onClick={sendCode}
                disabled={cooldown > 0 || loading}
                className="text-brand hover:underline disabled:text-slate-400 disabled:no-underline"
              >
                {cooldown > 0 ? `${cooldown} 秒后可重发` : "重新发送"}
              </button>
            </div>
          </>
        )}

        {error && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {slow && (
          <p role="status" className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            服务器正在唤醒，第一次可能要等半分钟到一分钟，请稍候…
          </p>
        )}

        <button
          type="submit"
          disabled={loading || (step === "email" ? !EMAIL_RE.test(email.trim()) || cooldown > 0 : code.length !== 6)}
          className="w-full rounded-lg bg-brand py-2.5 font-medium text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {loading ? "请稍候…" : step === "email" ? (cooldown > 0 ? `${cooldown} 秒后可重发` : "获取验证码") : "登录"}
        </button>
      </form>
    </div>
  );
}
