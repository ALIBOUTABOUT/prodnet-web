import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import {
  User, GraduationCap, Briefcase, MapPin, Phone,
  Award, Linkedin, FileText, ArrowRight, CheckCircle,
} from 'lucide-react';

export function ExpertCompleteProfilePage() {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    specialization: '',
    experience: '',
    region: user?.region || '',
    education: '',
    certifications: '',
    linkedinUrl: '',
    bio: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.fullName.trim() && form.phone.trim() && form.specialization && form.experience;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    completeProfile();
    showToast('Profile completed successfully!', 'success');
    navigate('/expert');
  };

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        <div style={S.header}>
          <div style={S.headerIc}><GraduationCap size={28} color="#3b82f6" /></div>
          <h1 style={S.h1}>Complete Your Expert Profile</h1>
          <p style={S.subtitle}>Tell us about your expertise so farmers and investors can find you.</p>
        </div>

        <form onSubmit={handleSubmit} style={S.card}>
          {/* Required section */}
          <h2 style={S.secTitle}>Required Information</h2>
          <div style={S.grid}>
            <Field label="Full Name" icon={<User size={16} />} required>
              <input style={S.input} value={form.fullName} onChange={set('fullName')} placeholder="Enter your full name" />
            </Field>
            <Field label="Phone" icon={<Phone size={16} />} required>
              <input style={S.input} value={form.phone} onChange={set('phone')} placeholder="+213 ..." />
            </Field>
            <Field label="Specialization" icon={<Briefcase size={16} />} required>
              <select style={S.input} value={form.specialization} onChange={set('specialization')}>
                <option value="">Choose specialization</option>
                {['Agronomy', 'Soil Science', 'Agricultural Engineering', 'Animal Science', 'Food Technology', 'Water Management', 'Crop Science', 'Sustainable Farming', 'Other'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Experience" icon={<Award size={16} />} required>
              <select style={S.input} value={form.experience} onChange={set('experience')}>
                <option value="">Select experience level</option>
                {['0-2 years', '3-5 years', '5-10 years', '10-15 years', '15+ years'].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Region" icon={<MapPin size={16} />}>
              <input style={S.input} value={form.region} onChange={set('region')} placeholder="e.g. Algiers, Constantine" />
            </Field>
          </div>

          {/* Optional section */}
          <h2 style={{ ...S.secTitle, marginTop: '2rem' }}>Optional Details</h2>
          <div style={S.grid}>
            <Field label="Education" icon={<GraduationCap size={16} />}>
              <input style={S.input} value={form.education} onChange={set('education')} placeholder="Degree, University" />
            </Field>
            <Field label="Certifications" icon={<Award size={16} />}>
              <input style={S.input} value={form.certifications} onChange={set('certifications')} placeholder="Comma-separated values" />
            </Field>
            <Field label="LinkedIn URL" icon={<Linkedin size={16} />}>
              <input style={S.input} value={form.linkedinUrl} onChange={set('linkedinUrl')} placeholder="https://linkedin.com/in/..." />
            </Field>
          </div>
          <Field label="Bio" icon={<FileText size={16} />}>
            <textarea style={{ ...S.input, minHeight: '100px', resize: 'vertical' } as React.CSSProperties}
              value={form.bio} onChange={set('bio')} placeholder="A short description of your expertise..." />
          </Field>

          <button type="submit" disabled={!valid} style={{ ...S.submitBtn, opacity: valid ? 1 : 0.5 }}>
            <CheckCircle size={16} /> Complete Profile <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon, required, children }: { label: string; icon: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={S.field}>
      <span style={S.label}>
        {icon} {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </span>
      {children}
    </label>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '2rem 1.25rem', display: 'flex', justifyContent: 'center' },
  wrap: { maxWidth: '680px', width: '100%' },

  header: { textAlign: 'center', marginBottom: '1.5rem' },
  headerIc: { width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eff6ff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' },
  h1: { margin: '0 0 0.375rem', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, color: '#64748b', fontSize: '0.9375rem' },

  card: {
    backgroundColor: '#ffffff', borderRadius: '14px', padding: '1.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
    border: '1px solid #e2e8f0',
  },
  secTitle: { margin: '0 0 1rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.375rem' } as React.CSSProperties,
  label: { display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', fontWeight: 600, color: '#334155' },
  input: {
    padding: '0.5rem 0.75rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.875rem', fontFamily: 'inherit', color: '#0f172a', backgroundColor: '#f8fafc',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  } as React.CSSProperties,
  submitBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    width: '100%', padding: '0.875rem', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
    marginTop: '1.5rem', boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },
};
