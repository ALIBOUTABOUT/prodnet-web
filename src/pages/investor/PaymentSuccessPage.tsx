/**
 * Payment Success Screen — aligned with mobile app's `payment_success_screen.dart`
 *
 * README ref: "Premium Simulation Feature > Unlocking Premium"
 * On success, user is navigated to payment_success_screen
 * and premium status is saved.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, ArrowRight } from 'lucide-react';

export function PaymentSuccessPage() {
  const navigate = useNavigate();

  // Auto-redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => navigate('/investor'), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Success icon */}
        <div style={styles.iconCircle}>
          <div style={styles.checkCircle}>
            <Check size={40} color="#FFFFFF" strokeWidth={3} />
          </div>
        </div>

        <Crown size={32} style={{ color: '#F1C40F', marginBottom: '0.5rem' }} />
        <h1 style={styles.title}>Welcome to Premium!</h1>
        <p style={styles.subtitle}>
          Your payment has been processed successfully.
          All premium features are now unlocked.
        </p>

        {/* Features unlocked */}
        <div style={styles.featureList}>
          <div style={styles.featureItem}>
            <Check size={16} style={{ color: '#2ECC71' }} />
            <span>Direct messaging with project owners</span>
          </div>
          <div style={styles.featureItem}>
            <Check size={16} style={{ color: '#2ECC71' }} />
            <span>Express interest in projects</span>
          </div>
          <div style={styles.featureItem}>
            <Check size={16} style={{ color: '#2ECC71' }} />
            <span>View owner contact details</span>
          </div>
          <div style={styles.featureItem}>
            <Check size={16} style={{ color: '#2ECC71' }} />
            <span>Premium investor badge</span>
          </div>
        </div>

        <button onClick={() => navigate('/investor')} style={styles.continueBtn}>
          Explore Projects
          <ArrowRight size={18} />
        </button>

        <p style={styles.autoRedirect}>
          You'll be redirected automatically in a few seconds...
        </p>
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
    backgroundColor: '#F0FAF4',
    padding: '1rem',
    background: 'linear-gradient(135deg, #e8f8f0 0%, #f5f7fa 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    padding: '3rem 2.5rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconCircle: {
    marginBottom: '1.5rem',
  },
  checkCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#2ECC71',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(46, 204, 113, 0.3)',
  },
  title: {
    margin: '0 0 0.5rem',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#212529',
  },
  subtitle: {
    margin: '0 0 2rem',
    fontSize: '0.9375rem',
    color: '#6C757D',
    lineHeight: 1.6,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    marginBottom: '2rem',
    width: '100%',
    textAlign: 'left',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    fontSize: '0.875rem',
    color: '#495057',
    padding: '0.5rem 0.75rem',
    backgroundColor: '#F0FAF4',
    borderRadius: '0.5rem',
  },
  continueBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    marginBottom: '1rem',
  },
  autoRedirect: {
    fontSize: '0.75rem',
    color: '#ADB5BD',
    margin: 0,
  },
};
