import { AppShell } from "@/components/app-shell";
import { ChatWorkspace } from "@/components/chat-workspace";
import { requireUser } from "@/lib/auth";

export default async function ChatPage() {
  const user = await requireUser();

  return (
    <AppShell
      title="论文问答"
      description="这个页面现在是受保护页面：只有 Supabase 登录用户能访问。问答数据仍先使用 mock RAG。"
      userEmail={user.email}
    >
      <ChatWorkspace />
    </AppShell>
  );
}
