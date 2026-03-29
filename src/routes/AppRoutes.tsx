/**
 * Application Routes — aligned with mobile app's `routes.dart`
 *
 * README ref: "Centralized Routing"
 * All navigation paths are defined in routes.dart.
 *
 * README ref: "Role-Based Navigation"
 * After login, redirect based on user role:
 *   Farmer → /farmer
 *   Expert → /expert
 *   Investor → /investor
 *
 * README ref: "Web-Specific Considerations"
 * - Browser back/forward buttons require proper routing setup
 * - Consider deep linking for web bookmarks
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Auth pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { RoleSelectionPage } from '@/pages/auth/RoleSelectionPage';

// Investor pages
import { InvestorHomePage } from '@/pages/investor/InvestorHomePage';
import { InvestorDashboardPage } from '@/pages/investor/InvestorDashboardPage';
import { InvestorProjectDetailPage } from '@/pages/investor/InvestorProjectDetailPage';
import { InvestorMessagesPage } from '@/pages/investor/InvestorMessagesPage';
import { PaymentSimulationPage } from '@/pages/investor/PaymentSimulationPage';
import { PaymentSuccessPage } from '@/pages/investor/PaymentSuccessPage';

// Placeholder pages for future roles
import { FarmerPlaceholder } from '@/pages/farmer/FarmerPlaceholder';

// Expert pages
import { ExpertDashboardPage } from '@/pages/expert/ExpertDashboardPage';
import { ExpertIdeasPage } from '@/pages/expert/ExpertIdeasPage';
import { ExpertCreateIdeaPage } from '@/pages/expert/ExpertCreateIdeaPage';
import { ExpertPilotProjectsPage } from '@/pages/expert/ExpertPilotProjectsPage';
import { ExpertCollaborationsPage } from '@/pages/expert/ExpertCollaborationsPage';
import { ExpertProjectDetailPage } from '@/pages/expert/ExpertProjectDetailPage';
import { ExpertIdeaDetailPage } from '@/pages/expert/ExpertIdeaDetailPage';
import { ExpertMessagesPage } from '@/pages/expert/ExpertMessagesPage';
import { ExpertProfilePage } from '@/pages/expert/ExpertProfilePage';
import { ExpertCompleteProfilePage } from '@/pages/expert/ExpertCompleteProfilePage';
import { ExpertSettingsPage } from '@/pages/expert/ExpertSettingsPage';

// Layout
import { ProtectedRoute } from '@/components/Layout/ProtectedRoute';
import { Navbar } from '@/components/Layout/Navbar';

/**
 * RootRedirect — handles '/' based on auth state and role.
 * README ref: "Role-Based Navigation"
 */
function RootRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (user?.role) {
    case 'Farmer':
      return <Navigate to="/farmer" replace />;
    case 'Expert':
      return <Navigate to="/expert" replace />;
    case 'Investor':
      return <Navigate to="/investor" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

/**
 * Layout wrapper — shows navbar for authenticated pages.
 */
function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      {/* ═══ Public Routes ═══ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />

      {/* ═══ Root Redirect ═══ */}
      <Route path="/" element={<RootRedirect />} />

      {/* ═══ Investor Routes ═══ */}
      <Route
        path="/investor"
        element={
          <ProtectedRoute requiredRole="Investor">
            <AuthenticatedLayout>
              <InvestorHomePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/dashboard"
        element={
          <ProtectedRoute requiredRole="Investor">
            <AuthenticatedLayout>
              <InvestorDashboardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/messages"
        element={
          <ProtectedRoute requiredRole="Investor">
            <AuthenticatedLayout>
              <InvestorMessagesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/project/:projectId"
        element={
          <ProtectedRoute requiredRole="Investor">
            <AuthenticatedLayout>
              <InvestorProjectDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/premium"
        element={
          <ProtectedRoute requiredRole="Investor">
            <AuthenticatedLayout>
              <PaymentSimulationPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/investor/payment-success"
        element={
          <ProtectedRoute requiredRole="Investor">
            <PaymentSuccessPage />
          </ProtectedRoute>
        }
      />

      {/* ═══ Farmer Routes (Placeholder) ═══ */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute requiredRole="Farmer">
            <AuthenticatedLayout>
              <FarmerPlaceholder />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* ═══ Expert Routes ═══ */}
      <Route
        path="/expert"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertDashboardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/dashboard"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertDashboardPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/ideas"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertIdeasPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/ideas/new"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertCreateIdeaPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/pilot-projects"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertPilotProjectsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/collaborations"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertCollaborationsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/project/:projectId"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertProjectDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/idea/:ideaId"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertIdeaDetailPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/messages"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertMessagesPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/profile"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/complete-profile"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertCompleteProfilePage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expert/settings"
        element={
          <ProtectedRoute requiredRole="Expert">
            <AuthenticatedLayout>
              <ExpertSettingsPage />
            </AuthenticatedLayout>
          </ProtectedRoute>
        }
      />

      {/* ═══ Catch-all ═══ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
