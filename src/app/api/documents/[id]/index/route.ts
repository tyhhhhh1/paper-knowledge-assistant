import { NextResponse } from "next/server";
import { getChunksByDocument, getDocument } from "@/lib/mock-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const document = getDocument(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const chunks = getChunksByDocument(id);

  return NextResponse.json({
    documentId: id,
    status: "indexed",
    chunkCount: chunks.length || document.chunks,
    next: "Replace this mock route with PDF parsing, chunking, embeddings, and pgvector upsert.",
  });
}
