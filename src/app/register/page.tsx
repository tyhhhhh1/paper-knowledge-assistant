import { RegisterForm } from "@/components/register";
import { redirectIfAuthenticated } from "@/lib/auth";

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6 py-10">
      <div className="mb-10 max-w-3xl text-center">
        <p className="inline-flex rounded-md bg-[var(--teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--teal)]">
          Paper Knowledge Base Assistant
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
          创建你的论文知识库
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--muted)]">
          注册后就能进入受保护页面，后续文档也会按用户隔离。
        </p>
      </div>

      <RegisterForm />

      <p className="mt-10 text-center text-xs text-[var(--muted)]">
        © 2026 论文问答知识库. All rights reserved.
      </p>
    </main>
  );
}
