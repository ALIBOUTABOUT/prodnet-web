import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  User, Mail, Phone, MapPin, Briefcase, GraduationCap,
  Award, Linkedin, FileText, Edit3, ArrowLeft,
  Save, X,
} from 'lucide-react';

type Mode = 'view' | 'edit';

export function ExpertProfilePage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('view');

  const profile = user as import('@/models/user').ExpertProfile | null;

  const [form, setForm] = useState({
    fullName: profile?.fullName || '',
    phone: profile?.phone || '',
    region: profile?.region || '',
    bio: profile?.bio || '',
    specialization: (profile as any)?.specialization || '',
    experience: (profile as any)?.experience || '',
    education: (profile as any)?.education || '',
    certifications: (profile as any)?.certifications?.join(', ') || '',
    linkedinUrl: (profile as any)?.linkedinUrl || '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = () => {
    showToast('Profile updated successfully!', 'success');
    setMode('view');
  };

  const handleCancel = () => {
    setForm({
      fullName: profile?.fullName || '',
      phone: profile?.phone || '',
      region: profile?.region || '',
      bio: profile?.bio || '',
      specialization: (profile as any)?.specialization || '',
      experience: (profile as any)?.experience || '',
      education: (profile as any)?.education || '',
      certifications: (profile as any)?.certifications?.join(', ') || '',
      linkedinUrl: (profile as any)?.linkedinUrl || '',
    });
    setMode('view');
  };

  const infoItems = [
    { icon: <Mail size={16} />, label: 'Email', value: profile?.email },
    { icon: <Phone size={16} />, label: 'Phone', value: form.phone || '—' },
    { icon: <MapPin size={16} />, label: 'Region', value: form.region || '—' },
    { icon: <Briefcase size={16} />, label: 'Specialization', value: form.specialization || '—' },
    { icon: <Award size={16} />, label: 'Experience', value: form.experience || '—' },
    { icon: <GraduationCap size={16} />, label: 'Education', value: form.education || '—' },
    { icon: <Linkedin size={16} />, label: 'LinkedIn', value: form.linkedinUrl || '—' },
  ];

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Top bar */}
        <div style={S.topBar}>
          <button onClick={() => navigate('/expert')} style={S.backBtn}>
            <ArrowLeft size={16} /> Dashboard
          </button>
          {mode === 'view' ? (
            <button onClick={() => setMode('edit')} style={S.editBtn}><Edit3 size={15} /> Edit Profile</button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleCancel} style={S.cancelBtn}><X size={15} /> Cancel</button>
              <button onClick={handleSave} style={S.saveBtn}><Save size={15} /> Save</button>
            </div>
          )}
        </div>

        {/* Header card */}
        <div style={S.headerCard}>
          <div style={S.avatarArea}>
            <div style={S.avatar}>
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '18px' }} />
              ) : (
                <User size={36} color="#ffffff" />
              )}
            </div>
            <div>
              {mode === 'view' ? (
                <>
                  <h1 style={S.h1}>{form.fullName || 'Expert'}</h1>
                  <p style={S.role}>{form.specialization || 'Agricultural Expert'}</p>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input style={S.editInput} value={form.fullName} onChange={set('fullName')} placeholder="Full Name" />
                </div>
              )}
            </div>
          </div>
          {form.bio && mode === 'view' && (
            <p style={S.bio}>{form.bio}</p>
          )}
          {mode === 'edit' && (
            <textarea style={{ ...S.editInput, minHeight: '80px', resize: 'vertical', marginTop: '1rem' } as React.CSSProperties}
              value={form.bio} onChange={set('bio')} placeholder="Write a short bio..." />
          )}
        </div>

        {/* Info / Edit */}
        <div style={S.infoCard}>
          <h2 style={S.secTitle}>Profile Information</h2>
          {mode === 'view' ? (
            <div style={S.infoGrid}>
              {infoItems.map((item, i) => (
                <div key={i} style={S.infoItem}>
                  <div style={S.infoIcon}>{item.icon}</div>
                  <div>
                    <p style={S.infoLabel}>{item.label}</p>
                    <p style={S.infoVal}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={S.editGrid}>
              {[
                { k: 'phone', label: 'Phone', icon: <Phone size={14} /> },
                { k: 'region', label: 'Region', icon: <MapPin size={14} /> },
                { k: 'specialization', label: 'Specialization', icon: <Briefcase size={14} /> },
                { k: 'experience', label: 'Experience', icon: <Award size={14} /> },
                { k: 'education', label: 'Education', icon: <GraduationCap size={14} /> },
                { k: 'linkedinUrl', label: 'LinkedIn URL', icon: <Linkedin size={14} /> },
              ].map(({ k, label, icon }) => (
                <label key={k} style={S.editField}>
                  <span style={S.editLabel}>{icon} {label}</span>
                  <input style={S.editInput} value={(form as any)[k]} onChange={set(k)} />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div style={S.infoCard}>
          <h2 style={S.secTitle}>Certifications</h2>
          {mode === 'view' ? (
            form.certifications ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {form.certifications.split(',').filter(Boolean).map((c: string, i: number) => (
                  <span key={i} style={S.certBadge}><Award size={12} /> {c.trim()}</span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>No certifications added.</p>
            )
          ) : (
            <label style={S.editField}>
              <span style={S.editLabel}><Award size={14} /> Certifications (comma-separated)</span>
              <input style={S.editInput} value={form.certifications} onChange={set('certifications')} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff', borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0',
};

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '1.5rem 1.25rem' },
  wrap: { maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' },

  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  editBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(59,130,246,0.25)',
  },
  cancelBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff',
    fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
  },

  headerCard: { ...card, padding: '1.5rem' },
  avatarArea: { display: 'flex', alignItems: 'center', gap: '1.25rem' },
  avatar: {
    width: '80px', height: '80px', borderRadius: '18px', flexShrink: 0,
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  h1: { margin: '0 0 0.125rem', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  role: { margin: 0, fontSize: '0.9375rem', color: '#3b82f6', fontWeight: 600 },
  bio: { margin: '1rem 0 0', color: '#475569', lineHeight: 1.6, fontSize: '0.9375rem' },

  infoCard: { ...card, padding: '1.5rem' },
  secTitle: { margin: '0 0 1rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' },
  infoItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
  infoIcon: { width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 },
  infoLabel: { margin: 0, fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' } as React.CSSProperties,
  infoVal: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' },

  editGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' },
  editField: { display: 'flex', flexDirection: 'column', gap: '0.375rem' } as React.CSSProperties,
  editLabel: { display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' },
  editInput: {
    padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.875rem', fontFamily: 'inherit', color: '#0f172a', backgroundColor: '#f8fafc',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  } as React.CSSProperties,

  certBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    padding: '6px 12px', borderRadius: '8px', backgroundColor: '#f1f5f9',
    color: '#334155', fontSize: '0.8125rem', fontWeight: 600, border: '1px solid #e2e8f0',
  },
};
