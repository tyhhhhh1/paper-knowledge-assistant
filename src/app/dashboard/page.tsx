import { Database, FileText, Search } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { UploadPanel } from "@/components/upload-panel";
import { requireUser } from "@/lib/auth";
import type { DocumentStatus } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";

type DbDocument = {
  id: string;
  title: string;
  file_url: string;
  status: string;
  page_count: number;
  chunk_count: number;
  created_at: string;
};

const allowedStatuses: DocumentStatus[] = [
  "uploaded",
  "parsing",
  "parsed",
  "indexed",
  "failed",
];

function normalizeStatus(status: string): DocumentStatus {
  if (allowedStatuses.includes(status as DocumentStatus)) {
    return status as DocumentStatus;
  }

  return "uploaded";
}

function getFileName(filePath: string, fallback: string) {
  return filePath.split("/").pop() || fallback;
}

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: dbDocuments, error: documentsError } = await supabase
    .from("documents")
    .select("id, title, file_url, status, page_count, chunk_count, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const visibleDocuments = ((dbDocuments ?? []) as DbDocument[]).map((document) => ({
    id: document.id,
    title: document.title,
    fileName: getFileName(document.file_url, document.title),
    fileSize: "Supabase Storage",
    status: normalizeStatus(document.status),
    pages: document.page_count,
    chunks: document.chunk_count,
    uploadedAt: new Date(document.created_at).toLocaleString("zh-CN"),
    ownerEmail: user.email ?? "",
    summary: "已上传到 Supabase Storage，等待解析、切块和向量化。",
  }));

  const indexedCount = visibleDocuments.filter(
    (document) => document.status === "indexed",
  ).length;
  const chunkCount = visibleDocuments.reduce(
    (total, document) => total + document.chunks,
    0,
  );

  return (
    <AppShell
      title="文档阅读助手"
      description="这里读取 Supabase documents 表，只展示当前登录用户自己的文档记录。"
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
                  上传成功后，documents 表里的真实记录会显示在这里。
                </p>
              </div>
              <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                {visibleDocuments.length} files
              </span>
            </div>

            {documentsError ? (
              <div className="p-6 text-sm text-[var(--rose)]">
                读取 documents 失败：{documentsError.message}
              </div>
            ) : null}

            {!documentsError && visibleDocuments.length === 0 ? (
              <div className="p-8 text-sm leading-6 text-[var(--muted)]">
                还没有上传论文。请选择一个 PDF 上传，成功后这里会出现真实文档记录。
              </div>
            ) : null}

            {!documentsError && visibleDocuments.length > 0 ? (
              <div className="divide-y divide-[var(--line)]">
                {visibleDocuments.map((document) => (
                  <article
                    key={document.id}
                    className="p-4 transition hover:bg-zinc-50"
                  >
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
                          <span>{document.uploadedAt}</span>
                        </div>
                      </div>
                      <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-[var(--line)] bg-white px-3 text-sm font-medium text-zinc-500">
                        详情待接入
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
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
                <dt className="text-xs text-[var(--muted)]">已索引论文</dt>
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
              <li>2. 上传 PDF 后会写入 Storage 和 documents 表。</li>
              <li>3. dashboard 已读取当前用户的真实 documents。</li>
              <li>4. 下一步可以把文档详情页也接到数据库。</li>
            </ol>
          </article>
        </aside>
      </div>
    </AppShell>
  );
}
