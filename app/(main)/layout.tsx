import { ClientAuthGuard } from "@/components/auth/client-auth-guard";
import { LayoutShell } from "@/components/nav/layout-shell";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientAuthGuard>
      <LayoutShell>{children}</LayoutShell>
    </ClientAuthGuard>
  );
}
