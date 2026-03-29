/**
 * Role Selection Page — aligned with mobile app's `role_selection_page.dart`
 *
 * README ref: "Registration Flow"
 * After email/password collection → RoleSelectionPage → Role Chosen
 *
 * README ref: "Role-Based System Design > Three-Role Architecture"
 * - Farmer: Publish agricultural projects and manage project details
 * - Expert: Publish innovative ideas and collaborate with farmers on pilot projects
 * - Investor: Browse unified content feeds, unlock premium features, and engage with projects
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/models/user';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Sprout, Lightbulb, TrendingUp, ArrowRight } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const roles: RoleOption[] = [
  {
    role: 'Farmer',
    title: 'Farmer',
    description: 'Publish agricultural projects, manage farm details, and connect with experts and investors.',
    icon: <Sprout size={32} />,
    color: '#27AE60',
    bgColor: '#E8F8F0',
  },
  {
    role: 'Expert',
    title: 'Expert',
    description: 'Share innovative agricultural ideas, collaborate with farmers on pilot projects.',
    icon: <Lightbulb size={32} />,
    color: '#3498DB',
    bgColor: '#EBF5FB',
  },
  {
    role: 'Investor',
    title: 'Investor',
    description: 'Browse projects and ideas, compare investments, and unlock premium features.',
    icon: <TrendingUp size={32} />,
    color: '#F39C12',
    bgColor: '#FEF9E7',
  },
];

export function RoleSelectionPage() {
  const { selectRole, isLoading, error, isAuthenticated, needsRoleSelection, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated with role, redirect
  useEffect(() => {
    if (isAuthenticated && user && !needsRoleSelection) {
      const routes: Record<string, string> = {
        Farmer: '/farmer',
        Expert: '/expert',
        Investor: '/investor',
      };
      navigate(routes[user.role] || '/');
    }
  }, [isAuthenticated, user, needsRoleSelection, navigate]);

  // If user hasn't started signup flow, redirect to signup
  useEffect(() => {
    if (!needsRoleSelection && !isAuthenticated) {
      navigate('/signup');
    }
  }, [needsRoleSelection, isAuthenticated, navigate]);

  const handleSelectRole = async (role: UserRole) => {
    await selectRole(role);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <img src="/logo.png" alt="ProdNet" style={styles.logo} />
          <h1 style={styles.title}>Choose Your Role</h1>
          <p style={styles.subtitle}>
            Select how you'd like to participate in the ProdNet ecosystem
          </p>
        </div>

        {/* Role Cards */}
        <div style={styles.grid}>
          {roles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleSelectRole(r.role)}
              disabled={isLoading}
              style={styles.roleCard}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
              }}
            >
              <div style={{ ...styles.iconCircle, backgroundColor: r.bgColor, color: r.color }}>
                {r.icon}
              </div>
              <h3 style={{ ...styles.roleTitle, color: r.color }}>{r.title}</h3>
              <p style={styles.roleDesc}>{r.description}</p>
              <div style={{ ...styles.selectIndicator, color: r.color }}>
                Select <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={styles.loadingOverlay}>
            <LoadingSpinner message="Setting up your account..." />
          </div>
        )}

        {/* Error */}
        {error && <div style={styles.errorBox}>{error}</div>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F4F0',
    padding: '2rem 1rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
  },
  container: {
    width: '100%',
    maxWidth: '900px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  logo: {
    height: '48px',
    objectFit: 'contain',
    marginBottom: '1rem',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '2rem',
    fontWeight: 800,
    color: '#212529',
  },
  subtitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#6C757D',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
  },
  roleCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E9ECEF',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    textAlign: 'center',
    fontFamily: 'inherit',
  },
  iconCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  roleTitle: {
    margin: '0 0 0.5rem',
    fontSize: '1.25rem',
    fontWeight: 700,
  },
  roleDesc: {
    margin: '0 0 1rem',
    fontSize: '0.875rem',
    color: '#6C757D',
    lineHeight: 1.5,
    flex: 1,
  },
  selectIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  loadingOverlay: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
  },
  errorBox: {
    marginTop: '1.5rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#FDE8E8',
    color: '#E74C3C',
    fontSize: '0.875rem',
    fontWeight: 500,
    textAlign: 'center',
  },
};
