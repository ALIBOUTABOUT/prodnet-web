/**
 * Protected Route — aligned with mobile app's role-based navigation
 *
 * README ref: "Role-Based Navigation"
 * After login, users are redirected based on their role.
 * This component gates routes behind authentication checks.
 *
 * README ref: "Profile Completion"
 * Each role has a mandatory profile completion step.
 * Messaging and certain features are gated behind hasCompletedProfile.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/models/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If set, only users with this role can access */
  requiredRole?: UserRole;
  /** If true, requires profile to be completed */
  requiresProfileCompletion?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRole,
  requiresProfileCompletion = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, needsRoleSelection, hasCompletedProfile } = useAuth();
  const location = useLocation();

  // Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Needs to select role → redirect to role selection
  if (needsRoleSelection) {
    return <Navigate to="/select-role" replace />;
  }

  // Role check
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate home based on actual role
    const roleRoutes: Record<UserRole, string> = {
      Farmer: '/farmer',
      Expert: '/expert',
      Investor: '/investor',
    };
    return <Navigate to={roleRoutes[user!.role] || '/login'} replace />;
  }

  // Profile completion check
  if (requiresProfileCompletion && !hasCompletedProfile) {
    const profileRoutes: Record<UserRole, string> = {
      Farmer: '/farmer',
      Expert: '/expert/complete-profile',
      Investor: '/investor',
    };

    return <Navigate to={profileRoutes[user?.role || 'Investor']} replace />;
  }

  return <>{children}</>;
}
