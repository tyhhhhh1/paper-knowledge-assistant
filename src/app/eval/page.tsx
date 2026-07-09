import { AppShell } from "@/components/app-shell";
import { EvalDashboard } from "@/components/eval-dashboard";
import { requireUser } from "@/lib/auth";

export default async function EvalPage() {
  const user = await requireUser();

  return (
    <AppShell
      title="评估集"
      description="基础评估帮助你讲清楚：检索是否命中、引用是否可靠、回答是否覆盖关键点。"
      userEmail={user.email}
    >
      <EvalDashboard />
    </AppShell>
  );
}
