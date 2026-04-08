import React, { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CreateRequestPage } from "@/pages/CreateRequestPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RequestDetailPage } from "@/pages/RequestDetailPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  useEffect(() => {
    // Test backend connection
    const testConnection = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log('Backend connected:', response.data.message);
      } catch (error) {
        console.error('Backend connection error:', error);
      }
    };
    testConnection();
  }, []);

  return (
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
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </div>
    </ThemeProvider>
  );
}

export default App;
