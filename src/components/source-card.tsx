import { FileSearch } from "lucide-react";
import type { Source } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

type SourceCardProps = {
  source: Source;
  onClick?: () => void;
  active?: boolean;
};

export function SourceCard({ source, onClick, active = false }: SourceCardProps) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950">
          <FileSearch size={17} aria-hidden="true" />
          第 {source.pageNumber} 页
        </div>
        <span className="rounded-md bg-[var(--blue-soft)] px-2 py-1 text-xs font-medium text-[var(--blue)]">
          {formatPercent(source.similarity)}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--muted)]">
        {source.documentTitle}
      </p>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        {source.contentPreview}
      </p>
    </>
  );

  if (!onClick) {
    return (
      <article className="rounded-md border border-[var(--line)] bg-white p-4">
        {content}
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-md border p-4 text-left transition ${
        active
          ? "border-[var(--teal)] bg-[var(--teal-soft)]"
          : "border-[var(--line)] bg-white hover:border-[var(--teal)]"
      }`}
    >
      {content}
    </button>
  );
}
