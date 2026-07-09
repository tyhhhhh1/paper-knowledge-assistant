import { ArrowRight, Database, FileText, Search } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { UploadPanel } from "@/components/upload-panel";
import { requireUser } from "@/lib/auth";
import { documents } from "@/lib/mock-data";

export default async function DashboardPage() {
  const user = await requireUser();
  const indexedCount = documents.filter(
    (document) => document.status === "indexed",
  ).length;
  const chunkCount = documents.reduce((total, document) => total + document.chunks, 0);

  return (
    <AppShell
      title="文档阅读助手"
      description="你已经登录。这个页面会读取 Supabase 会话，未登录用户会被自动送回登录页。"
      userEmail={user.email}
      action={
        <Link
          href="/chat"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--teal)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          <Search size={17} aria-hidden="true" />
          开始问答
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <UploadPanel />

          <section className="rounded-md border border-[var(--line)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-4">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  论文列表
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  现在仍使用 mock 数据；下一步会把文档列表替换成当前用户自己的 Supabase 数据。
                </p>
              </div>
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                {documents.length} files
              </span>
            </div>
            <div className="divide-y divide-[var(--line)]">
              {documents.map((document) => (
                <article key={document.id} className="p-4 transition hover:bg-zinc-50">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-zinc-950">
                          {document.title}
                        </h3>
                        <StatusPill status={document.status} />
                      </div>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                        {document.summary}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-600">
                        <span>{document.fileName}</span>
                        <span>{document.fileSize}</span>
                        <span>{document.pages} 页</span>
                        <span>{document.chunks} chunks</span>
                      </div>
                    </div>
                    <Link
                      href={`/documents/${document.id}`}
                      className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
                    >
                      查看
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <article className="rounded-md border border-[var(--line)] bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <Database size={18} aria-hidden="true" />
              文档库概览
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-zinc-50 p-3">
                <dt className="text-xs text-[var(--muted)]">已入库论文</dt>
                <dd className="mt-1 text-2xl font-semibold text-zinc-950">
                  {indexedCount}
                </dd>
              </div>
              <div className="rounded-md bg-zinc-50 p-3">
                <dt className="text-xs text-[var(--muted)]">文本块</dt>
                <dd className="mt-1 text-2xl font-semibold text-zinc-950">
                  {chunkCount}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-md border border-[var(--line)] bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <FileText size={18} aria-hidden="true" />
              当前阶段
            </h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              <li>1. Supabase Auth 已接入注册和登录。</li>
              <li>2. 受保护页面已能识别登录状态。</li>
              <li>3. 导航栏已显示当前登录邮箱。</li>
              <li>4. 下一步把 mock 文档替换为用户自己的数据库记录。</li>
            </ol>
          </article>
        </aside>
      </div>
    </AppShell>
  );
}
