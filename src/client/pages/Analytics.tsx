import { DashboardLayout } from "@/components/DashboardLayout";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground mt-2">
          Performance metrics and insights
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
