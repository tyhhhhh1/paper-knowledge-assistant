"use client";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, CheckCircle2, FileUp, Loader2, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatBytes } from "@/lib/utils";

type UploadState = "idle" | "ready" | "uploading" | "done" | "error";

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("选择 PDF 后会模拟上传和索引状态。");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      setFile(null);
      setState("idle");
      setMessage("选择 PDF 后会模拟上传和索引状态。");
      return;
    }

    if (nextFile.type !== "application/pdf") {
      setFile(nextFile);
      setState("error");
      setProgress(0);
      setMessage("当前只支持 PDF 文件。");
      return;
    }

    setFile(nextFile);
    setState("ready");
    setProgress(0);
    setMessage("文件已就绪，可以开始上传。");
  }

  async function startUpload() {
  if (!file || state === "uploading") return;

  setState("uploading");
  setProgress(10);
  setMessage("正在确认登录状态...");

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("current user:", user);

  if (userError || !user) {
    setState("error");
    setMessage("请先登录后再上传。");
    return;
  }

  const filePath = `${user.id}/${Date.now()}-${file.name}`;

  setProgress(45);
  setMessage("正在上传 PDF 到 Storage...");

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("papers")
    .upload(filePath, file);

  console.log("uploadData:", uploadData);

  if (uploadError) {
    setState("error");
    setMessage(uploadError.message);
    return;
  }
  setProgress(75);
setMessage("正在写入 documents 记录...");

const { data: documentData, error: insertError } = await supabase
  .from("documents")
  .insert({
    user_id: user.id,
    title: file.name.replace(/\.pdf$/i, ""),
    file_url: filePath,
    status: "uploaded",
  })
  .select()
  .single();

console.log("documentData:", documentData);
console.log("insertError:", insertError);

if (insertError) {
  setState("error");
  setMessage(`PDF 已上传，但文档记录创建失败：${insertError.message}`);
  return;
}

setState("done");
setProgress(100);
setMessage("PDF 已上传，文档记录已创建。");

  setState("done");
  setProgress(100);
  setMessage("PDF 已上传到 Supabase Storage。");
}

  const isError = state === "error";

  return (
    <section className="rounded-md border border-[var(--line)] bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-zinc-950">
            <UploadCloud size={19} aria-hidden="true" />
            上传论文 PDF
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            当前仍是前端模拟上传；后续会替换为真实 Storage、PDF 解析和 embedding 写入。
          </p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--line)] bg-white px-3 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50">
          <FileUp size={17} aria-hidden="true" />
          选择文件
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>

      <div className="mt-5 rounded-md border border-dashed border-[var(--line)] bg-zinc-50 p-4">
        {file ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-medium text-zinc-950">{file.name}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatBytes(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={startUpload}
              disabled={isError || state === "uploading" || state === "done"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[var(--teal)] px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
            >
              {state === "uploading" ? (
                <Loader2 className="animate-spin" size={17} aria-hidden="true" />
              ) : state === "done" ? (
                <CheckCircle2 size={17} aria-hidden="true" />
              ) : (
                <UploadCloud size={17} aria-hidden="true" />
              )}
              {state === "done" ? "已完成" : "开始上传"}
            </button>
          </div>
        ) : (
          <p className="text-sm text-[var(--muted)]">
            还没有选择文件。你可以先用任意 PDF 测试上传 UI。
          </p>
        )}

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white ring-1 ring-[var(--line)]">
          <div
            className="h-full rounded-full bg-[var(--teal)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p
          className={`mt-3 flex items-center gap-2 text-sm ${
            isError ? "text-[var(--rose)]" : "text-[var(--muted)]"
          }`}
        >
          {isError ? (
            <AlertCircle size={16} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} aria-hidden="true" />
          )}
          {message}
        </p>
      </div>
    </section>
  );
}
