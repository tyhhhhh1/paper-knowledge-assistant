import {
  chunks,
  documents,
  evalCases,
  type Chunk,
  type EvalCase,
  type Source,
} from "@/lib/mock-data";

type PageText = {
  pageNumber: number;
  text: string;
};

export type RetrievalResult = Source & {
  content: string;
};

export function chunkPages(
  pages: PageText[],
  options = { maxChars: 720, overlapChars: 120 },
) {
  const output: Array<Omit<Chunk, "id" | "documentId" | "similarity">> = [];

  for (const page of pages) {
    const text = page.text.replace(/\s+/g, " ").trim();
    let start = 0;
    let chunkIndex = output.length;

    while (start < text.length) {
      const end = Math.min(start + options.maxChars, text.length);
      const content = text.slice(start, end).trim();

      if (content) {
        output.push({
          pageNumber: page.pageNumber,
          chunkIndex,
          content,
        });
        chunkIndex += 1;
      }

      if (end >= text.length) break;
      start = Math.max(end - options.overlapChars, start + 1);
    }
  }

  return output;
}

export function textToLocalEmbedding(text: string, dimensions = 64) {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = tokenize(text);

  for (const token of tokens) {
    let hash = 0;
    for (let index = 0; index < token.length; index += 1) {
      hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
    }
    vector[hash % dimensions] += 1;
  }

  return normalize(vector);
}

export function cosineSimilarity(left: number[], right: number[]) {
  return left.reduce((total, value, index) => total + value * (right[index] ?? 0), 0);
}

export function retrieveRelevantChunks({
  question,
  documentId,
  topK = 5,
}: {
  question: string;
  documentId?: string;
  topK?: number;
}): RetrievalResult[] {
  const queryEmbedding = textToLocalEmbedding(question);
  const queryTokens = new Set(tokenize(question));
  const candidateChunks = documentId
    ? chunks.filter((chunk) => chunk.documentId === documentId)
    : chunks;

  return candidateChunks
    .map((chunk) => {
      const document = documents.find((item) => item.id === chunk.documentId);
      const vectorSimilarity = cosineSimilarity(
        queryEmbedding,
        textToLocalEmbedding(chunk.content),
      );
      const chunkTokens = new Set(tokenize(chunk.content));
      const overlap =
        [...queryTokens].filter((token) => chunkTokens.has(token)).length /
        Math.max(queryTokens.size, 1);
      const similarity = vectorSimilarity * 0.65 + overlap * 0.35;

      return {
        documentId: chunk.documentId,
        documentTitle: document?.title ?? "Unknown document",
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        contentPreview: chunk.content,
        content: chunk.content,
        similarity,
      };
    })
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, topK);
}

export function buildGroundedAnswer(question: string, results: RetrievalResult[]) {
  if (!results.length) {
    return `没有在当前知识库中找到足够相关的内容来回答：“${question}”。`;
  }

  const pages = Array.from(new Set(results.map((result) => result.pageNumber))).join(
    ", ",
  );

  return `根据检索到的论文片段，问题“${question}”可以从第 ${pages} 页的内容回答：RAG 先检索相关 chunk，再把这些 chunk 作为上下文交给生成模型，因此回答可以附带文档、页码和 chunk 来源。当前版本使用本地模拟 embedding，接入真实 embedding 后会保留同样的数据流。`;
}

export function runLocalEvaluation(): EvalCase[] {
  return evalCases.map((item) => {
    const results = retrieveRelevantChunks({ question: item.question, topK: 5 });
    const retrievedPages = results.map((result) => result.pageNumber);
    const answer = buildGroundedAnswer(item.question, results).toLowerCase();

    const recallAt5 = item.expectedSourcePages.length
      ? item.expectedSourcePages.some((page) => retrievedPages.includes(page))
      : false;
    const citationHit = item.expectedSourcePages.length
      ? item.expectedSourcePages.some((page) =>
          retrievedPages.slice(0, 3).includes(page),
        )
      : false;
    const keywordMatch = item.expectedKeywords.some((keyword) =>
      answer.includes(keyword.toLowerCase()),
    );

    return {
      ...item,
      recallAt5,
      citationHit,
      keywordMatch,
    };
  });
}

function normalize(vector: number[]) {
  const magnitude = Math.sqrt(
    vector.reduce((total, value) => total + value * value, 0),
  );

  if (magnitude === 0) return vector;
  return vector.map((value) => value / magnitude);
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}
