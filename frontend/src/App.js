import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { CreateRequestPage } from "@/pages/CreateRequestPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { RequestDetailPage } from "@/pages/RequestDetailPage";
import { KnowledgeBasePage } from "@/pages/KnowledgeBasePage";
import { IntegrationsPage } from "@/pages/IntegrationsPage";
import { ServersPage } from "@/pages/ServersPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AuthPage } from "@/pages/AuthPage";
import { AdminPage } from "@/pages/AdminPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { getUserProfile } from "@/lib/user-service";

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
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardPage />} />
                  <Route path="create" element={<CreateRequestPage />} />
                  <Route path="history" element={<HistoryPage />} />
                  <Route path="request/:id" element={<RequestDetailPage />} />
                  <Route path="knowledge" element={<KnowledgeBasePage />} />
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
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
