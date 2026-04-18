import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { WorkspaceStudioPage } from "@/pages/WorkspaceStudioPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RequestDetailPage } from "@/pages/RequestDetailPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { IntegrationsPage } from "@/pages/IntegrationsPage";
import { ServersPage } from "@/pages/ServersPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AuthPage } from "@/pages/AuthPage";
import { AdminPage } from "@/pages/AdminPage";
import { AssetStudioPage } from "@/pages/AssetStudioPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { getUserProfile } from "@/lib/user-service";
import { LandingPage } from "@/pages/LandingPage";

import { ProjectProvider } from "@/context/ProjectContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = React.useState(null);

  React.useEffect(() => {
    if (!currentUser) { setIsAdmin(false); return; }
    getUserProfile().then(p => setIsAdmin(p?.role === 'super_admin')).catch(() => setIsAdmin(false));
  }, [currentUser]);

  if (!currentUser) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (isAdmin === null) return null; // loading
  if (!isAdmin) return <Navigate to="/app" replace />;
  return children;
};

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <div className="App">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* ── Protected Application Routes ── */}
                  <Route path="/app" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="studio" element={<WorkspaceStudioPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="request/:id" element={<RequestDetailPage />} />
                  <Route path="knowledge" element={<KnowledgeBasePage />} />
                  <Route path="assets" element={<AssetStudioPage />} />
                  <Route path="integrations" element={<IntegrationsPage />} />
                  <Route path="servers" element={<ServersPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="/admin" element={
                  <AdminRoute>
                    <div className="min-h-screen bg-background">
                      <div className="max-w-7xl mx-auto p-6">
                        <AdminPage />
                      </div>
                    </div>
                  </AdminRoute>
                } />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" richColors />
          </div>
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
