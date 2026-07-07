import { RegisterForm } from "@/components/register";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-[var(--background)]">
      {/* 顶部品牌标题区 */}
      <div className="text-center mb-10 max-w-3xl">
        <p className="inline-flex rounded-md bg-[var(--teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--teal)]">
          Paper Knowledge Base Assistant
        </p>
        <h1 className="mt-5 text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
          论文问答知识库
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--muted)]">
          把论文 PDF 变成可检索、可引用、可评估的问答知识库。
        </p>
      </div>

      {/* 注册单卡片 */}
      <RegisterForm />

      {/* 底部版权 */}
      <p className="mt-10 text-center text-xs text-[var(--muted)]">
        © 2026 论文问答知识库. All rights reserved.
      </p>
    </main>
  );
}