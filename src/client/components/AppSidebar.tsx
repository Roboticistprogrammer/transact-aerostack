import { LayoutDashboard, Package, ShoppingCart, Warehouse, BarChart3, Box } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import dronexLogo from "@/assets/dronex-logo.jpg";
const menuItems = [{
  title: "Dashboard",
  url: "/",
  icon: LayoutDashboard
}, {
  title: "Inventory",
  url: "/inventory",
  icon: Package
}, {
  title: "Orders",
  url: "/orders",
  icon: ShoppingCart
}, {
  title: "Warehouse",
  url: "/warehouse",
  icon: Warehouse
}, {
  title: "Analytics",
  url: "/analytics",
  icon: BarChart3
}, {
  title: "Product",
  url: "/product",
  icon: Box
}];
export function AppSidebar() {
  return <Sidebar>
      <SidebarContent>
        <div className="px-6 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center overflow-hidden">
              <img src={dronexLogo} alt="DroneX Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground tracking-tight">Aerostack</p>
              <p className="text-xs font-semibold text-muted-foreground/80 tracking-wide">DroneX Delivery Solutions</p>
            </div>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === "/"} className={({
                  isActive
                }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/50"}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-4 py-2">
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>;
}