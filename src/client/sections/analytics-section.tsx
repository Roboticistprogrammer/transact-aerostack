import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DeviceSelector from '@components/device-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Badge } from '@components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';

export function AnalyticsSection() {
  const { deviceId } = useParams();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock analytics data
  const metrics = {
    totalOrders: 156,
    completedOrders: 142,
    orderCompletionRate: 91,
    avgOrderTime: '2.3h',
    inventoryTurnover: 4.2,
    lowStockAlerts: 8,
    droneUtilization: 78,
    deliveryAccuracy: 98.5
  };

  const trends = [
    { label: 'Orders', value: '+12%', trend: 'up', color: 'text-green-600' },
    { label: 'Inventory Turnover', value: '+5.3%', trend: 'up', color: 'text-green-600' },
    { label: 'Avg Delivery Time', value: '-8%', trend: 'down', color: 'text-green-600' },
    { label: 'Low Stock Items', value: '+3', trend: 'up', color: 'text-red-600' },
  ];

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="w-full flex-1">
          <DeviceSelector deviceId={deviceId} onChange={() => {}} capabilityId="" />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <h1 className="text-lg font-semibold md:text-2xl">Analytics & Reports</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Order Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.orderCompletionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.completedOrders} of {metrics.totalOrders} orders
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Time</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.avgOrderTime}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per order fulfillment
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.inventoryTurnover}x</div>
              <p className="text-xs text-muted-foreground mt-1">
                Times per year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Drone Utilization</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.droneUtilization}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {trends.map((trend) => (
                <div key={trend.label} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{trend.label}</p>
                    {trend.trend === 'up' ? (
                      <TrendingUp className={`h-4 w-4 ${trend.color}`} />
                    ) : (
                      <TrendingDown className={`h-4 w-4 ${trend.color}`} />
                    )}
                  </div>
                  <p className={`text-2xl font-bold ${trend.color}`}>
                    {trend.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Charts Placeholder */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chart visualization</p>
                  <p className="text-sm">Connect to analytics API</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Chart visualization</p>
                  <p className="text-sm">Connect to analytics API</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forecasts */}
        <Card>
          <CardHeader>
            <CardTitle>Forecasting & Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Inventory Forecast</h4>
                    <p className="text-sm text-muted-foreground">
                      Based on current trends, expect increased demand for Electronics category next month
                    </p>
                  </div>
                  <Badge variant="outline">Recommendation</Badge>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium mb-1">Optimization Opportunity</h4>
                    <p className="text-sm text-muted-foreground">
                      Zone C3 utilization at 85% - consider redistributing to optimize space
                    </p>
                  </div>
                  <Badge variant="outline">Optimization</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
