import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { 
  Package, 
  PackageCheck, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  MapPin,
  ShoppingCart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { FleetContext } from '@components/fleet-context';
import { useNavigate } from 'react-router-dom';
import { Device } from '@models/device';

export function DashboardSection() {
  const { fleet } = useContext(FleetContext) as { fleet: Device[] };
  const navigate = useNavigate();

  // Mocked data for demonstration - replace with real data from API
  const stats = {
    totalInventory: 156,
    lowStockItems: 3,
    outOfStockItems: 1,
    activeDrones: fleet?.length || 0,
    totalOrders: 42,
    pendingOrders: 8,
    completedOrdersToday: 12,
    warehouseZones: 6
  };

  const recentActivity = [
    { id: 1, type: 'order', message: 'Order #1234 completed', time: '5 min ago', status: 'success' },
    { id: 2, type: 'inventory', message: 'Low stock alert: Propellers', time: '12 min ago', status: 'warning' },
    { id: 3, type: 'drone', message: 'Drone Alpha returned to dock', time: '18 min ago', status: 'info' },
    { id: 4, type: 'order', message: 'New inbound shipment received', time: '25 min ago', status: 'success' },
  ];

  const kpiCards = [
    {
      title: 'Total Inventory Items',
      value: stats.totalInventory,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      link: '/dashboard/inventory'
    },
    {
      title: 'Active Drones',
      value: stats.activeDrones,
      change: fleet?.length ? 'Online' : 'Offline',
      trend: 'up',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      link: '/dashboard/devices'
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      change: '-3',
      trend: 'down',
      icon: ShoppingCart,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      link: '/dashboard/orders'
    },
    {
      title: 'Low Stock Alerts',
      value: stats.lowStockItems + stats.outOfStockItems,
      change: '2 new',
      trend: 'up',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      link: '/dashboard/inventory'
    }
  ];

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        </div>
      </header>
      
      <main className="flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6 overflow-y-auto">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((kpi) => (
            <Card 
              key={kpi.title} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(kpi.link)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`${kpi.bgColor} ${kpi.color} p-2 rounded-lg`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {kpi.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {kpi.change}
                  </span>
                  <span className="ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Quick Actions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/dashboard/inventory')}
              >
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/dashboard/orders')}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/dashboard/warehouse')}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Warehouse Layout
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => navigate('/dashboard/devices')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Fleet Status
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.status === 'success' ? 'bg-green-100 dark:bg-green-900/20 text-green-600' :
                      activity.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600' :
                      'bg-blue-100 dark:bg-blue-900/20 text-blue-600'
                    }`}>
                      {activity.type === 'order' && <PackageCheck className="h-4 w-4" />}
                      {activity.type === 'inventory' && <Package className="h-4 w-4" />}
                      {activity.type === 'drone' && <Activity className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fleet Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Fleet Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {fleet && fleet.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fleet.slice(0, 6).map((device) => (
                  <Link
                    key={device.id}
                    to={`/dashboard/devices/${device.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.capabilities.length} capabilities</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">
                      Active
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active drones in the fleet</p>
                <p className="text-sm mt-2">Add devices to get started</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalInventory - stats.lowStockItems - stats.outOfStockItems}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Items available</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.lowStockItems}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Items need attention</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.outOfStockItems}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Requires immediate action</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
