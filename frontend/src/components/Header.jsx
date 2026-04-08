import React from 'react';
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from '@/components/MobileNav';

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card px-4 md:px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <MobileNav />
        
        <div className="hidden md:block">
          <h2 className="text-xl font-bold text-foreground">AI Code Generator</h2>
          <p className="text-sm text-muted-foreground">Transform requests into safe code changes</p>
        </div>
        
        <div className="md:hidden">
          <h2 className="text-lg font-bold text-foreground">CodeGen AI</h2>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">John Doe</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
