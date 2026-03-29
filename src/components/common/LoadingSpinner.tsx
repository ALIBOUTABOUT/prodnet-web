import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  message?: string;
  /** Renders just the spinner with no wrapper padding — use inside buttons */
  compact?: boolean;
}

export function LoadingSpinner({ size = 40, color = '#2ECC71', message, compact }: LoadingSpinnerProps) {
  const spinnerEl = (
    <div
      style={{
        ...styles.spinner,
        width: size,
        height: size,
        borderColor: `${color}22`,
        borderTopColor: color,
        flexShrink: 0,
      }}
    />
  );

  if (compact) return spinnerEl;

  return (
    <div style={styles.container}>
      {spinnerEl}
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    gap: '1rem',
  },
  spinner: {
    borderWidth: '3px',
    borderStyle: 'solid',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    fontSize: '0.875rem',
    color: '#6C757D',
    margin: 0,
  },
};
