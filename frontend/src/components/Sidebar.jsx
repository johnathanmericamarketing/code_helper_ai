import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileCode2, LayoutDashboard, History, Settings, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/create', icon: FileCode2, label: 'New Request' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  return (
    <div className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FileCode2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">CodeGen AI</h1>
            <p className="text-xs text-muted-foreground">Internal Tool</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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
  );
};
