import { DashboardLayout } from "@/components/DashboardLayout";

const Inventory = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
        <p className="text-muted-foreground mt-2">
          Track and manage warehouse inventory
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
