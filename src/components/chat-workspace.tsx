"use client";

import {
  Bot,
  CheckCircle2,
  FileText,
  Loader2,
  MessageSquarePlus,
  Search,
  Send,
} from "lucide-react";
import { useMemo, useState } from "react";
import { documents, sources, type Source } from "@/lib/mock-data";
import { SourceCard } from "@/components/source-card";

type ChatState = "idle" | "thinking" | "answered";

const initialAnswer =
  "RAG 的核心是把检索器和生成器组合起来：检索器先从论文知识库中找到相关片段，生成器再基于这些片段回答问题。这样可以把答案限制在可追溯的上下文中，并把来源页码展示给用户。";

export function ChatWorkspace() {
  const indexedDocuments = documents.filter(
    (document) => document.status === "indexed" || document.status === "parsed",
  );
  const [documentId, setDocumentId] = useState(indexedDocuments[0]?.id ?? "all");
  const [question, setQuestion] = useState("RAG 的核心思想是什么？");
  const [answer, setAnswer] = useState(initialAnswer);
  const [state, setState] = useState<ChatState>("answered");
  const [activeSource, setActiveSource] = useState<Source>(sources[0]);

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === documentId),
    [documentId],
  );

  function askQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!question.trim() || state === "thinking") return;

    setState("thinking");
    window.setTimeout(() => {
      setAnswer(
        "根据已检索到的论文片段，RAG 通过向量检索先定位相关 passages，再让生成模型基于这些 passages 组织回答。它的价值在于：知识可以通过外部索引更新，回答能附带来源，事实性也更容易评估。",
      );
      setActiveSource(sources[0]);
      setState("answered");
    }, 780);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
      <aside className="rounded-md border border-[var(--line)] bg-white p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
          <FileText size={18} aria-hidden="true" />
          检索范围
        </h2>
        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={() => setDocumentId("all")}
            className={`w-full rounded-md border px-3 py-3 text-left text-sm transition ${
              documentId === "all"
                ? "border-[var(--teal)] bg-[var(--teal-soft)] text-[var(--teal)]"
                : "border-[var(--line)] text-zinc-700 hover:border-[var(--teal)]"
            }`}
          >
            全部可检索论文
          </button>
          {indexedDocuments.map((document) => (
            <button
              type="button"
              key={document.id}
              onClick={() => setDocumentId(document.id)}
              className={`w-full rounded-md border px-3 py-3 text-left text-sm transition ${
                documentId === document.id
                  ? "border-[var(--teal)] bg-[var(--teal-soft)] text-[var(--teal)]"
                  : "border-[var(--line)] text-zinc-700 hover:border-[var(--teal)]"
              }`}
            >
              <span className="block font-medium">{document.title}</span>
              <span className="mt-1 block text-xs text-[var(--muted)]">
                {document.chunks} chunks
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="flex min-h-[620px] flex-col rounded-md border border-[var(--line)] bg-white">
        <div className="border-b border-[var(--line)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
                <Bot size={18} aria-hidden="true" />
                基于引用的问答
              </h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {selectedDocument
                  ? `当前限定：${selectedDocument.title}`
                  : "当前检索：全部可用论文"}
              </p>
            </div>
            <span className="inline-flex h-8 items-center gap-2 rounded-md bg-[var(--blue-soft)] px-3 text-xs font-medium text-[var(--blue)]">
              <CheckCircle2 size={14} aria-hidden="true" />
              mock RAG ready
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-4">
          <article className="max-w-[86%] rounded-md bg-zinc-100 p-4 text-sm leading-6 text-zinc-800">
            {question}
          </article>
          <article className="ml-auto max-w-[92%] rounded-md border border-[var(--line)] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-950">
              {state === "thinking" ? (
                <Loader2 className="animate-spin" size={17} aria-hidden="true" />
              ) : (
                <MessageSquarePlus size={17} aria-hidden="true" />
              )}
              {state === "thinking" ? "正在检索并生成回答" : "回答"}
            </div>
            <p className="text-sm leading-7 text-zinc-800">
              {state === "thinking"
                ? "正在模拟 query embedding、top-k 检索、prompt 组装和大模型回答..."
                : answer}
            </p>
          </article>
        </div>

        <form onSubmit={askQuestion} className="border-t border-[var(--line)] p-4">
          <label className="sr-only" htmlFor="question">
            输入问题
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="question"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="h-11 flex-1 rounded-md border border-[var(--line)] bg-white px-3 text-sm text-zinc-950"
              placeholder="问一个关于论文的问题"
            />
            <button
              type="submit"
              disabled={state === "thinking" || !question.trim()}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--teal)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {state === "thinking" ? (
                <Loader2 className="animate-spin" size={17} aria-hidden="true" />
              ) : (
                <Send size={17} aria-hidden="true" />
              )}
              发送
            </button>
          </div>
        </form>
      </section>

      <aside className="rounded-md border border-[var(--line)] bg-white p-4">
        <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
          <Search size={18} aria-hidden="true" />
          引用来源
        </h2>
        <div className="mt-4 space-y-3">
          {sources.map((source) => (
            <SourceCard
              key={`${source.documentId}-${source.chunkIndex}`}
              source={source}
              active={activeSource.chunkIndex === source.chunkIndex}
              onClick={() => setActiveSource(source)}
            />
          ))}
        </div>
        <div className="mt-4 rounded-md bg-zinc-50 p-4">
          <p className="text-xs font-semibold uppercase text-[var(--muted)]">
            原文片段
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-800">
            {activeSource.contentPreview}
          </p>
        </div>
      </aside>
    </div>
  );
}
