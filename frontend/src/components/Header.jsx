import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/MobileNav';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const routeMeta = {
  '/app': { title: 'Dashboard', sub: 'Your project overview' },
  '/app/studio': { title: 'Workspace Studio', sub: 'AI-powered visual code editor' },
  '/app/assets': { title: 'Asset Studio', sub: 'Generate & manage images' },
  '/app/history': { title: 'History', sub: 'All past requests & outputs' },
  '/app/knowledge': { title: 'Knowledge Base', sub: 'Brand rules, colors & preferences' },
  '/app/integrations': { title: 'Integrations', sub: 'Connect GitHub, Stripe & more' },
  '/app/servers': { title: 'Servers', sub: 'Manage project hosting & deployments' },
  '/app/settings': { title: 'Settings', sub: 'API keys & account preferences' },
};

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const meta = routeMeta[location.pathname] || { title: 'Code Helper', sub: 'AI Studio' };
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
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <MobileNav />
        <div className="hidden md:block">
          <h2 className="text-[16px] font-bold text-foreground leading-none tracking-tight">{meta.title}</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">{meta.sub}</p>
        </div>
        <div className="md:hidden">
          <h2 className="text-base font-bold text-foreground">{meta.title}</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search placeholder */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 text-muted-foreground text-sm h-9 w-48 justify-start border-border/60 bg-muted/30 hover:bg-muted/60"
          onClick={() => {}}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-auto text-[10px] bg-muted rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
        </Button>

        <ThemeToggle />

        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted/60">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2.5 px-2 h-9 rounded-xl hover:bg-muted/60">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-semibold hidden md:inline text-foreground">
                {currentUser?.displayName?.split(' ')[0] || 'Account'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 shadow-xl">
            <DropdownMenuLabel className="font-normal pb-2 pt-1.5">
              <p className="font-semibold text-foreground text-sm">{currentUser?.displayName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/settings')} className="cursor-pointer gap-2">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive hover:text-destructive focus:text-destructive gap-2">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
