import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileCode2, LayoutDashboard, History, Settings, BookOpen, Server, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/create', icon: FileCode2, label: 'New Request' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/servers', icon: Server, label: 'Servers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
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
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <SheetHeader className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <FileCode2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">CodeGen AI</SheetTitle>
                <p className="text-xs text-muted-foreground">Internal Tool</p>
              </div>
            </div>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-medium text-foreground mb-1">Safety First</p>
              <p className="text-xs text-muted-foreground">
                All code changes are validated before approval.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
