import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar }      from '@/components/shell/AppSidebar';
import { AppHeader }       from '@/components/shell/AppHeader';
import { MobileBottomNav } from '@/components/shell/MobileBottomNav';

export const MainLayout = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/app/studio');

  return (
    <div
      className="dark flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--bg-app)' }}
    >
      {/* ── Desktop sidebar ── */}
      <AppSidebar />

      {/* ── Right column: header + page content + mobile nav ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">

        {/* Header:
              • Non-studio: always shown
              • Studio on desktop: hidden (Studio has its own TopBar)
              • Studio on mobile: shown so user can navigate */}
        {!isStudio ? (
          <div className="shrink-0 z-20">
            <AppHeader />
          </div>
        ) : (
          <div className="md:hidden shrink-0 z-20">
            <AppHeader />
          </div>
        )}

        {/* Page content area */}
        <main className="flex-1 overflow-y-auto w-full relative">
          {isStudio ? (
            // Studio owns its full-height layout
            <div className="h-full flex flex-col">
              <Outlet />
            </div>
          ) : (
            // All other pages: centred, padded
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
              <Outlet />
            </div>
          )}
        </main>

        {/* Mobile bottom nav (hidden on md+) */}
        <MobileBottomNav />
      </div>
    </div>
  );
};
