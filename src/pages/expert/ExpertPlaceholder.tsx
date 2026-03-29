/**
 * Expert Placeholder — stub for future Expert role implementation.
 *
 * README ref: "Expert Features"
 * - Idea lifecycle: draft → published → readyForPilot → pilotActive
 * - Create/edit ideas (title, problem, solution, category, region, budget range)
 * - Browse farmer projects
 * - Investor interest visibility
 * - Messaging (after profile completion)
 *
 * This placeholder will be replaced with full Expert screens when that role
 * is implemented for the web platform.
 */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Lightbulb, ArrowRight } from 'lucide-react';

export function ExpertPlaceholder() {
  const { user, completeProfile, hasCompletedProfile } = useAuth();

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <Lightbulb size={40} style={{ color: '#3498DB' }} />
        </div>
        <h1 style={styles.title}>Expert Dashboard</h1>
        <p style={styles.subtitle}>
          Welcome, {user?.fullName || user?.email}!
        </p>
        <p style={styles.desc}>
          The Expert portal is coming soon. You'll be able to publish innovative agricultural
          ideas, collaborate with farmers, and track investor interest.
        </p>

        {!hasCompletedProfile && (
          <button onClick={completeProfile} style={styles.completeBtn}>
            Complete Profile <ArrowRight size={16} />
          </button>
        )}

        <div style={styles.featurePreview}>
          <h3 style={styles.featureTitle}>Upcoming Features</h3>
          <ul style={styles.featureList}>
            <li>Create and manage agricultural ideas</li>
            <li>Idea lifecycle management (draft → published → pilot)</li>
            <li>Browse and collaborate on farmer projects</li>
            <li>View investor interest in your ideas</li>
            <li>Messaging with farmers and investors</li>
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
    backgroundColor: '#EBF5FB',
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
    backgroundColor: '#3498DB',
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
