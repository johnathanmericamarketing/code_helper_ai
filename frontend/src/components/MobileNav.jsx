import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FolderKanban, LayoutTemplate, Palette, ImageIcon,
  Layers3, Link2, Settings, X, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// ── Nav items — mirrors desktop Sidebar ──────────────────────────────────────
const navItems = [
  { to: '/app/projects',    icon: FolderKanban,   label: 'Projects'     },
  { to: '/app/studio',      icon: LayoutTemplate, label: 'Studio'       },
  { to: '/app/brand',       icon: Palette,        label: 'Brand'        },
  { to: '/app/assets',      icon: ImageIcon,      label: 'Assets'       },
  { to: '/app/versions',    icon: Layers3,        label: 'Versions'     },
  { to: '/app/connections', icon: Link2,          label: 'Connections'  },
  { to: '/app/settings',    icon: Settings,       label: 'Settings'     },
];

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">

          {/* Logo */}
          <SheetHeader className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-sm">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <div>
                <SheetTitle className="text-[15px] font-bold text-foreground leading-tight">Code Helper AI</SheetTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Website workspace</p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer info */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-2xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1">Safe by Default</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All AI changes are previewed before going live.
              </p>
            </div>
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
};
