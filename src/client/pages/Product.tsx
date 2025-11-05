import { DashboardLayout } from "@/components/DashboardLayout";

const Product = () => {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Product Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage product catalog and specifications
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Product;
