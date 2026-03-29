/**
 * Premium Banner — shown at the top of investor home when not premium.
 *
 * README ref: "Before Premium (Free tier)"
 * A persistent orange upgrade banner is shown at the top of the home screen:
 * "Upgrade to Premium — Unlock messaging, contact info & express interest"
 *
 * README ref: "After Premium (Pro tier)"
 * The upgrade banner is hidden.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

interface PremiumBannerProps {
  isPremium: boolean;
}

export function PremiumBanner({ isPremium }: PremiumBannerProps) {
  const navigate = useNavigate();

  if (isPremium) return null;

  return (
    <div
      style={styles.banner}
      onClick={() => navigate('/investor/premium')}
      role="button"
      tabIndex={0}
    >
      <div style={styles.content}>
        <div style={styles.iconCircle}>
          <MapPin size={18} style={{ color: '#FFFFFF' }} />
        </div>
        <div>
          <strong style={styles.title}>Upgrade to Premium</strong>
          <span style={styles.desc}>
            Unlock messaging, contact info & express interest
          </span>
        </div>
      </div>
      <ChevronRight size={22} style={{ color: '#FFFFFF', flexShrink: 0 }} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 1.25rem',
    background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  title: {
    display: 'block',
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: '#FFFFFF',
  },
  desc: {
    display: 'block',
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.85)',
    marginTop: '0.125rem',
  },
};
