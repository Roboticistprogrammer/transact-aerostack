import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Package, TrendingUp, Boxes } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import droneIcon from "@/assets/drone-icon.png";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Real-time insights for your drone logistics operations
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Drones"
            value="24"
            change="+2 from last week"
            customIcon={droneIcon}
          />
          <StatCard
            title="Pending Orders"
            value="156"
            change="+12% from yesterday"
            icon={Package}
          />
          <StatCard
            title="Deliveries Today"
            value="89"
            change="+23% from yesterday"
            icon={TrendingUp}
          />
          <StatCard
            title="Warehouse Items"
            value="2,847"
            change="-5% from last month"
            icon={Boxes}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Drone #DX-042 Deployed</p>
                    <p className="text-xs text-muted-foreground">Warehouse A → Location B</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="text-sm font-medium">Order #ORD-8392 Completed</p>
                    <p className="text-xs text-muted-foreground">Delivered successfully</p>
                  </div>
                  <span className="text-xs text-muted-foreground">15 min ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Inventory Updated</p>
                    <p className="text-xs text-muted-foreground">+127 items added</p>
                  </div>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Computer Vision</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Route Planning</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fleet Management</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    <span className="text-xs text-muted-foreground">Operational</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Warehouse Integration</span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                    <span className="text-xs text-muted-foreground">Syncing</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
