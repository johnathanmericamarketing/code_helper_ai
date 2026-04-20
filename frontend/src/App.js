import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MainLayout }    from "@/layouts/MainLayout";

// ── Public Pages (untouched) ────────────────────────────────────────────────
import { LandingPage }   from "@/pages/LandingPage";
import { AuthPage }      from "@/pages/AuthPage";

// ── New modular pages (post-login) ──────────────────────────────────────────
import { ProjectsPage }     from "@/pages/ProjectsPage";
import { BrandPage }        from "@/pages/BrandPage";
import { VersionsPage }     from "@/pages/VersionsPage";
import { ConnectionsPage }  from "@/pages/ConnectionsPage";
import { AssetsPage }       from "@/pages/AssetsPage";

// ── Preserved pages (functional logic unchanged) ────────────────────────────
import { WorkspaceStudioPage } from "@/pages/WorkspaceStudioPage"; // Studio
import { SettingsPage }        from "@/pages/SettingsPage";
import { AdminPage }           from "@/pages/AdminPage";
import { RequestDetailPage }   from "@/pages/RequestDetailPage";   // debug

import { Toaster }             from "@/components/ui/sonner";
import { ThemeProvider }       from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AppErrorBoundary }    from "@/components/AppErrorBoundary";
import { getUserProfile }      from "@/lib/user-service";
import { ProjectProvider }     from "@/context/ProjectContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location        = useLocation();
  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  const location        = useLocation();
  const [isAdmin, setIsAdmin] = React.useState(null);

  React.useEffect(() => {
    if (!currentUser) { setIsAdmin(false); return; }
    getUserProfile().then(p => setIsAdmin(p?.role === 'super_admin')).catch(() => setIsAdmin(false));
  }, [currentUser]);

  if (!currentUser) return <Navigate to="/auth" state={{ from: location }} replace />;
  if (isAdmin === null) return null;
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
                  {/* ── Public ─────────────────────────────────── */}
                  <Route path="/"     element={<LandingPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  {/* ── Protected Application Routes ────────────── */}
                  <Route
                    path="/app"
                    element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    }
                  >
                    {/* Default: redirect to projects */}
                    <Route index element={<Navigate to="/app/projects" replace />} />

                    {/* Projects (new page, replaces DashboardPage) */}
                    <Route path="projects" element={<ProjectsPage />} />

                    {/* Studio (preserved WorkspaceStudioPage, all logic intact) */}
                    <Route path="studio" element={<WorkspaceStudioPage />} />

                    {/* Brand (new page, replaces KnowledgeBasePage) */}
                    <Route path="brand" element={<BrandPage />} />

                    {/* Versions (new page, replaces HistoryPage) */}
                    <Route path="versions" element={<VersionsPage />} />

                    {/* Assets (new page, replaces AssetStudioPage) */}
                    <Route path="assets" element={<AssetsPage />} />

                    {/* Connections (new page, merges IntegrationsPage + ServersPage) */}
                    <Route path="connections" element={<ConnectionsPage />} />

                    {/* Settings (preserved, no changes) */}
                    <Route path="settings" element={<SettingsPage />} />

                    {/* ── Legacy redirects — keep old URLs working ── */}
                    <Route path="dashboard"  element={<Navigate to="/app/projects"    replace />} />
                    <Route path="knowledge"  element={<Navigate to="/app/brand"       replace />} />
                    <Route path="history"    element={<Navigate to="/app/versions"    replace />} />
                    <Route path="integrations" element={<Navigate to="/app/connections" replace />} />
                    <Route path="servers"    element={<Navigate to="/app/connections" replace />} />
                    <Route path="request/:id" element={<Navigate to="/app/versions"   replace />} />

                    {/* Debug (not in nav) */}
                    <Route path="debug/requests/:id" element={<RequestDetailPage />} />
                  </Route>

                  {/* ── Admin ──────────────────────────────────── */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <div className="min-h-screen bg-background">
                          <div className="max-w-7xl mx-auto p-6">
                            <AdminPage />
                          </div>
                        </div>
                      </AdminRoute>
                    }
                  />
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
