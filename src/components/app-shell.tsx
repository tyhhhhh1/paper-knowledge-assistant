import {
  BarChart3,
  FileText,
  Library,
  MessageSquareText,
  UploadCloud,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/dashboard", label: "文档库", icon: Library },
  { href: "/chat", label: "论文问答", icon: MessageSquareText },
  { href: "/eval", label: "评估集", icon: BarChart3 },
];

type AppShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  userEmail?: string | null;
  action?: ReactNode;
};

export function AppShell({
  children,
  title,
  description,
  userEmail,
  action,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-[var(--teal)] text-white">
              <FileText size={21} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold text-zinc-950">
                TUFI 论文助手
              </span>
              <span className="block text-xs text-[var(--muted)]">
                PDF to chunks to vectors to cited answers
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-transparent px-3 text-sm font-medium text-zinc-700 transition hover:border-[var(--line)] hover:bg-zinc-50"
                >
                  <Icon size={17} aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
            {userEmail ? (
              <span className="inline-flex h-10 max-w-[260px] items-center gap-2 truncate rounded-md bg-zinc-50 px-3 text-sm text-zinc-700 ring-1 ring-[var(--line)]">
                <UserCircle size={17} aria-hidden="true" />
                <span className="truncate">{userEmail}</span>
              </span>
            ) : null}
            <LogoutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-md bg-[var(--teal-soft)] px-2.5 py-1 text-xs font-medium text-[var(--teal)]">
              <UploadCloud size={14} aria-hidden="true" />
              RAG project
            </p>
            <h1 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              {description}
            </p>
          </div>
          {action}
        </div>
        {children}
      </main>
    </div>
  );
}
