import { DashboardLayout } from "@/components/DashboardLayout";

const Warehouse = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Warehouse Operations</h2>
        <p className="text-muted-foreground mt-2">
          Monitor warehouse status and operations
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Warehouse;
