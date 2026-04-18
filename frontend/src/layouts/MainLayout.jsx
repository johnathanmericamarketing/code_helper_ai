import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const MainLayout = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/app/studio');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background overflow-hidden relative">
      {/* Global sidebar — hidden on Studio (has its own left panel) */}
      {!isStudio && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
        {/* Header — shown on mobile always, and on desktop for non-studio pages */}
        {!isStudio && (
          <div className="shrink-0 z-20">
            <Header />
          </div>
        )}
        {/* Mobile header fallback (already gated by CSS inside Header / MobileNav) */}
        {isStudio && (
          <div className="md:hidden shrink-0 z-20">
            <Header />
          </div>
        )}

        <main className="flex-1 overflow-y-auto w-full relative">
          {/* Page padding — not applied inside Studio */}
          {isStudio ? (
            <div className="h-full flex flex-col">
              <Outlet />
            </div>
          ) : (
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
