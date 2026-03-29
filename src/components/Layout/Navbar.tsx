/**
 * Navbar — top navigation bar for the web application.
 *
 * README ref: "Role-Based Navigation"
 * Displays user info, role-based links, and premium badge.
 *
 * README ref: "Premium Simulation Feature > After Premium"
 * - Gold premium badge on avatar
 * - "PRO" label next to user email
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInvestorPayment } from '@/contexts/InvestorPaymentContext';
import { useMessages } from '@/contexts/MessagesContext';
import logoImage from '../../../logo.png';
import {
  LogOut,
  User,
  Crown,
  Menu,
  X,
  Home,
  LayoutDashboard,
  MessageCircle,
  Settings,
  Star,
  Lightbulb,
  Sprout,
  Users,
} from 'lucide-react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  let isPremium = false;
  try {
    const payment = useInvestorPayment();
    isPremium = payment.isPremium;
  } catch {
    // Not within InvestorPaymentProvider
  }

  let totalUnread = 0;
  try {
    const msgs = useMessages();
    totalUnread = msgs.totalUnread;
  } catch {
    // Not within MessagesProvider
  }

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
    navigate('/login');
  };

  if (!isAuthenticated || !user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.brand}>
            <img src={logoImage} alt="ProdNet" style={styles.logo} />
          </Link>

          {/* Desktop nav links */}
          <div style={styles.desktopNav}>
            {user.role === 'Expert' && (
              <>
                <Link
                  to="/expert"
                  style={{
                    ...styles.navLink,
                    color: isActive('/expert') || isActive('/expert/dashboard') ? '#3498DB' : '#495057',
                  }}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link
                  to="/expert/ideas"
                  style={{
                    ...styles.navLink,
                    color: location.pathname.startsWith('/expert/ideas') ? '#3498DB' : '#495057',
                  }}
                >
                  <Lightbulb size={18} />
                  My Ideas
                </Link>
                <Link
                  to="/expert/pilot-projects"
                  style={{
                    ...styles.navLink,
                    color: location.pathname.startsWith('/expert/pilot-projects') || location.pathname.startsWith('/expert/project') ? '#3498DB' : '#495057',
                  }}
                >
                  <Sprout size={18} />
                  Pilot Projects
                </Link>
                <Link
                  to="/expert/collaborations"
                  style={{
                    ...styles.navLink,
                    color: location.pathname.startsWith('/expert/collaborations') ? '#3498DB' : '#495057',
                  }}
                >
                  <Users size={18} />
                  Collaborations
                </Link>
                <Link
                  to="/expert/messages"
                  style={{
                    ...styles.navLink,
                    color: isActive('/expert/messages') ? '#3498DB' : '#495057',
                    position: 'relative',
                  }}
                >
                  <MessageCircle size={18} />
                  Messages
                </Link>
              </>
            )}

            {user.role === 'Investor' && (
              <>
                <Link
                  to="/investor"
                  style={{
                    ...styles.navLink,
                    color: isActive('/investor') ? '#2ECC71' : '#495057',
                  }}
                >
                  <Home size={18} />
                  Home
                </Link>
                <Link
                  to="/investor/dashboard"
                  style={{
                    ...styles.navLink,
                    color: isActive('/investor/dashboard') ? '#2ECC71' : '#495057',
                  }}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                  {totalUnread > 0 && (
                    <span style={styles.navDot} />
                  )}
                </Link>
                <Link
                  to="/investor/messages"
                  style={{
                    ...styles.navLink,
                    color: isActive('/investor/messages') ? '#2ECC71' : '#495057',
                    position: 'relative',
                  }}
                >
                  <MessageCircle size={18} />
                  Messages
                  {totalUnread > 0 && (
                    <span style={styles.navBadge}>{totalUnread}</span>
                  )}
                </Link>
                {!isPremium && (
                  <Link to="/investor/premium" style={styles.premiumLink}>
                    <Crown size={18} />
                    Upgrade
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right section */}
          <div style={styles.rightSection}>
            {/* User pill (desktop) */}
            <div style={styles.userPill}>
              <div style={styles.avatarSmall}>
                <User size={16} />
              </div>
              {isPremium && (
                <span style={styles.proLabel}>PRO</span>
              )}
            </div>

            {/* Hamburger menu */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={styles.menuBtn}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Drawer overlay */}
      {drawerOpen && (
        <div style={styles.overlay} onClick={() => setDrawerOpen(false)}>
          <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
            {/* Drawer header — green section with user info */}
            <div style={styles.drawerHeader}>
              <button onClick={() => setDrawerOpen(false)} style={styles.closeBtn}>
                <X size={22} style={{ color: '#FFFFFF' }} />
              </button>
              <div style={styles.drawerAvatar}>
                <User size={36} style={{ color: '#FFFFFF' }} />
              </div>
              <p style={styles.drawerEmail}>{user.email}</p>
              <span style={styles.drawerRole}>
                {user.role}
                {isPremium && <span style={styles.drawerPro}> · PRO</span>}
              </span>
            </div>

            {/* Drawer menu items */}
            <div style={styles.drawerBody}>
              {user.role === 'Expert' && (
                <>
                  <Link
                    to="/expert"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <LayoutDashboard size={20} style={{ color: '#495057' }} />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/expert/ideas"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Lightbulb size={20} style={{ color: '#495057' }} />
                    <span>My Ideas</span>
                  </Link>
                  <Link
                    to="/expert/pilot-projects"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Sprout size={20} style={{ color: '#495057' }} />
                    <span>Pilot Projects</span>
                  </Link>
                  <Link
                    to="/expert/collaborations"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Users size={20} style={{ color: '#495057' }} />
                    <span>Collaborations</span>
                  </Link>
                  <Link
                    to="/expert/messages"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <MessageCircle size={20} style={{ color: '#495057' }} />
                    <span>Messages</span>
                  </Link>
                  <div style={styles.drawerDivider} />
                  <Link
                    to="/expert/profile"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <User size={20} style={{ color: '#495057' }} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/expert/settings"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Settings size={20} style={{ color: '#495057' }} />
                    <span>Settings</span>
                  </Link>
                </>
              )}

            {user.role === 'Investor' && (
                <>
                  <Link
                    to="/investor"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <Home size={20} style={{ color: '#495057' }} />
                    <span>Home</span>
                  </Link>

                  <Link
                    to="/investor/dashboard"
                    style={styles.drawerItem}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <LayoutDashboard size={20} style={{ color: '#495057' }} />
                    <span>Dashboard</span>
                    {totalUnread > 0 && (
                      <span style={{ ...styles.navBadge, marginLeft: 'auto' }}>{totalUnread}</span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link
                    to="/investor/messages"
                    style={{
                      ...styles.drawerItem,
                      color: '#212529',
                      textDecoration: 'none',
                    }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <MessageCircle size={20} style={{ color: '#495057' }} />
                    <span>Messages</span>
                    {totalUnread > 0 && (
                      <span style={{ ...styles.navBadge, marginLeft: 'auto' }}>{totalUnread}</span>
                    )}
                  </Link>

                  {/* Upgrade to Premium */}
                  {!isPremium && (
                    <Link
                      to="/investor/premium"
                      style={styles.drawerPremiumItem}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Star size={20} style={{ color: '#F39C12' }} />
                      <div>
                        <span style={styles.premiumItemTitle}>Upgrade to Premium</span>
                        <span style={styles.premiumItemDesc}>
                          3,000/month or 30,000 DZD/year — Save 6,000 DZD
                        </span>
                      </div>
                    </Link>
                  )}

                  <div style={styles.drawerDivider} />

                  <div style={{ ...styles.drawerItem, color: '#ADB5BD', cursor: 'default' }}>
                    <Settings size={20} style={{ color: '#ADB5BD' }} />
                    <span>Settings</span>
                  </div>
                </>
              )}

              <button onClick={handleLogout} style={styles.drawerLogout}>
                <LogOut size={20} style={{ color: '#495057' }} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#2D6A3F',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1.25rem',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
  },
  logo: {
    height: '52px',
    objectFit: 'contain',
    filter: 'brightness(10)',
  },
  navBadge: {
    minWidth: '18px',
    height: '18px',
    borderRadius: '99px',
    backgroundColor: '#E74C3C',
    color: '#FFFFFF',
    fontSize: '0.625rem',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
    marginLeft: '4px',
  },
  navDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    display: 'inline-block',
    marginLeft: '4px',
    flexShrink: 0,
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    transition: 'background 0.15s',
  },
  premiumLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0.875rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#F1C40F',
    textDecoration: 'none',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  avatarSmall: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
  },
  proLabel: {
    fontSize: '0.625rem',
    fontWeight: 700,
    color: '#F1C40F',
    backgroundColor: 'rgba(241,196,15,0.15)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  menuBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    cursor: 'pointer',
    borderRadius: '0.5rem',
  },
  /* ── Drawer ─────────────── */
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '300px',
    maxWidth: '85vw',
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
    animation: 'slideInRight 0.25s ease-out',
  },
  drawerHeader: {
    background: 'linear-gradient(135deg, #2D6A3F 0%, #3C8C54 100%)',
    padding: '2rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  drawerAvatar: {
    width: '64px',
    height: '64px',
    borderRadius: '1rem',
    backgroundColor: 'rgba(255,255,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.75rem',
  },
  drawerEmail: {
    margin: 0,
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#FFFFFF',
  },
  drawerRole: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.7)',
    marginTop: '0.125rem',
  },
  drawerPro: {
    color: '#F1C40F',
    fontWeight: 700,
  },
  drawerBody: {
    flex: 1,
    padding: '0.75rem 0',
    overflowY: 'auto',
  },
  drawerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    color: '#212529',
    textDecoration: 'none',
    fontSize: '0.9375rem',
    fontWeight: 500,
    transition: 'background 0.1s',
    cursor: 'pointer',
  },
  drawerPremiumItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.5rem',
    textDecoration: 'none',
    borderTop: '1px solid #F1F3F5',
    borderBottom: '1px solid #F1F3F5',
    margin: '0.25rem 0',
  },
  premiumItemTitle: {
    display: 'block',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: '#212529',
  },
  premiumItemDesc: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#6C757D',
    marginTop: '0.125rem',
    lineHeight: 1.4,
  },
  drawerDivider: {
    height: '1px',
    backgroundColor: '#F1F3F5',
    margin: '0.25rem 1.5rem',
  },
  drawerLogout: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#212529',
    fontSize: '0.9375rem',
    fontWeight: 500,
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'inherit',
  },
};
