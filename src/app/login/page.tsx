import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { redirectIfAuthenticated } from "@/lib/auth";

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6">
      <section className="w-full max-w-4xl">
        <div className="mb-8 text-center">
          <p className="inline-flex items-center justify-center rounded-md bg-[var(--teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--teal)]">
            Paper Knowledge Base Assistant
          </p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            论文问答知识库
          </h1>
          <p className="mt-5 text-base leading-7 text-[var(--muted)]">
            把论文 PDF 变成可检索、可引用、可评估的问答知识库。
          </p>
        </div>

        <div className="mx-auto max-w-md">
          <LoginForm />
          <p className="mt-8 text-center text-sm text-[var(--muted)]">
            还没有账户？
            <Link href="/register" className="text-[var(--teal)] hover:underline">
              注册
            </Link>
          </p>
        </div>

        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          © 2026 论文问答知识库. All rights reserved.
        </p>
      </section>
    </main>
  );
}
