import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceSelector from '@components/device-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Package, Plus, Minus, RefreshCw, Video } from 'lucide-react';
import { TransitiveCapability } from '@transitive-sdk/utils-web';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location: string;
}

// Mock inventory data
const mockInventoryData: InventoryItem[] = [
  { id: '1', name: 'Battery Pack', quantity: 25, category: 'Power', status: 'in-stock', location: 'Warehouse A1' },
  { id: '2', name: 'Propellers', quantity: 8, category: 'Parts', status: 'low-stock', location: 'Warehouse B2' },
  { id: '3', name: 'GPS Module', quantity: 0, category: 'Electronics', status: 'out-of-stock', location: 'Warehouse C3' },
  { id: '4', name: 'Camera Gimbal', quantity: 15, category: 'Electronics', status: 'in-stock', location: 'Warehouse A2' },
  { id: '5', name: 'Delivery Container', quantity: 45, category: 'Accessories', status: 'in-stock', location: 'Warehouse D1' },
  { id: '6', name: 'Sensors', quantity: 3, category: 'Electronics', status: 'low-stock', location: 'Warehouse B1' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-stock': return 'bg-green-100 text-green-800';
    case 'low-stock': return 'bg-yellow-100 text-yellow-800';
    case 'out-of-stock': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function InventorySection() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData);

  const updateQuantity = (id: string, delta: number) => {
    setInventoryData(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        let newStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
        
        if (newQuantity === 0) newStatus = 'out-of-stock';
        else if (newQuantity < 10) newStatus = 'low-stock';
        
        return { ...item, quantity: newQuantity, status: newStatus };
      }
      return item;
    }));
  };

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="w-full flex-1">
          <DeviceSelector deviceId={deviceId} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-lg font-semibold md:text-2xl">Inventory Management</h1>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inventoryData.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                <Badge className={getStatusColor(item.status)}>
                  {item.status.replace('-', ' ')}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.quantity}</div>
                <p className="text-xs text-muted-foreground mb-2">
                  {item.category} • {item.location}
                </p>
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {inventoryData.filter(item => item.status === 'in-stock').length}
                  </div>
                  <p className="text-xs text-muted-foreground">In Stock</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {inventoryData.filter(item => item.status === 'low-stock').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Low Stock</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {inventoryData.filter(item => item.status === 'out-of-stock').length}
                  </div>
                  <p className="text-xs text-muted-foreground">Out of Stock</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                <CardTitle>Drone Feed</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                <TransitiveCapability 
                  jwt="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFtaXJzYWxhciIsImRldmljZSI6ImRfOTI5MWI0YjVhMyIsImNhcGFiaWxpdHkiOiJAdHJhbnNpdGl2ZS1yb2JvdGljcy93ZWJydGMtdmlkZW8iLCJ2YWxpZGl0eSI6ODY0MDAsImlhdCI6MTc1ODQ4MTE5OH0.H4EbNA_z88CqcEA4tlRygihz_q_zD0rTyTAGOs-a1ME"
                  count="1"
                  framerate="30/1"
                  height="480"
                  quantizer="30"
                  source="/dev/video0"
                  streamtype="video/x-raw"
                  timeout="1800"
                  type="v4l2src"
                  width="640"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Live video feed from drone camera • Device: d_9291b4b5a3
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Extra padding at bottom to ensure content is accessible */}
        <div className="pb-8"></div>
      </main>
    </>
  );
}