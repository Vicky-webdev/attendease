import { Header } from "@/components/layout/header";
import { ClockWidget } from "@/components/dashboard/clock-widget";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TeamActivity } from "@/components/dashboard/team-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default function DashboardPage() {
  return (
    <div className="max-w-4xl">
      <Header />
      <ClockWidget />
      <StatsGrid />
      <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4">
        <TeamActivity />
        <QuickActions />
      </div>
    </div>
  );
}
