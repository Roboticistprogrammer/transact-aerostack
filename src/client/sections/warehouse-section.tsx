import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceSelector from '@components/device-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { MapPin, Warehouse, Search, Layers, Package } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WarehouseZone {
  id: string;
  name: string;
  type: 'storage' | 'receiving' | 'shipping' | 'office';
  bounds: [[number, number], [number, number]];
  center: [number, number];
  capacity: number;
  utilization: number;
  items: string[];
}

// Mock warehouse zones - adjust coordinates based on your actual warehouse location
const mockZones: WarehouseZone[] = [
  {
    id: 'A1',
    name: 'Zone A1 - Electronics',
    type: 'storage',
    bounds: [[37.450, -122.178], [37.452, -122.176]],
    center: [37.451, -122.177],
    capacity: 100,
    utilization: 65,
    items: ['Battery Pack', 'GPS Module', 'Camera Gimbal']
  },
  {
    id: 'B2',
    name: 'Zone B2 - Parts',
    type: 'storage',
    bounds: [[37.452, -122.178], [37.454, -122.176]],
    center: [37.453, -122.177],
    capacity: 80,
    utilization: 45,
    items: ['Propellers', 'Sensors']
  },
  {
    id: 'C3',
    name: 'Zone C3 - Accessories',
    type: 'storage',
    bounds: [[37.454, -122.178], [37.456, -122.176]],
    center: [37.455, -122.177],
    capacity: 120,
    utilization: 85,
    items: ['Delivery Container']
  },
  {
    id: 'DOCK',
    name: 'Loading Dock',
    type: 'receiving',
    bounds: [[37.448, -122.180], [37.450, -122.178]],
    center: [37.449, -122.179],
    capacity: 50,
    utilization: 30,
    items: []
  }
];

const getZoneColor = (type: string) => {
  switch (type) {
    case 'storage': return 'blue';
    case 'receiving': return 'green';
    case 'shipping': return 'orange';
    case 'office': return 'purple';
    default: return 'gray';
  }
};

export function WarehouseSection() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState<WarehouseZone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredZones = mockZones.filter(zone =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    zone.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalUtilization = mockZones.reduce((sum, zone) => sum + zone.utilization, 0) / mockZones.length;

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
            <MapPin className="h-6 w-6" />
            <h1 className="text-lg font-semibold md:text-2xl">Warehouse Layout</h1>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Zones</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockZones.length}</div>
              <p className="text-xs text-muted-foreground">Active zones</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(totalUtilization)}%</div>
              <p className="text-xs text-muted-foreground">Space used</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Zones</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockZones.filter(z => z.type === 'storage').length}
              </div>
              <p className="text-xs text-muted-foreground">Active storage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Utilization</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {mockZones.filter(z => z.utilization > 80).length}
              </div>
              <p className="text-xs text-muted-foreground">Zones &gt; 80%</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Map View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Warehouse Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px] w-full rounded-lg overflow-hidden border">
                <MapContainer
                  center={[37.451, -122.177]}
                  zoom={17}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mockZones.map((zone) => (
                    <React.Fragment key={zone.id}>
                      <Rectangle
                        bounds={zone.bounds}
                        pathOptions={{
                          color: getZoneColor(zone.type),
                          fillColor: getZoneColor(zone.type),
                          fillOpacity: 0.2,
                          weight: 2
                        }}
                        eventHandlers={{
                          click: () => setSelectedZone(zone),
                          mouseover: (e) => {
                            const layer = e.target;
                            layer.setStyle({ fillOpacity: 0.4 });
                          },
                          mouseout: (e) => {
                            const layer = e.target;
                            layer.setStyle({ fillOpacity: 0.2 });
                          }
                        }}
                      />
                      <Marker position={zone.center}>
                        <Popup>
                          <div className="font-medium">{zone.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {zone.utilization}% utilized
                          </div>
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>

          {/* Zone List */}
          <Card>
            <CardHeader>
              <CardTitle>Warehouse Zones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredZones.map((zone) => (
                  <div
                    key={zone.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedZone?.id === zone.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedZone(zone)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium">{zone.name}</div>
                        <Badge variant="outline" className="mt-1">
                          {zone.type}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{zone.utilization}%</div>
                        <div className="text-xs text-muted-foreground">utilized</div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className={`bg-${getZoneColor(zone.type)}-600 h-2 rounded-full transition-all`}
                        style={{ width: `${zone.utilization}%` }}
                      />
                    </div>
                    {zone.items.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Items: {zone.items.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Zone Details */}
        {selectedZone && (
          <Card>
            <CardHeader>
              <CardTitle>Zone Details: {selectedZone.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium mb-1">Type</p>
                  <Badge>{selectedZone.type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Capacity</p>
                  <p className="text-lg font-bold">{selectedZone.capacity} units</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Utilization</p>
                  <p className="text-lg font-bold">{selectedZone.utilization}%</p>
                </div>
                {selectedZone.items.length > 0 && (
                  <div className="md:col-span-3">
                    <p className="text-sm font-medium mb-2">Items in Zone</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedZone.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}
