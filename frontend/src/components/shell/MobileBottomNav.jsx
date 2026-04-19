import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileCode2, History, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const bottomItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Projects' },
  { to: '/app/studio', icon: FileCode2, label: 'Studio' },
  { to: '/app/versions', icon: History, label: 'Versions' },
];

const moreItems = [
  { to: '/app/brand', label: 'Brand' },
  { to: '/app/assets', label: 'Assets' },
  { to: '/app/connections', label: 'Connections' },
  { to: '/app/settings', label: 'Settings' },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-surface border-t border-subtle flex items-center justify-around px-2 py-2 pb-safe z-50">
      {bottomItems.map((item) => {
        const isActive = item.to === '/app'
          ? location.pathname === '/app'
          : location.pathname.startsWith(item.to);
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all',
              isActive
                ? 'text-[var(--accent-600)] font-semibold'
                : 'text-muted-custom hover:bg-muted-custom'
            )}
          >
            <Icon className={cn("w-5 h-5 mb-1", isActive && "text-[var(--accent-600)]")} />
            <span className="text-[10px]">{item.label}</span>
          </NavLink>
        );
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all',
              moreItems.some(mi => location.pathname.startsWith(mi.to))
                ? 'text-[var(--accent-600)] font-semibold'
                : 'text-muted-custom hover:bg-muted-custom'
            )}
          >
            <MoreHorizontal className="w-5 h-5 mb-1" />
            <span className="text-[10px]">More</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 shadow-lg border-subtle mb-2">
          {moreItems.map(item => (
            <DropdownMenuItem key={item.to} asChild>
              <NavLink to={item.to} className="cursor-pointer font-medium py-2.5">
                {item.label}
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
