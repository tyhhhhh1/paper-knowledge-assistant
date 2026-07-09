"use client";

import { createClient } from "@/lib/supabase/client";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.includes("@") || password.length < 6) {
      setError("请输入有效邮箱，密码至少 6 位。");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.push(nextPath || "/dashboard");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-md border border-[var(--line)] bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-[var(--teal-soft)] text-[var(--teal)]">
          <ShieldCheck size={21} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">登录知识库</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            登录后页面会自动识别你的 Supabase 会话。
          </p>
        </div>
      </div>

      <label className="block text-sm font-medium text-zinc-800">
        邮箱
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-4 block text-sm font-medium text-zinc-800">
        密码
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
          placeholder="至少 6 位"
        />
      </label>

      {error ? (
        <p className="mt-4 rounded-md bg-[var(--rose-soft)] px-3 py-2 text-sm text-[var(--rose)]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--teal)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
        ) : (
          <LogIn size={18} aria-hidden="true" />
        )}
        登录
      </button>
    </form>
  );
}
