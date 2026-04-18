import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header only */}
        <div className="md:hidden z-20">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto w-full h-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
