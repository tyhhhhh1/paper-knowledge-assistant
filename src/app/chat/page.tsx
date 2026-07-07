import { AppShell } from "@/components/app-shell";
import { ChatWorkspace } from "@/components/chat-workspace";

export default function ChatPage() {
  return (
    <AppShell
      title="论文问答"
      description="模拟 query embedding、向量检索、prompt 组装和带引用来源回答。下一阶段将把这些动作替换为真实 API。"
    >
      <ChatWorkspace />
    </AppShell>
  );
}
