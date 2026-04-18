import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";

// Pages — using consistent naming
import { DashboardPage }       from "@/pages/DashboardPage";       // "Projects"
import { WorkspaceStudioPage } from "@/pages/WorkspaceStudioPage"; // "Studio"
import { HistoryPage }         from "@/pages/HistoryPage";         // "Versions"
import { RequestDetailPage }   from "@/pages/RequestDetailPage";   // debug only
import { KnowledgeBasePage }   from "@/pages/KnowledgeBasePage";   // "Brand"
import { IntegrationsPage }    from "@/pages/IntegrationsPage";    // "Connections" tab
import { ServersPage }         from "@/pages/ServersPage";         // "Connections" tab
import { SettingsPage }        from "@/pages/SettingsPage";
import { AuthPage }            from "@/pages/AuthPage";
import { AdminPage }           from "@/pages/AdminPage";
import { AssetStudioPage }     from "@/pages/AssetStudioPage";     // "Assets"
import { Toaster }             from "@/components/ui/sonner";
import { ThemeProvider }       from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppErrorBoundary }    from "@/components/AppErrorBoundary";
import { getUserProfile }      from "@/lib/user-service";
import { LandingPage }         from "@/pages/LandingPage";
import { ProjectProvider }     from "@/context/ProjectContext";

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
                  {/* Public routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* ── Protected Application Routes ── */}
                  <Route path="/app" element={
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  }>
                    {/* Projects (was Dashboard) */}
                    <Route index element={<DashboardPage />} />
                    <Route path="projects" element={<DashboardPage />} />

                    {/* Studio */}
                    <Route path="studio" element={<WorkspaceStudioPage />} />

                    {/* Brand (was Knowledge Base) */}
                    <Route path="brand" element={<KnowledgeBasePage />} />
                    {/* Legacy redirect: /app/knowledge → /app/brand */}
                    <Route path="knowledge" element={<Navigate to="/app/brand" replace />} />

                    {/* Versions (was History) */}
                    <Route path="versions" element={<HistoryPage />} />
                    {/* Legacy redirect: /app/history → /app/versions */}
                    <Route path="history" element={<Navigate to="/app/versions" replace />} />

                    {/* Assets */}
                    <Route path="assets" element={<AssetStudioPage />} />

                    {/* Connections (merges Integrations + Servers) */}
                    <Route path="connections" element={<IntegrationsPage />} />
                    {/* Legacy redirects */}
                    <Route path="integrations" element={<Navigate to="/app/connections" replace />} />
                    <Route path="servers"       element={<Navigate to="/app/connections" replace />} />

                    {/* Settings */}
                    <Route path="settings" element={<SettingsPage />} />

                    {/* Advanced / Debug — not in main nav */}
                    <Route path="debug/requests/:id" element={<RequestDetailPage />} />
                    {/* Legacy redirect */}
                    <Route path="request/:id" element={<Navigate to="/app/versions" replace />} />
                  </Route>

                  {/* Admin */}
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
