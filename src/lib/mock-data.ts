export type DocumentStatus =
  | "uploaded"
  | "parsing"
  | "parsed"
  | "indexed"
  | "failed";

export type PaperDocument = {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  status: DocumentStatus;
  pages: number;
  chunks: number;
  uploadedAt: string;
  ownerEmail: string;
  summary: string;
};

export type Chunk = {
  id: string;
  documentId: string;
  pageNumber: number;
  chunkIndex: number;
  content: string;
  similarity: number;
};

export type Source = {
  documentTitle: string;
  documentId: string;
  pageNumber: number;
  chunkIndex: number;
  contentPreview: string;
  similarity: number;
};

export type EvalCase = {
  id: string;
  question: string;
  expectedKeywords: string[];
  expectedSourcePages: number[];
  recallAt5: boolean;
  citationHit: boolean;
  keywordMatch: boolean;
  latencyMs: number;
};

export const documents: PaperDocument[] = [
  {
    id: "paper-rag-survey",
    title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP",
    fileName: "rag_for_knowledge_intensive_nlp.pdf",
    fileSize: "2.4 MB",
    status: "indexed",
    pages: 18,
    chunks: 84,
    uploadedAt: "2026-07-05 19:20",
    ownerEmail: "student@example.com",
    summary:
      "介绍 RAG 如何把参数化生成模型与非参数化检索记忆结合，用于开放域问答、事实核验和知识密集型任务。",
  },
  {
    id: "TUFI",
    title: "TRY TO LEARN",
    fileName: "DAY2",
    fileSize: "211111 MB",
    status: "indexed",
    pages: 666,
    chunks: 666,
    uploadedAt: "2026-07-07 19:20",
    ownerEmail: "1819857409@qq.com",
    summary:
      "介绍 TUFI是怎么学习前端的。",
  },
  {
    id: "paper-colbert",
    title: "ColBERT: Efficient and Effective Passage Search",
    fileName: "colbert_late_interaction.pdf",
    fileSize: "1.8 MB",
    status: "parsed",
    pages: 12,
    chunks: 47,
    uploadedAt: "2026-07-05 18:42",
    ownerEmail: "student@example.com",
    summary:
      "提出 late interaction 检索结构，在效率和准确率之间取得平衡，适合作为 RAG 检索层的候选升级方向。",
  },
  {
    id: "paper-ocr-scan",
    title: "Scanned Paper OCR Notes",
    fileName: "ocr_scan_notes.pdf",
    fileSize: "6.9 MB",
    status: "failed",
    pages: 0,
    chunks: 0,
    uploadedAt: "2026-07-05 17:31",
    ownerEmail: "student@example.com",
    summary:
      "扫描版 PDF 暂未接 OCR，解析失败会保留错误状态，并允许后续接入 OCR 管线后重新索引。",
  },
];

export const chunks: Chunk[] = [
  {
    id: "chunk-1",
    documentId: "paper-rag-survey",
    pageNumber: 2,
    chunkIndex: 7,
    similarity: 0.91,
    content:
      "RAG combines a parametric seq2seq generator with a dense vector index of Wikipedia passages. The retriever selects top passages and the generator conditions on them to produce answers with grounded evidence.",
  },
  {
    id: "chunk-2",
    documentId: "paper-rag-survey",
    pageNumber: 3,
    chunkIndex: 11,
    similarity: 0.88,
    content:
      "The retrieval component can be trained end-to-end with the generator. Retrieved documents act as non-parametric memory, making updates possible without retraining the full language model.",
  },
  {
    id: "chunk-3",
    documentId: "paper-rag-survey",
    pageNumber: 8,
    chunkIndex: 38,
    similarity: 0.82,
    content:
      "Experiments evaluate open-domain question answering, abstractive generation, and fact verification. The system improves factuality when relevant passages are retrieved successfully.",
  },
  {
    id: "chunk-1",
    documentId: "TUFI",
    pageNumber: 2,
    chunkIndex: 7,
    similarity: 0.91,
    content:
      "加油加油",
  },
  {
    id: "chunk-4",
    documentId: "paper-colbert",
    pageNumber: 4,
    chunkIndex: 14,
    similarity: 0.79,
    content:
      "ColBERT independently encodes query and document tokens and applies late interaction via MaxSim. This keeps expressive token-level matching while enabling offline document indexing.",
  },
  {
    id: "chunk-5",
    documentId: "paper-colbert",
    pageNumber: 9,
    chunkIndex: 36,
    similarity: 0.74,
    content:
      "The late interaction design allows scalable passage retrieval and can serve as a reranking or retrieval layer for applications that need stronger source grounding.",
  },
];

export const sources: Source[] = chunks.slice(0, 3).map((chunk) => ({
  documentId: chunk.documentId,
  documentTitle:
    documents.find((document) => document.id === chunk.documentId)?.title ??
    "Unknown document",
  pageNumber: chunk.pageNumber,
  chunkIndex: chunk.chunkIndex,
  contentPreview: chunk.content,
  similarity: chunk.similarity,
}));

export const evalCases: EvalCase[] = [
  {
    id: "eval-1",
    question: "RAG 的核心思想是什么？",
    expectedKeywords: ["retriever", "generator", "non-parametric memory"],
    expectedSourcePages: [2, 3],
    recallAt5: true,
    citationHit: true,
    keywordMatch: true,
    latencyMs: 1320,
  },
  {
    id: "eval-2",
    question: "为什么引用来源对论文问答重要？",
    expectedKeywords: ["grounded", "evidence", "factuality"],
    expectedSourcePages: [8],
    recallAt5: true,
    citationHit: true,
    keywordMatch: true,
    latencyMs: 1184,
  },
  {
    id: "eval-3",
    question: "ColBERT 的 late interaction 有什么价值？",
    expectedKeywords: ["token-level", "MaxSim", "offline indexing"],
    expectedSourcePages: [4, 9],
    recallAt5: true,
    citationHit: false,
    keywordMatch: true,
    latencyMs: 1498,
  },
  {
    id: "eval-4",
    question: "扫描版 PDF 为什么会解析失败？",
    expectedKeywords: ["OCR", "scanned", "parsing"],
    expectedSourcePages: [],
    recallAt5: false,
    citationHit: false,
    keywordMatch: false,
    latencyMs: 842,
  },
  {
    id: "eval-5",
    question: "为什么会失败？",
    expectedKeywords: ["OCR", "scanned", "parsing"],
    expectedSourcePages: [],
    recallAt5: false,
    citationHit: false,
    keywordMatch: false,
    latencyMs: 842,
  },
];

export const statusMeta: Record<
  DocumentStatus,
  { label: string; className: string; description: string }
> = {
  uploaded: {
    label: "已上传",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
    description: "等待解析",
  },
  parsing: {
    label: "解析中",
    className: "bg-amber-50 text-amber-800 ring-amber-200",
    description: "正在提取文本",
  },
  parsed: {
    label: "已解析",
    className: "bg-teal-50 text-teal-800 ring-teal-200",
    description: "等待向量化",
  },
  indexed: {
    label: "已索引",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    description: "可用于问答",
  },
  failed: {
    label: "失败",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    description: "需要重试或 OCR",
  },
};

export function getDocument(id: string) {
  return documents.find((document) => document.id === id);
}

export function getChunksByDocument(id: string) {
  return chunks.filter((chunk) => chunk.documentId === id);
}
