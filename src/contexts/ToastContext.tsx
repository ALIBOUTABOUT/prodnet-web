/**
 * Toast notification system — global lightweight alerts.
 *
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Idea published!');              // success (default)
 *   showToast('Something went wrong', 'error');
 *   showToast('Participation requested', 'info');
 *
 * Toasts auto-dismiss after 3.5 s and stack at bottom-right.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

// ── Types ────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

// ── Context ──────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ─────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = ++counter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* ── Toast Stack ── */}
      {toasts.length > 0 && (
        <div style={containerStyle}>
          {toasts.map((toast) => (
            <div key={toast.id} style={{ ...toastStyle, ...typeMap[toast.type] }}>
              <span style={iconStyle}>{iconMap[toast.type]}</span>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                style={closeStyle}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ── Styles ───────────────────────────────────────

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  pointerEvents: 'none',
};

const toastStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.625rem',
  padding: '0.75rem 1rem',
  borderRadius: '0.625rem',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  fontSize: '0.9rem',
  fontWeight: 500,
  minWidth: '260px',
  maxWidth: '380px',
  pointerEvents: 'all',
  animation: 'none',
};

const typeMap: Record<ToastType, React.CSSProperties> = {
  success: { backgroundColor: '#1E7E34', color: '#FFFFFF', border: '1px solid #17622A' },
  error:   { backgroundColor: '#C0392B', color: '#FFFFFF', border: '1px solid #9B2D22' },
  info:    { backgroundColor: '#2471A3', color: '#FFFFFF', border: '1px solid #1A5276' },
};

const iconMap: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

const iconStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: '1rem',
  flexShrink: 0,
};

const closeStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'inherit',
  fontSize: '1.25rem',
  cursor: 'pointer',
  lineHeight: 1,
  opacity: 0.75,
  padding: 0,
  flexShrink: 0,
};
