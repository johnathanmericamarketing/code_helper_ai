import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CreateRequestPage } from "@/pages/CreateRequestPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RequestDetailPage } from "@/pages/RequestDetailPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { IntegrationsPage } from "@/pages/IntegrationsPage";
import { ServersPage } from "@/pages/ServersPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";

function App() {

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="create" element={<CreateRequestPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="request/:id" element={<RequestDetailPage />} />
                <Route path="knowledge" element={<KnowledgeBasePage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="servers" element={<ServersPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" richColors />
        </div>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
