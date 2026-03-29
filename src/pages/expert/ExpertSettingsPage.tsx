import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  ArrowLeft, Bell, Shield, Globe, Moon, LogOut,
  ChevronRight, ToggleLeft, ToggleRight,
} from 'lucide-react';

interface ToggleItem {
  label: string;
  desc: string;
  key: string;
}

export function ExpertSettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    emailNotif: true,
    pushNotif: true,
    investorAlerts: true,
    profilePublic: true,
    darkMode: false,
  });

  const flip = (key: string) => {
    setToggles((t) => ({ ...t, [key]: !t[key] }));
    showToast('Setting updated', 'success');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.topBar}>
          <button onClick={() => navigate('/expert')} style={S.backBtn}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          <h1 style={S.h1}>Settings</h1>
          <div style={{ width: '100px' }} />
        </div>

        {/* Notifications */}
        <Section title="Notifications" icon={<Bell size={18} />}>
          {([
            { label: 'Email Notifications', desc: 'Receive updates via email', key: 'emailNotif' },
            { label: 'Push Notifications', desc: 'Get real-time browser alerts', key: 'pushNotif' },
            { label: 'Investor Interest Alerts', desc: 'Notify when investors show interest', key: 'investorAlerts' },
          ] as ToggleItem[]).map((item) => (
            <ToggleRow key={item.key} item={item} value={toggles[item.key]} onToggle={() => flip(item.key)} />
          ))}
        </Section>

        {/* Privacy */}
        <Section title="Privacy" icon={<Shield size={18} />}>
          <ToggleRow item={{ label: 'Public Profile', desc: 'Allow others to discover your profile', key: 'profilePublic' }}
            value={toggles.profilePublic} onToggle={() => flip('profilePublic')} />
          <LinkRow label="Manage Profile" desc="Edit your expert information"
            onClick={() => navigate('/expert/profile')} />
        </Section>

        {/* Appearance */}
        <Section title="Appearance" icon={<Moon size={18} />}>
          <ToggleRow item={{ label: 'Dark Mode', desc: 'Switch to dark theme', key: 'darkMode' }}
            value={toggles.darkMode} onToggle={() => flip('darkMode')} />
        </Section>

        {/* Language */}
        <Section title="Language" icon={<Globe size={18} />}>
          <LinkRow label="App Language" desc="English (US)" onClick={() => showToast('Language settings coming soon', 'info')} />
        </Section>

        {/* Account */}
        <div style={S.card}>
          <button onClick={handleLogout} style={S.logoutBtn}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={S.card}>
      <div style={S.secHead}>
        <span style={S.secIcon}>{icon}</span>
        <h2 style={S.secTitle}>{title}</h2>
      </div>
      <div style={S.secBody}>{children}</div>
    </div>
  );
}

function ToggleRow({ item, value, onToggle }: { item: ToggleItem; value: boolean; onToggle: () => void }) {
  return (
    <div style={S.row}>
      <div>
        <p style={S.rowLabel}>{item.label}</p>
        <p style={S.rowDesc}>{item.desc}</p>
      </div>
      <button onClick={onToggle} style={S.toggleBtn}>
        {value ? <ToggleRight size={28} color="#3b82f6" /> : <ToggleLeft size={28} color="#cbd5e1" />}
      </button>
    </div>
  );
}

function LinkRow({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={S.linkRow}>
      <div>
        <p style={S.rowLabel}>{label}</p>
        <p style={S.rowDesc}>{desc}</p>
      </div>
      <ChevronRight size={18} color="#94a3b8" />
    </button>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '1.5rem 1.25rem' },
  wrap: { maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' },

  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  h1: { margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },

  card: {
    backgroundColor: '#ffffff', borderRadius: '14px', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  secHead: { display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9' },
  secIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6' },
  secTitle: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' },
  secBody: { display: 'flex', flexDirection: 'column' },

  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderBottom: '1px solid #f8fafc' },
  rowLabel: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' },
  rowDesc: { margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' },
  toggleBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px', display: 'flex' },

  linkRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem',
    width: '100%', border: 'none', borderBottom: '1px solid #f8fafc',
    backgroundColor: 'transparent', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
  } as React.CSSProperties,

  logoutBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    width: '100%', padding: '1rem', border: 'none', backgroundColor: 'transparent',
    color: '#dc2626', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },
};
