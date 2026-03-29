import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { useToast } from '@/contexts/ToastContext';
import { getPilotStatusMeta } from '@/models/expertIdea';
import {
  ArrowLeft, MapPin, Calendar, TrendingUp, Users,
  Bookmark, BookmarkCheck, CheckCircle2, Handshake, Sprout, Tag,
} from 'lucide-react';

export function ExpertProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getPilotProjectById, requestCollaboration, isCollaborating, toggleSaveProject, isProjectSaved } = useExpert();

  const project = projectId ? getPilotProjectById(projectId) : undefined;

  if (!project) {
    return (
      <div style={S.notFound}>
        <div style={S.nfIcon}><Sprout size={36} color="#94a3b8" /></div>
        <h2 style={{ margin: '0 0 0.35rem', color: '#334155', fontWeight: 700 }}>Project Not Found</h2>
        <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          This project may have been removed or you followed an invalid link.
        </p>
        <button onClick={() => navigate('/expert/pilot-projects')} style={S.gradBtn}>
          <ArrowLeft size={16} /> Back to Pilot Projects
        </button>
      </div>
    );
  }

  const meta = getPilotStatusMeta(project.status);
  const collaborating = isCollaborating(project.id);
  const saved = isProjectSaved(project.id);
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topInner}>
          <button onClick={() => navigate(-1)} style={S.backBtn}><ArrowLeft size={16} /> Back</button>
          <span style={{ ...S.statusBadge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
        </div>
      </div>

      {/* Hero */}
      {project.images[0] && (
        <div style={S.hero}>
          <img src={project.images[0]} alt={project.title} style={S.heroImg}
            onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
          <div style={S.heroGrad} />
        </div>
      )}

      {/* Body */}
      <div style={S.body}>
        <div style={S.grid}>
          {/* Main */}
          <div style={S.main}>
            <span style={S.catLabel}>{project.category}</span>
            <h1 style={S.h1}>{project.title}</h1>

            {/* Farmer */}
            <div style={S.farmerCard}>
              <div style={S.farmerAv}>{project.farmerName.charAt(0).toUpperCase()}</div>
              <div>
                <p style={S.farmerN}>{project.farmerName}</p>
                <p style={S.farmerR}><MapPin size={13} /> {project.farmerRegion}</p>
              </div>
              {project.isParticipating && (
                <span style={S.partTag}><CheckCircle2 size={14} /> Participating</span>
              )}
            </div>

            {/* About */}
            <section>
              <h2 style={S.secTitle}>About this Project</h2>
              <p style={S.descText}>{project.description}</p>
            </section>

            {/* Meta Grid */}
            <section>
              <h2 style={S.secTitle}>Project Details</h2>
              <div style={S.metaGrid}>
                {[
                  { icon: <TrendingUp size={18} />, grad: 'linear-gradient(135deg,#10b981,#059669)', lbl: 'Budget', val: `${project.budget.toLocaleString()} DZD` },
                  { icon: <Calendar size={18} />, grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', lbl: 'Posted On', val: fmtDate(project.createdAt) },
                  { icon: <Users size={18} />, grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', lbl: 'Participation', val: project.isParticipating ? 'You + others' : 'Open' },
                  { icon: <Tag size={18} />, grad: 'linear-gradient(135deg,#f59e0b,#d97706)', lbl: 'Status', val: meta.label, valColor: meta.color },
                ].map((m, i) => (
                  <div key={i} style={S.metaItem}>
                    <div style={{ ...S.metaIcWrap, background: m.grad }}>{React.cloneElement(m.icon, { color: '#fff' })}</div>
                    <div>
                      <p style={S.metaLbl}>{m.lbl}</p>
                      <p style={{ ...S.metaVal, color: m.valColor || '#0f172a' }}>{m.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Expertise */}
            {project.requiredExpertise.length > 0 && (
              <section>
                <h2 style={S.secTitle}>Required Expertise</h2>
                <div style={S.chipRow}>
                  {project.requiredExpertise.map((ex) => (
                    <span key={ex} style={S.chip}>{ex}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside style={S.sidebar}>
            {/* Collab CTA */}
            <div style={S.sideCard}>
              <h3 style={S.sideH}><Handshake size={18} color="#3b82f6" /> Collaboration</h3>
              {collaborating ? (
                <div style={S.collabDone}>
                  <CheckCircle2 size={20} color="#10b981" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>Collaboration Requested</p>
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>The farmer will review and respond.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p style={S.sideDesc}>
                    Work with {project.farmerName} on this pilot project. Share your expertise and get compensated.
                  </p>
                  <button onClick={() => { requestCollaboration(project); showToast('Collaboration requested', 'success'); }}
                    disabled={project.status !== 'open'}
                    style={{ ...S.gradBtn, width: '100%', opacity: project.status === 'open' ? 1 : 0.45,
                      cursor: project.status === 'open' ? 'pointer' : 'not-allowed' }}>
                    <Handshake size={16} />
                    {project.status === 'open' ? 'Request Collaboration' : 'No Longer Accepting'}
                  </button>
                </>
              )}
            </div>

            {/* Save */}
            <div style={S.sideCard}>
              <h3 style={S.sideH}>
                {saved ? <BookmarkCheck size={18} color="#3b82f6" /> : <Bookmark size={18} color="#64748b" />}
                Saved Projects
              </h3>
              <button onClick={() => { toggleSaveProject(project.id); showToast(saved ? 'Project removed from saved' : 'Project saved', saved ? 'info' : 'success'); }}
                style={{
                  ...S.saveBtn,
                  backgroundColor: saved ? '#eff6ff' : '#f8fafc',
                  borderColor: saved ? '#bfdbfe' : '#e2e8f0',
                  color: saved ? '#2563eb' : '#475569',
                }}>
                {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save Project</>}
              </button>
            </div>

            {/* Quick Stats */}
            <div style={S.sideCard}>
              <h3 style={S.sideH}><Sprout size={18} color="#10b981" /> Quick Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { val: project.isParticipating ? 'Joined' : 'Open', color: project.isParticipating ? '#10b981' : '#3b82f6', lbl: 'Participation' },
                  { val: meta.label, color: meta.color, lbl: 'Status' },
                ].map((s, i) => (
                  <div key={i} style={S.qsBox}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: s.color }}>{s.val}</span>
                    <span style={{ fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.lbl}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
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
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc' },

  notFound: { minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', textAlign: 'center', backgroundColor: '#f8fafc' },
  nfIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '18px', backgroundColor: '#f1f5f9', marginBottom: '0.5rem' },

  topBar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem' },
  topInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  statusBadge: { padding: '4px 14px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700 },

  hero: { position: 'relative', height: '300px', overflow: 'hidden', backgroundColor: '#1e293b' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))' },

  body: { padding: '1.75rem 1.5rem' },
  grid: { maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', alignItems: 'start' },

  main: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  catLabel: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' },
  h1: { margin: '0.25rem 0 0', fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.02em' },

  farmerCard: { ...card, display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem' },
  farmerAv: {
    width: '44px', height: '44px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.125rem', fontWeight: 700, flexShrink: 0,
  },
  farmerN: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' },
  farmerR: { margin: 0, fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' },
  partTag: {
    display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto', padding: '4px 12px',
    borderRadius: '6px', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.8125rem', fontWeight: 700,
    border: '1px solid #a7f3d0',
  },

  secTitle: { margin: '0 0 0.75rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' },
  descText: { margin: 0, color: '#475569', lineHeight: 1.65, fontSize: '0.9375rem' },

  metaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' },
  metaItem: { ...card, display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem' },
  metaIcWrap: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  metaLbl: { margin: '0 0 1px', fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  metaVal: { margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' },

  chipRow: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  chip: { padding: '5px 14px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '0.8125rem', fontWeight: 600, border: '1px solid #bfdbfe' },

  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1.5rem' },
  sideCard: { ...card, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  sideH: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  sideDesc: { margin: 0, fontSize: '0.8375rem', color: '#64748b', lineHeight: 1.5 },

  gradBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.6875rem 1.25rem', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.875rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },

  collabDone: {
    display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.875rem',
    backgroundColor: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0',
  },

  saveBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.625rem',
    border: '1.5px solid', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },

  qsBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.75rem',
    backgroundColor: '#f8fafc', borderRadius: '10px', gap: '0.125rem', border: '1px solid #f1f5f9',
  },
};
