import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { StudioPage } from "@/pages/StudioPage";
import { VersionsPage } from "@/pages/VersionsPage";
import { RequestDebugPage } from "@/pages/RequestDebugPage";
import { BrandPage } from "@/pages/BrandPage";
import { ConnectionsPage } from "@/pages/ConnectionsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AuthPage } from "@/pages/AuthPage";
import { AdminPage } from "@/pages/AdminPage";
import { AssetsPage } from "@/pages/AssetsPage";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
                  <Route index element={<ProjectsPage />} />
                  <Route path="studio" element={<StudioPage />} />
                  <Route path="history" element={<VersionsPage />} />
                  <Route path="versions" element={<VersionsPage />} />
                  <Route path="request/:id" element={<RequestDebugPage />} />
                  <Route path="knowledge" element={<BrandPage />} />
                  <Route path="brand" element={<BrandPage />} />
                  <Route path="assets" element={<AssetsPage />} />
                  <Route path="integrations" element={<ConnectionsPage />} />
                  <Route path="servers" element={<ConnectionsPage />} />
                  <Route path="connections" element={<ConnectionsPage />} />
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
