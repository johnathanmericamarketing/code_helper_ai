import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const MainLayout = () => {
  const location = useLocation();
  const isStudio = location.pathname.startsWith('/app/studio');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background overflow-hidden relative">

      {/* Global sidebar — hidden on Studio (has its own left panel) and always hidden on mobile */}
      {!isStudio && <Sidebar />}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">

        {/* Header:
              - Non-studio: always shown (desktop + mobile)
              - Studio desktop: hidden (Studio has its own TopBar)
              - Studio mobile: shown so user has nav access */}
        {!isStudio ? (
          <div className="shrink-0 z-20">
            <Header />
          </div>
        ) : (
          // On studio, show header ONLY on mobile
          <div className="md:hidden shrink-0 z-20">
            <Header />
          </div>
        )}

        <main className="flex-1 overflow-y-auto w-full relative">
          {isStudio ? (
            // Studio gets full height, no padding — manages its own layout
            <div className="h-full flex flex-col">
              <Outlet />
            </div>
          ) : (
            // All other pages: max-width constrained with standard padding
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8">
              <Outlet />
            </div>
          )}
        </main>

      </div>
    </div>
  );
};
