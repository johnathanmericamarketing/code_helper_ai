import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/shell/AppSidebar';
import { AppHeader } from '@/components/shell/AppHeader';
import { MobileBottomNav } from '@/components/shell/MobileBottomNav';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-app overflow-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <AppHeader />
        <main className="flex-1 overflow-y-auto w-full h-full pb-16 md:pb-0 relative z-10">
          <div className="container mx-auto p-4 md:p-6 w-full h-full max-w-none">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
        {/* Subtle background glow elements for the new design feel */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--accent-500)]/5 blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-[var(--info-bg)] blur-3xl pointer-events-none z-0" />
      </div>
    </div>
  );
};
