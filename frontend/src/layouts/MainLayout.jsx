import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const MainLayout = () => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto w-full h-full">
          <div className="container mx-auto p-4 md:p-6 w-full h-full max-w-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
