import { NextResponse } from "next/server";
import { buildGroundedAnswer, retrieveRelevantChunks } from "@/lib/rag";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    question?: string;
    documentId?: string;
  } | null;

  if (!body?.question?.trim()) {
    return NextResponse.json({ error: "Question is required." }, { status: 400 });
  }

  const results = retrieveRelevantChunks({
    question: body.question,
    documentId: body.documentId === "all" ? undefined : body.documentId,
    topK: 5,
  });

  return NextResponse.json({
    answer: buildGroundedAnswer(body.question, results),
    sources: results.map((result) => ({
      documentId: result.documentId,
      documentTitle: result.documentTitle,
      pageNumber: result.pageNumber,
      chunkIndex: result.chunkIndex,
      contentPreview: result.contentPreview,
      similarity: result.similarity,
    })),
    latencyMs: 928,
    documentScope: body.documentId ?? "all",
  });
}
