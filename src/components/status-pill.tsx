import { statusMeta, type DocumentStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type StatusPillProps = {
  status: DocumentStatus;
};

export function StatusPill({ status }: StatusPillProps) {
  const meta = statusMeta[status];

  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-2.5 text-xs font-medium ring-1",
        meta.className,
      )}
      title={meta.description}
    >
      {meta.label}
    </span>
  );
}
