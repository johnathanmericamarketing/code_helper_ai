import React, { useState, useEffect } from 'react';
import { Bell, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile } from '@/lib/user-service';

const routeMeta = {
  '/app': { title: 'Projects', sub: 'Manage and select workspaces' },
  '/app/studio': { title: 'Workspace Studio', sub: 'Preview, modify, and review code safely' },
  '/app/brand': { title: 'Brand', sub: 'Design identity and logic rules' },
  '/app/assets': { title: 'Assets', sub: 'Generate & manage images' },
  '/app/versions': { title: 'Versions', sub: 'Compare and restore drafts' },
  '/app/connections': { title: 'Connections', sub: 'Hosting and Github' },
  '/app/settings': { title: 'Settings', sub: 'API keys & account preferences' },
};

export const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [cost, setCost] = useState(0);

  useEffect(() => {
    if (currentUser) {
      getUserProfile().then(p => {
        setCost(p?.usage_this_month?.cost_usd || 0);
      }).catch(err => console.error('Failed to load usage for header:', err));
    }
  }, [currentUser]);

  const meta = routeMeta[location.pathname] || { title: 'Workspace', sub: 'AI Studio' };
  const initials = (currentUser?.displayName || currentUser?.email || 'U')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleSignOut = () => {
    import('@/firebase').then(({ auth }) => {
      import('firebase/auth').then(({ signOut }) => {
        signOut(auth).then(() => navigate('/'));
      });
    });
  };

  return (
    <header className="h-16 border-b border-subtle bg-surface px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4">
        {/* Mobile nav trigger would go here if needed, but we use MobileBottomNav */}
        <div>
          <h2 className="text-base font-bold text-primary-custom leading-tight tracking-tight">{meta.title}</h2>
          <p className="text-[12px] text-muted-custom mt-0.5">{meta.sub}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden lg:flex items-center gap-1.5 h-9 rounded-xl border-subtle text-secondary-custom hover:bg-muted-custom"
          onClick={() => navigate('/app/settings')}
          title="Monthly API Cost"
        >
          <Zap className="w-3.5 h-3.5 text-[var(--accent-500)]" />
          <span className="font-mono text-xs font-semibold">${cost.toFixed(2)}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 text-muted-custom text-sm h-9 w-56 justify-start border-subtle bg-muted-custom hover:bg-[var(--border-subtle)]"
          onClick={() => {}}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Search project...</span>
          <kbd className="ml-auto text-[10px] bg-surface border border-subtle rounded px-1.5 py-0.5 font-mono text-secondary-custom">⌘K</kbd>
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted-custom text-secondary-custom">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--danger-text)] rounded-full ring-2 ring-surface" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2.5 px-2 h-9 rounded-xl hover:bg-muted-custom">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-[var(--accent-100)] text-[var(--accent-700)] text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 shadow-md border-subtle">
            <DropdownMenuLabel className="font-normal pb-2 pt-1.5">
              <p className="font-semibold text-primary-custom text-sm">{currentUser?.displayName || 'User'}</p>
              <p className="text-xs text-muted-custom truncate">{currentUser?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-subtle" />
            <DropdownMenuItem onClick={() => navigate('/app/settings')} className="cursor-pointer gap-2 font-medium">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-subtle" />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-[var(--danger-text)] focus:text-[var(--danger-text)] focus:bg-[var(--danger-bg)] gap-2 font-medium">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
