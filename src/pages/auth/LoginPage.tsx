/**
 * Login Page — aligned with mobile app's `login_page.dart`
 *
 * README ref: "Authentication Flow Summary > Login Flow"
 * Email + Password → AuthService.login() → JWT Token → Role-based nav
 *
 * README ref: "Role-Based Navigation"
 * After successful login, redirect based on user role:
 *   Farmer → /farmer
 *   Expert → /expert
 *   Investor → /investor
 */

import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Validators } from '@/core/validators';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const { login, isLoading, error, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [logoFailed, setLogoFailed] = useState(false);

  const logoSrc = `${import.meta.env.BASE_URL}logo.png`;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      const routes: Record<string, string> = {
        Farmer: '/farmer',
        Expert: '/expert',
        Investor: '/investor',
      };
      navigate(routes[user.role] || '/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!Validators.isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!Validators.isValidPassword(password)) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    await login(email, password);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoSection}>
          {!logoFailed ? (
            <img
              src={logoSrc}
              alt="ProdNet"
              style={styles.logo}
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div style={styles.logoFallback}>ProdNet</div>
          )}
          <p style={styles.subtitle}>Agricultural Project Management Platform</p>
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.desc}>Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Messages */}
          {(validationError || error) && (
            <div style={styles.errorBox}>{validationError || error}</div>
          )}

          {/* Submit */}
          <button type="submit" disabled={isLoading} style={styles.submitBtn}>
            {isLoading ? <LoadingSpinner size={20} color="#FFF" compact /> : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.link}>Create one</Link>
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
    backgroundColor: '#F0F4F0',
    padding: '1rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    padding: '2.5rem',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  logo: {
    height: '48px',
    objectFit: 'contain',
  },
  logoFallback: {
    fontSize: '1.75rem',
    fontWeight: 800,
    letterSpacing: '0.02em',
    color: '#1F7A45',
    lineHeight: 1,
  },
  subtitle: {
    margin: '0.5rem 0 0',
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#212529',
    textAlign: 'center',
  },
  desc: {
    margin: '0 0 1.75rem',
    fontSize: '0.875rem',
    color: '#6C757D',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#495057',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#ADB5BD',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    color: '#212529',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#ADB5BD',
    cursor: 'pointer',
  },
  errorBox: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    backgroundColor: '#FDE8E8',
    color: '#E74C3C',
    fontSize: '0.8125rem',
    fontWeight: 500,
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '3rem',
    padding: '0 1.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s',
    fontFamily: 'inherit',
  },
  footer: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6C757D',
  },
  link: {
    color: '#2ECC71',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
