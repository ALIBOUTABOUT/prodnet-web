import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { getCollabStatusMeta, getPilotStatusMeta } from '@/models/expertIdea';
import {
  MapPin, Calendar, MessageCircle, ExternalLink, Handshake, ChevronRight,
} from 'lucide-react';

export function ExpertCollaborationsPage() {
  const { collaborations, pilotProjects } = useExpert();
  const navigate = useNavigate();

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const ORDER: Record<string, number> = { active: 0, pending: 1, completed: 2 };
  const sorted = [...collaborations].sort((a, b) => ORDER[a.status] - ORDER[b.status]);

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Collaborations</h1>
            <p style={S.sub}>
              {collaborations.filter((c) => c.status === 'active').length} active collaboration
              {collaborations.filter((c) => c.status === 'active').length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={S.statGroup}>
            {[
              { count: collaborations.filter((c) => c.status === 'pending').length, label: 'pending', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
              { count: collaborations.filter((c) => c.status === 'active').length, label: 'active', color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0' },
            ].map((s) => (
              <div key={s.label} style={{ ...S.statPill, backgroundColor: s.bg, borderColor: s.border }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 800, color: s.color }}>{s.count}</span>
                <span style={{ fontSize: '0.6875rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List or Empty */}
        {sorted.length === 0 ? (
          <div style={S.empty}>
            <div style={S.emptyIcon}><Handshake size={36} color="#94a3b8" /></div>
            <h3 style={{ margin: '0 0 0.25rem', color: '#334155', fontWeight: 700 }}>No collaborations yet</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              Browse pilot projects and request participation to start collaborating with farmers.
            </p>
            <button onClick={() => navigate('/expert/pilot-projects')} style={S.gradBtn}>
              Browse Pilot Projects <ChevronRight size={15} />
            </button>
          </div>
        ) : (
          <div style={S.list}>
            {sorted.map((collab) => {
              const meta = getCollabStatusMeta(collab.status);
              const project = pilotProjects.find((p) => p.id === collab.projectId);
              const projMeta = project ? getPilotStatusMeta(project.status) : null;

              return (
                <div key={collab.id} style={S.card}>
                  {/* Image strip */}
                  {project?.images[0] && (
                    <div style={S.imgStrip}>
                      <img src={project.images[0]} alt={project.title} style={S.stripImg}
                        onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
                    </div>
                  )}

                  <div style={S.cardBody}>
                    {/* Top row */}
                    <div style={S.topRow}>
                      <div style={S.titleGroup}>
                        <span style={S.catLabel}>{collab.category}</span>
                        <h3 style={S.cardTitle}>{collab.projectTitle}</h3>
                      </div>
                      <div style={S.badges}>
                        <span style={{ ...S.badge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
                        {projMeta && <span style={{ ...S.badge, color: projMeta.color, backgroundColor: projMeta.bg }}>{projMeta.label}</span>}
                      </div>
                    </div>

                    {/* Farmer */}
                    <div style={S.farmerRow}>
                      <div style={S.farmerAv}>{collab.farmerName.charAt(0).toUpperCase()}</div>
                      <div>
                        <p style={S.farmerN}>{collab.farmerName}</p>
                        <p style={S.farmerR}><MapPin size={11} /> {collab.farmerRegion}</p>
                      </div>
                    </div>

                    {collab.description && <p style={S.desc}>{collab.description}</p>}

                    <div style={S.timeRow}>
                      <span style={S.timeChip}><Calendar size={12} /> Last activity {fmtDate(collab.lastInteraction)}</span>
                    </div>

                    {/* Actions */}
                    <div style={S.actions}>
                      {project && (
                        <button onClick={() => navigate(`/expert/project/${project.id}`)} style={S.viewBtn}>
                          <ExternalLink size={14} /> View Project
                        </button>
                      )}
                      <button disabled style={S.msgBtn} title="Messaging coming soon">
                        <MessageCircle size={14} /> Message
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const base: React.CSSProperties = {
  backgroundColor: '#ffffff', borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0',
};

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc', padding: '2rem 1.5rem' },
  wrap: { maxWidth: '900px', margin: '0 auto' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { margin: '0 0 0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  sub: { margin: 0, fontSize: '0.875rem', color: '#64748b' },
  statGroup: { display: 'flex', gap: '0.5rem' },
  statPill: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.625rem 1rem',
    borderRadius: '12px', border: '1px solid', minWidth: '60px',
  },

  empty: { ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', gap: '0.75rem', textAlign: 'center' },
  emptyIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '68px', height: '68px', borderRadius: '18px', backgroundColor: '#f1f5f9', marginBottom: '0.25rem' },
  gradBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem',
    border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#ffffff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)', marginTop: '0.5rem',
  },

  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },

  card: { ...base, display: 'flex', overflow: 'hidden' },
  imgStrip: { width: '110px', flexShrink: 0, backgroundColor: '#f1f5f9' },
  stripImg: { width: '100%', height: '100%', objectFit: 'cover' },

  cardBody: { flex: 1, padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 0 },

  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', flexWrap: 'wrap' },
  titleGroup: { display: 'flex', flexDirection: 'column', gap: '0.1rem', minWidth: 0 },
  catLabel: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.04em' },
  cardTitle: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties,
  badges: { display: 'flex', gap: '0.375rem', flexShrink: 0 },
  badge: { padding: '2px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, whiteSpace: 'nowrap' } as React.CSSProperties,

  farmerRow: { display: 'flex', alignItems: 'center', gap: '0.625rem' },
  farmerAv: {
    width: '32px', height: '32px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
  },
  farmerN: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' },
  farmerR: { margin: 0, fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' },

  desc: {
    margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.45,
    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
  } as React.CSSProperties,

  timeRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  timeChip: { display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.75rem', color: '#94a3b8' },

  actions: { display: 'flex', gap: '0.625rem', flexWrap: 'wrap', paddingTop: '0.625rem', borderTop: '1px solid #f1f5f9', marginTop: 'auto' },
  viewBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  msgBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc',
    color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 600, cursor: 'not-allowed', fontFamily: 'inherit',
  },
};
