import { AuthGuard } from "@/components/dashboard/AuthGuard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DemoBanner } from "@/components/dashboard/DemoBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative min-h-screen">
        {/* Subtle grid background for the whole dashboard */}
        <div className="pointer-events-none fixed inset-0 bg-grid-faint [background-size:60px_60px]" />

        <Sidebar />

        <div className="ml-[240px]">
          <DemoBanner />
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
