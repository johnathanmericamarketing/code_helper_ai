import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileCode2, LayoutDashboard, History, Settings, BookOpen, Server, GitBranch, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/create', icon: FileCode2, label: 'New Request' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/integrations', icon: GitBranch, label: 'Integrations' },
  { to: '/servers', icon: Server, label: 'Servers' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    getUserProfile()
      .then(p => setIsAdmin(p?.role === 'super_admin'))
      .catch(() => {});
  }, [currentUser]);

  return (
    <div className="hidden md:flex w-64 bg-card border-r border-border h-screen flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <FileCode2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Code Helper</h1>
            <p className="text-xs text-muted-foreground">AI Studio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
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

        {/* Super Admin Link — only visible to admins */}
        {isAdmin && (
          <>
            <div className="pt-3 pb-1 px-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin</p>
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all',
                  isActive
                    ? 'bg-yellow-500/20 text-yellow-600 shadow-md'
                    : 'text-yellow-600/70 hover:bg-yellow-500/10 hover:text-yellow-600'
                )
              }
            >
              <Crown className="w-5 h-5" />
              <span>Super Admin</span>
            </NavLink>
          </>
        )}
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
