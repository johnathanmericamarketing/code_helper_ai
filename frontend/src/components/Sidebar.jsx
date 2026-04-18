import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FileCode2, LayoutDashboard, History, Settings, BookOpen, Server, GitBranch, Crown, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/studio', icon: FileCode2, label: 'Workspace Studio' },
  { to: '/app/assets', icon: ImagePlus, label: 'Asset Studio' },
  { to: '/app/history', icon: History, label: 'History' },
  { to: '/app/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  { to: '/app/integrations', icon: GitBranch, label: 'Integrations' },
  { to: '/app/servers', icon: Server, label: 'Servers' },
  { to: '/app/settings', icon: Settings, label: 'Settings' },
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
      <div className="p-4 border-t border-border space-y-4">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs font-medium text-foreground mb-1">Safety First</p>
          <p className="text-xs text-muted-foreground">
            All code changes are validated before approval.
          </p>
        </div>
        <button
          onClick={() => {
            import('@/firebase').then(({ auth }) => {
              import('firebase/auth').then(({ signOut }) => {
                signOut(auth).then(() => window.location.href = '/');
              });
            });
          }}
          className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg font-medium text-red-500/80 hover:bg-red-500/10 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          <span className="truncate">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
