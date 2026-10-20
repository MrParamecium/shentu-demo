"use client";

import { useSyncExternalStore } from "react";
import type { Application } from "./types";
import { programById } from "./programs";

// demo 不做登录：数据只存在当前浏览器的 localStorage
const KEY = "shentu-demo:applications";
const EMPTY: Application[] = [];
const listeners = new Set<() => void>();

let cacheRaw: string | null = null;
let cacheValue: Application[] = EMPTY;

function read(): Application[] {
  const raw = localStorage.getItem(KEY);
  if (raw === cacheRaw) return cacheValue;
  cacheRaw = raw;
  try {
    cacheValue = raw ? (JSON.parse(raw) as Application[]) : EMPTY;
  } catch {
    cacheValue = EMPTY;
  }
  return cacheValue;
}

function write(apps: Application[]) {
  localStorage.setItem(KEY, JSON.stringify(apps));
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

export function useApplications(): Application[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

/** 客户端是否已挂载：用于区分「还没读到 localStorage」和「真的没有数据」 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function addApplication(programId: string, roundIndex: number): string {
  const program = programById(programId);
  if (!program) throw new Error(`unknown program ${programId}`);
  const id = `${programId}-${Date.now().toString(36)}`;
  const app: Application = {
    id,
    programId,
    roundIndex,
    createdAt: new Date().toISOString(),
    materials: Object.fromEntries(program.materials.map(m => [m, false])),
    stage: 0,
    outcome: "pending",
  };
  write([...read(), app]);
  return id;
}

export function updateApplication(id: string, patch: Partial<Application>) {
  write(read().map(a => (a.id === id ? { ...a, ...patch } : a)));
}

export function removeApplication(id: string) {
  write(read().filter(a => a.id !== id));
}
