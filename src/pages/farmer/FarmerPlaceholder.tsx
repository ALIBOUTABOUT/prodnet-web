/**
 * Farmer Placeholder — stub for future Farmer role implementation.
 *
 * README ref: "Farmer Features"
 * - Profile management (name, phone, region, farm type, bio, image)
 * - Project publishing (title, desc, budget, production estimate, region, category, images)
 * - Project management (list, detail view, create)
 * - Messaging (after profile completion)
 *
 * This placeholder will be replaced with full Farmer screens when that role
 * is implemented for the web platform.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sprout, ArrowRight } from 'lucide-react';

export function FarmerPlaceholder() {
  const { user, completeProfile, hasCompletedProfile } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <Sprout size={40} style={{ color: '#27AE60' }} />
        </div>
        <h1 style={styles.title}>Farmer Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome, {user?.fullName || user?.email}!
        </p>
        <p style={styles.desc}>
          The Farmer portal is coming soon. You'll be able to publish agricultural projects,
          manage your farm profile, and connect with experts and investors.
        </p>

        {!hasCompletedProfile && (
          <button onClick={completeProfile} style={styles.completeBtn}>
            Complete Profile <ArrowRight size={16} />
          </button>
        )}

        <div style={styles.featurePreview}>
          <h3 style={styles.featureTitle}>Upcoming Features</h3>
          <ul style={styles.featureList}>
            <li>Publish and manage agricultural projects</li>
            <li>Complete farm profile (region, farm type, bio)</li>
            <li>Project detail views and editing</li>
            <li>Messaging with experts and investors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '560px',
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    padding: '3rem 2.5rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  iconCircle: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#E8F8F0',
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#212529',
  },
  subtitle: {
    margin: '0 0 0.75rem',
    fontSize: '1rem',
    color: '#6C757D',
  },
  desc: {
    margin: '0 0 1.5rem',
    fontSize: '0.9375rem',
    color: '#6C757D',
    lineHeight: 1.6,
  },
  completeBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.9375rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '1.5rem',
    fontFamily: 'inherit',
  },
  featurePreview: {
    textAlign: 'left',
    padding: '1.25rem',
    backgroundColor: '#F8F9FA',
    borderRadius: '0.75rem',
  },
  featureTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#495057',
  },
  featureList: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '0.8125rem',
    color: '#6C757D',
    lineHeight: 1.8,
  },
};
