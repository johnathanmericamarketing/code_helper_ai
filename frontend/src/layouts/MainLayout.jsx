import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const MainLayout = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/app/studio');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background overflow-hidden relative">
      {/* Only show the global sidebar on non-studio pages (studio has its own left panel) */}
      {!isStudio && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Mobile Header only (shown on all pages on mobile) */}
        <div className="md:hidden z-20 shrink-0">
          <Header />
        </div>
        <main className="flex-1 overflow-hidden w-full h-full relative flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
