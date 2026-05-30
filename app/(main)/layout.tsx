import { Navbar } from "@/components/nav/navbar";
import { DenDenMushi } from "@/components/ai/den-den-mushi";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#080c14] starfield">
      <Navbar profile={null} />
      <main className="pt-16">
        {children}
      </main>
      <DenDenMushi />
    </div>
  );
}
