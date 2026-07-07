import { NextResponse } from "next/server";
import { runLocalEvaluation } from "@/lib/rag";

export async function POST() {
  const cases = runLocalEvaluation();
  const count = cases.length;

  return NextResponse.json({
    summary: {
      recallAt5:
        cases.filter((item) => item.recallAt5).length / Math.max(count, 1),
      citationHit:
        cases.filter((item) => item.citationHit).length / Math.max(count, 1),
      keywordMatch:
        cases.filter((item) => item.keywordMatch).length / Math.max(count, 1),
      avgLatencyMs:
        cases.reduce((total, item) => total + item.latencyMs, 0) / Math.max(count, 1),
    },
    cases,
  });
}
