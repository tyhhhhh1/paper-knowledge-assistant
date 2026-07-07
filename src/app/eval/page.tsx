import { AppShell } from "@/components/app-shell";
import { EvalDashboard } from "@/components/eval-dashboard";

export default function EvalPage() {
  return (
    <AppShell
      title="评估集"
      description="基础评估帮助你在 README 和面试里讲清楚：检索是否命中、引用是否可靠、回答是否覆盖关键点。"
    >
      <EvalDashboard />
    </AppShell>
  );
}
