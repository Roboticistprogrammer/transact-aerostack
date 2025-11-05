import { DashboardLayout } from "@/components/DashboardLayout";

const Orders = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground mt-2">
          Manage delivery orders and tracking
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
