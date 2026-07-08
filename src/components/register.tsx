"use client";

import { createClient } from "@/lib/client";
import { Loader2, UserPlus, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    // 完整表单校验，分层提示
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  }

  return (
    <form
      onSubmit={submit}
      className="w-full max-w-md rounded-md border border-[var(--line)] bg-white p-6 shadow-sm"
    >
      {/* 头部盾牌+标题，和LoginForm结构完全一致 */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-md bg-[var(--teal-soft)] text-[var(--teal)]">
          <ShieldCheck size={21} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-zinc-950">注册知识库</h1>
        </div>
      </div>

      {/* 邮箱输入框 */}
      <label className="block text-sm font-medium text-zinc-800">
        邮箱
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
        />
      </label>

      {/* 密码输入框 */}
      <label className="mt-4 block text-sm font-medium text-zinc-800">
        密码
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
        />
      </label>

      {/* 新增邀请码输入框，间距和密码保持统一 mt-4 */}
      <label className="mt-4 block text-sm font-medium text-zinc-800">
        邀请码
        <input
          value={inviteCode}
          onChange={(event) => setInviteCode(event.target.value)}
          type="text"
          className="mt-2 h-11 w-full rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
        />
      </label>

      {/* 统一错误提示模块，和登录表单样式完全复用 */}
      {error ? (
        <p className="mt-4 rounded-md bg-[var(--rose-soft)] px-3 py-2 text-sm text-[var(--rose)]">
          {error}
        </p>
      ) : null}

      {/* 注册提交按钮，替换图标为 UserPlus，文字改为注册 */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--black)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} aria-hidden="true" />
        ) : (
          <UserPlus size={18} aria-hidden="true" />
        )}
        注册账户
      </button>

      {/* 底部跳转登录链接，放在form内部最底部，样式和登录页注册链接对称 */}
      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        已有账户？<a href="/login" className="text-[var(--teal)] hover:underline">登录</a>
      </p>
    </form>
  );
}
