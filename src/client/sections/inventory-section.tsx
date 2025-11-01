import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeviceSelector from '@components/device-selector';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { 
  Package, 
  Plus, 
  Minus, 
  RefreshCw, 
  Video, 
  Search,
  Filter,
  ScanLine,
  AlertTriangle,
  Edit,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { TransitiveCapability } from '@transitive-sdk/utils-web';

interface InventoryItem {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  minQuantity: number;
  category: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location: string;
  lastUpdated: string;
}

// Mock inventory data
const mockInventoryData: InventoryItem[] = [
  { id: '1', name: 'Battery Pack', sku: 'BAT-001', quantity: 25, minQuantity: 10, category: 'Power', status: 'in-stock', location: 'Warehouse A1', lastUpdated: '2025-01-22T10:30:00' },
  { id: '2', name: 'Propellers', sku: 'PROP-002', quantity: 8, minQuantity: 10, category: 'Parts', status: 'low-stock', location: 'Warehouse B2', lastUpdated: '2025-01-22T09:15:00' },
  { id: '3', name: 'GPS Module', sku: 'GPS-003', quantity: 0, minQuantity: 5, category: 'Electronics', status: 'out-of-stock', location: 'Warehouse C3', lastUpdated: '2025-01-21T14:20:00' },
  { id: '4', name: 'Camera Gimbal', sku: 'CAM-004', quantity: 15, minQuantity: 5, category: 'Electronics', status: 'in-stock', location: 'Warehouse A2', lastUpdated: '2025-01-22T11:00:00' },
  { id: '5', name: 'Delivery Container', sku: 'CONT-005', quantity: 45, minQuantity: 20, category: 'Accessories', status: 'in-stock', location: 'Warehouse D1', lastUpdated: '2025-01-22T08:45:00' },
  { id: '6', name: 'Sensors', sku: 'SENS-006', quantity: 3, minQuantity: 10, category: 'Electronics', status: 'low-stock', location: 'Warehouse B1', lastUpdated: '2025-01-22T07:30:00' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function InventorySection() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(mockInventoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isBarcodeDialogOpen, setIsBarcodeDialogOpen] = useState(false);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);

  const updateQuantity = (id: string, delta: number) => {
    setInventoryData(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        let newStatus: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
        
        if (newQuantity === 0) newStatus = 'out-of-stock';
        else if (newQuantity < item.minQuantity) newStatus = 'low-stock';
        
        return { 
          ...item, 
          quantity: newQuantity, 
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return item;
    }));
  };

  const filteredItems = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(inventoryData.map(item => item.category)));
  const lowStockItems = inventoryData.filter(item => item.status === 'low-stock' || item.status === 'out-of-stock');

  return (
    <>
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="w-full flex-1">
          <DeviceSelector deviceId={deviceId} />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-lg font-semibold md:text-2xl">Inventory Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isBarcodeDialogOpen} onOpenChange={setIsBarcodeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ScanLine className="h-4 w-4 mr-2" />
                  Scan Barcode
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Barcode Scanner</DialogTitle>
                  <DialogDescription>
                    Scan or enter barcode to quickly locate items
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input placeholder="Enter barcode or scan..." className="text-lg" autoFocus />
                  <p className="text-sm text-muted-foreground mt-2">
                    Place cursor here and scan barcode, or type manually
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to the inventory system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input id="name" placeholder="Enter item name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input id="sku" placeholder="Enter SKU" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Warehouse location" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsAddItemDialogOpen(false)}>Add Item</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {viewMode === 'grid' ? 'Table View' : 'Grid View'}
            </Button>
          </div>
        </div>

        {/* Alert Banner for Low Stock */}
        {lowStockItems.length > 0 && (
          <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} need attention
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {lowStockItems.filter(i => i.status === 'out-of-stock').length} out of stock, {lowStockItems.filter(i => i.status === 'low-stock').length} low stock
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter('low-stock')}
                >
                  View Items
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryData.length}</div>
              <p className="text-xs text-muted-foreground">Unique SKUs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {inventoryData.filter(item => item.status === 'in-stock').length}
              </div>
              <p className="text-xs text-muted-foreground">Items available</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {inventoryData.filter(item => item.status === 'low-stock').length}
              </div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {inventoryData.filter(item => item.status === 'out-of-stock').length}
              </div>
              <p className="text-xs text-muted-foreground">Urgent action needed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, SKU, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Display */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex-1">
                    <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                    {item.sku && (
                      <p className="text-xs text-muted-foreground mt-1">SKU: {item.sku}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{item.quantity}</div>
                    <span className="text-xs text-muted-foreground">units</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Min: {item.minQuantity}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 mt-2">
                    {item.category} • {item.location}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity === 0}
                      className="flex-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Min Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground">{item.sku || '-'}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{item.minQuantity}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items found matching your filters</p>
              </div>
            </CardContent>
          </Card>
        )}
        
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