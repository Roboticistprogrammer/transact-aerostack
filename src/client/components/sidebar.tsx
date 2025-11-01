import React, { useContext } from 'react';
import _ from 'lodash';

import { Link, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from '@components/ui/button'
import { ScrollArea } from '@components/ui/scroll-area';
import { ModeToggle } from '@components/ui/mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@components/ui/dropdown-menu';
import { Bot, CircleUser, LayoutDashboard, Package, ShoppingCart, MapPin, BarChart3 } from 'lucide-react';
import { UserContext } from '@components/user-context';
import { getLogger} from '@transitive-sdk/utils-web';
import { Capability } from '@models/device';
import { capabilities } from '@config/config';

const log = getLogger('Sidebar');
log.setLevel('debug');

/** Creates a button linking to the provided `to` link. Highlights the button
* when current location matches that link. */
const PageLink = ({ section }) => {
  const location = useLocation();
  const to = `/dashboard${section.route}`;
  return (
    <Link className={'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary w-full '
      + buttonVariants({ variant: location.pathname.includes(to) ? 'secondary' : 'ghost' })} to={to}>
      <section.icon/>
      <span className='grow text-left'>{section.displayName}</span>
    </Link>
  );
};

export function Sidebar(){
  const {session, logout} = useContext(UserContext);
  return (
    <div className='h-full flex-col gap-2 border-r bg-muted/40 flex max-h-screen'>
      <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 gap-4 font-semibold'>
        <img src='/dronex_logo.jpg' className='h-11 w-11 rounded-full object-cover' />
        <div>
          {/* <div>DroneX Delivery Solutions</div>
          <div className='text-xs text-muted-foreground '>Aerostack</div> */}
          <div className='text-xs text-muted-foreground font-normal'>DroneX Delivery Solutions</div>
          <div style={{fontSize: '1.4rem', lineHeight: '1rem' }}>Aerostack</div>
        </div>
      </div>
      <ScrollArea className='grow grid items-start px-2 text-sm font-medium lg:px-4'>
        <PageLink section={{route: '/dashboard', icon: LayoutDashboard, displayName: 'Dashboard'}} key='dashboard-link' />
        <PageLink section={{route: '/devices', icon: Bot, displayName: 'Devices'}} key='devices-link' />
        <PageLink section={{route: '/inventory', icon: Package, displayName: 'Inventory'}} key='inventory-link' />
        <PageLink section={{route: '/orders', icon: ShoppingCart, displayName: 'Orders'}} key='orders-link' />
        <PageLink section={{route: '/warehouse', icon: MapPin, displayName: 'Warehouse'}} key='warehouse-link' />
        <PageLink section={{route: '/analytics', icon: BarChart3, displayName: 'Analytics'}} key='analytics-link' />
        {
          _.map(
            _.filter(capabilities, (capability: Capability) => capability.route && capability.id !== 'inventory-management'),
            (capability: Capability, capabilityId: string) =>
              <PageLink section={capability} key={capabilityId} />
            )
        }
      </ScrollArea>
      <ModeToggle/>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' size='icon' className='rounded-full ml-2 mb-2 lg:ml-4 lg:mb-4'>
            <CircleUser className='h-5 w-5' />
            <span className='sr-only'>Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          {session && session.user && <DropdownMenuLabel>{session.user}</DropdownMenuLabel>}
          <DropdownMenuSeparator />
          {session && session.user && <DropdownMenuItem>
            <Button variant='ghost' onClick={logout}>Logout</Button>
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}