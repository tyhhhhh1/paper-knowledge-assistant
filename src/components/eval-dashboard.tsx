"use client";

import { BarChart3, CheckCircle2, Loader2, Play, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { evalCases } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

export function EvalDashboard() {
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState("2026-07-05 20:00");

  const summary = useMemo(() => {
    const count = evalCases.length;
    const recall = evalCases.filter((item) => item.recallAt5).length / count;
    const citation = evalCases.filter((item) => item.citationHit).length / count;
    const keyword = evalCases.filter((item) => item.keywordMatch).length / count;
    const latency =
      evalCases.reduce((total, item) => total + item.latencyMs, 0) / count;

    return { recall, citation, keyword, latency };
  }, []);

  function runEval() {
    setRunning(true);
    window.setTimeout(() => {
      setRunning(false);
      setLastRun("刚刚");
    }, 900);
  }

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Recall@5", formatPercent(summary.recall), "期望页码进入 top 5"],
          ["Citation Hit", formatPercent(summary.citation), "最终引用命中页码"],
          ["Keyword Match", formatPercent(summary.keyword), "回答包含期望关键词"],
          ["Avg Latency", `${Math.round(summary.latency)} ms`, "端到端平均耗时"],
        ].map(([label, value, helper]) => (
          <article
            key={label}
            className="rounded-md border border-[var(--line)] bg-white p-4"
          >
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
            <p className="mt-2 text-xs text-[var(--muted)]">{helper}</p>
          </article>
        ))}
      </section>

      <section className="rounded-md border border-[var(--line)] bg-white">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
              <BarChart3 size={18} aria-hidden="true" />
              评估用例
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              最近运行：{lastRun}
            </p>
          </div>
          <button
            type="button"
            onClick={runEval}
            disabled={running}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--teal)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
          >
            {running ? (
              <Loader2 className="animate-spin" size={17} aria-hidden="true" />
            ) : (
              <Play size={17} aria-hidden="true" />
            )}
            运行评估
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">问题</th>
                <th className="px-4 py-3 font-semibold">期望页码</th>
                <th className="px-4 py-3 font-semibold">Recall@5</th>
                <th className="px-4 py-3 font-semibold">Citation</th>
                <th className="px-4 py-3 font-semibold">Keyword</th>
                <th className="px-4 py-3 font-semibold">Latency</th>
              </tr>
            </thead>
            <tbody>
              {evalCases.map((item) => (
                <tr key={item.id} className="border-t border-[var(--line)]">
                  <td className="max-w-[280px] px-4 py-4 font-medium text-zinc-900">
                    {item.question}
                  </td>
                  <td className="px-4 py-4 text-zinc-700">
                    {item.expectedSourcePages.length
                      ? item.expectedSourcePages.join(", ")
                      : "无"}
                  </td>
                  {[item.recallAt5, item.citationHit, item.keywordMatch].map(
                    (passed, index) => (
                      <td key={index} className="px-4 py-4">
                        {passed ? (
                          <CheckCircle2
                            className="text-[var(--teal)]"
                            size={18}
                            aria-label="通过"
                          />
                        ) : (
                          <XCircle
                            className="text-[var(--rose)]"
                            size={18}
                            aria-label="未通过"
                          />
                        )}
                      </td>
                    ),
                  )}
                  <td className="px-4 py-4 text-zinc-700">{item.latencyMs} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
