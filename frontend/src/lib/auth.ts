"use client";

import { useSyncExternalStore } from "react";
import { api } from "./api";

// 登录态：token 和用户邮箱存在 localStorage，跨标签页同步
const KEY = "shentu-demo:auth";
const listeners = new Set<() => void>();

export interface AuthState {
  token: string;
  email: string;
}

let cacheRaw: string | null = null;
let cacheValue: AuthState | null = null;

function read(): AuthState | null {
  const raw = localStorage.getItem(KEY);
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  try {
    cacheValue = raw ? (JSON.parse(raw) as AuthState) : null;
  } catch {
    cacheValue = null;
  }
  return cacheValue;
}

function write(state: AuthState | null) {
  if (state) localStorage.setItem(KEY, JSON.stringify(state));
  else localStorage.removeItem(KEY);
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAuth(): AuthState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function logout() {
  write(null);
}

/** demoCode 只在后端开启演示模式时返回（暂未接入真实发信） */
export async function requestEmailCode(email: string): Promise<{ wait: number; demoCode: string | null }> {
  const r = await api<{ resend_after_seconds: number; demo_code: string | null }>("/auth/email/request-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
  return { wait: r.resend_after_seconds, demoCode: r.demo_code ?? null };
}

export async function verifyEmailCode(email: string, code: string): Promise<{ isNewUser: boolean }> {
  const r = await api<{ access_token: string; is_new_user: boolean }>("/auth/email/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
  write({ token: r.access_token, email: email.trim().toLowerCase() });
  return { isNewUser: r.is_new_user };
}
