"use client";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-[var(--background)] p-6">   
      
      <section className="flex flex-col justify-between px-6 py-8 sm:px-10">
        <div className="text-center">
          <p className="inline-flex items-center justify-center rounded-md bg-[var(--teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--teal)]">
            Paper Knowledge Base Assistant
          </p>
          <h1 className="mt-5 flex items-center justify-center max-w-4xl text-3xl font-semibold leading-tight text-zinc-950 sm:text-5xl">
            论文问答知识库
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-[var(--muted)]">
            把论文 PDF 变成可检索、可引用、可评估的问答知识库。
          </p>
        </div>
        
        <LoginForm />
      
        <p className="mt-8 text-center text-sm text-[var(--muted)]">
      还没有账户？<a href="/register" className="text-[var(--teal)] hover:underline">注册</a>
    </p>
  

          {/* 页面底部版权 */}
        <p className="mt-10 flex items-center justify-center text-xs text-[var(--muted)]">© 2026 论文问答知识库. All rights reserved.</p>
      </section>
      
    </main>
  );
}
