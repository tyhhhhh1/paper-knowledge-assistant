import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TUFI 论文助手",
  description: "上传 PDF，解析切块，向量检索，并基于引用来源回答论文问题。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
