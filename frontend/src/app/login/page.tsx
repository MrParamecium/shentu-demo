import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "登录 · 申途 Demo" };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      {/* useSearchParams 需要 Suspense 边界 */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
