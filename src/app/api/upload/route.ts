import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing PDF file." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Only application/pdf is supported." },
      { status: 415 },
    );
  }

  return NextResponse.json({
    document: {
      id: `mock-${Date.now()}`,
      title: file.name.replace(/\.pdf$/i, ""),
      fileName: file.name,
      fileSize: file.size,
      status: "uploaded",
    },
  });
}
