"use client";

import { createClient } from "@/lib/supabase/client";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.includes("@")) {
      setError("请输入有效邮箱。");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位。");
      return;
    }
    if (!inviteCode.trim()) {
      setError("请填写邀请码。");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setLoading(false);
    setMessage("注册成功。请按 Supabase 邮件确认设置完成验证，然后返回登录。");
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
          <h1 className="text-xl font-semibold text-zinc-950">注册知识库</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            注册完成后会根据 Supabase 会话状态自动跳转。
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

      <label className="mt-4 block text-sm font-medium text-zinc-800">
        邀请码
        <input
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value)}
          type="text"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
          placeholder="学习阶段先做本地校验"
        />
      </label>

      {error ? (
        <p className="mt-4 rounded-md bg-[var(--rose-soft)] px-3 py-2 text-sm text-[var(--rose)]">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="mt-4 rounded-md bg-[var(--teal-soft)] px-3 py-2 text-sm text-[var(--teal)]">
          {message}
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
          <UserPlus size={18} aria-hidden="true" />
        )}
        注册账户
      </button>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        已有账户？
        <Link href="/login" className="text-[var(--teal)] hover:underline">
          登录
        </Link>
      </p>
    </form>
  );
}
