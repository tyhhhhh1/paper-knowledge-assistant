import { NextResponse } from "next/server";
import { documents } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({
    userId: "mock-user-001",
    documents,
  });
}
