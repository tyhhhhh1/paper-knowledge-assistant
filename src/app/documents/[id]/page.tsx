import { ArrowLeft, Database, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusPill } from "@/components/status-pill";
import { getChunksByDocument, getDocument } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

type DocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = await params;
  const document = getDocument(id);

  if (!document) notFound();

  const documentChunks = getChunksByDocument(document.id);

  return (
    <AppShell
      title={document.title}
      description="这里展示文档元信息、解析状态和切块结果。真实版本会从 Supabase 查询当前用户自己的文档和 chunks。"
      action={
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          返回文档库
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <article className="rounded-md border border-[var(--line)] bg-white p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
                <FileText size={18} aria-hidden="true" />
                文档信息
              </h2>
              <StatusPill status={document.status} />
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-[var(--muted)]">文件名</dt>
                <dd className="mt-1 text-zinc-900">{document.fileName}</dd>
              </div>
              <div>
                <dt className="text-[var(--muted)]">上传用户</dt>
                <dd className="mt-1 text-zinc-900">{document.ownerEmail}</dd>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-md bg-zinc-50 p-3">
                  <dt className="text-xs text-[var(--muted)]">页数</dt>
                  <dd className="mt-1 font-semibold text-zinc-950">
                    {document.pages}
                  </dd>
                </div>
                <div className="rounded-md bg-zinc-50 p-3">
                  <dt className="text-xs text-[var(--muted)]">chunks</dt>
                  <dd className="mt-1 font-semibold text-zinc-950">
                    {document.chunks}
                  </dd>
                </div>
                <div className="rounded-md bg-zinc-50 p-3">
                  <dt className="text-xs text-[var(--muted)]">大小</dt>
                  <dd className="mt-1 font-semibold text-zinc-950">
                    {document.fileSize}
                  </dd>
                </div>
              </div>
            </dl>
          </article>

          <article className="rounded-md border border-[var(--line)] bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <Database size={18} aria-hidden="true" />
              索引状态流
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {["uploaded", "parsing", "parsed", "indexed"].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-[var(--teal-soft)] text-xs font-semibold text-[var(--teal)]">
                    {index + 1}
                  </span>
                  <span className="text-zinc-700">{step}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>

        <section className="rounded-md border border-[var(--line)] bg-white">
          <div className="border-b border-[var(--line)] p-4">
            <h2 className="text-base font-semibold text-zinc-950">文本切块预览</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              top-k 检索返回的就是这些 chunk 的相似片段。
            </p>
          </div>
          {documentChunks.length ? (
            <div className="divide-y divide-[var(--line)]">
              {documentChunks.map((chunk) => (
                <article key={chunk.id} className="p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      page {chunk.pageNumber}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                      chunk {chunk.chunkIndex}
                    </span>
                    <span className="rounded-md bg-[var(--blue-soft)] px-2 py-1 text-xs font-medium text-[var(--blue)]">
                      similarity {formatPercent(chunk.similarity)}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-zinc-800">{chunk.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-sm text-[var(--muted)]">
              当前文档还没有可展示的 chunk。真实版本会展示解析失败原因或重试入口。
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
