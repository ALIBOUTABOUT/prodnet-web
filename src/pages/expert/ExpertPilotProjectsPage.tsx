import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { useToast } from '@/contexts/ToastContext';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import { SkeletonCard } from '@/components/UI/SkeletonCard';
import { PilotProjectStatus, getPilotStatusMeta } from '@/models/expertIdea';
import {
  MapPin, TrendingUp, Calendar, Eye, CheckCircle2,
  Sprout, ChevronRight, Search, X as XIcon,
} from 'lucide-react';

type StatusFilter = 'all' | PilotProjectStatus;
const STATUS_CHIPS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

export function ExpertPilotProjectsPage() {
  const { pilotProjects, toggleParticipation } = useExpert();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = pilotProjects.filter((p) => {
    const statusMatch = statusFilter === 'all' || p.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = !q || p.title.toLowerCase().includes(q) || p.farmerName.toLowerCase().includes(q) || p.farmerRegion.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>Pilot Projects</h1>
            <p style={S.sub}>Real farm projects looking for expert knowledge</p>
          </div>
          <div style={S.statPill}>
            <Sprout size={15} />
            {pilotProjects.filter((p) => p.isParticipating).length} joined
          </div>
        </div>

        {/* Toolbar */}
        <div style={S.toolbar}>
          <div style={S.chips}>
            {STATUS_CHIPS.map((c) => {
              const count = c.id === 'all' ? pilotProjects.length : pilotProjects.filter((p) => p.status === c.id).length;
              const active = statusFilter === c.id;
              return (
                <button key={c.id} onClick={() => setStatusFilter(c.id)} style={{
                  ...S.chip,
                  background: active ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : '#ffffff',
                  color: active ? '#ffffff' : '#475569',
                  borderColor: active ? 'transparent' : '#e2e8f0',
                  boxShadow: active ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                }}>
                  {c.label}
                  <span style={{
                    ...S.chipCount,
                    backgroundColor: active ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: active ? '#ffffff' : '#64748b',
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
          <div style={S.searchBox}>
            <Search size={15} style={S.searchIc} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isMobile ? 'Search...' : 'Search projects, farmers...'} style={{ ...S.searchIn, width: isMobile ? '160px' : '240px' }} />
            {searchQuery && <button onClick={() => setSearchQuery('')} style={S.searchX}><XIcon size={13} /></button>}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={{ ...S.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {[1, 2, 3].map((n) => <SkeletonCard key={n} withImage lines={4} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={S.emptyIcon}><Sprout size={36} color="#94a3b8" /></div>
            <h3 style={S.emptyH}>No projects found</h3>
            <p style={S.emptyP}>Check back later for new pilot project opportunities.</p>
          </div>
        ) : (
          <div style={{ ...S.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))' }}>
            {filtered.map((project) => {
              const meta = getPilotStatusMeta(project.status);
              const canRequest = project.status === 'open' && !project.isParticipating;
              return (
                <div key={project.id} style={{ ...S.card, cursor: 'pointer' }} onClick={() => navigate(`/expert/project/${project.id}`)}>
                  {project.images[0] && (
                    <div style={S.cardImg}>
                      <img src={project.images[0]} alt={project.title} style={S.cardImgEl}
                        onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
                      <div style={S.cardImgGrad} />
                      <span style={{ ...S.imgBadge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
                      {project.isParticipating && (
                        <span style={S.joinedBadge}><CheckCircle2 size={12} /> Joined</span>
                      )}
                    </div>
                  )}
                  <div style={S.cardBody}>
                    <span style={S.catTag}>{project.category}</span>
                    <h3 style={S.cardTitle}>{project.title}</h3>

                    {/* Farmer */}
                    <div style={S.farmerRow}>
                      <div style={S.farmerAv}>{project.farmerName.charAt(0).toUpperCase()}</div>
                      <div>
                        <p style={S.farmerN}>{project.farmerName}</p>
                        <p style={S.farmerR}><MapPin size={11} /> {project.farmerRegion}</p>
                      </div>
                    </div>

                    <p style={S.desc}>{project.description}</p>

                    {project.requiredExpertise.length > 0 && (
                      <div style={S.skillRow}>
                        {project.requiredExpertise.slice(0, 3).map((ex) => (
                          <span key={ex} style={S.skillChip}>{ex}</span>
                        ))}
                        {project.requiredExpertise.length > 3 && <span style={S.skillChip}>+{project.requiredExpertise.length - 3}</span>}
                      </div>
                    )}

                    <div style={S.statsRow}>
                      <span style={S.stat}><TrendingUp size={13} />{project.budget.toLocaleString()} DZD</span>
                      <span style={S.stat}><Calendar size={13} />{fmtDate(project.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div style={S.actions} onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => navigate(`/expert/project/${project.id}`)} style={S.viewBtn}>
                        <Eye size={15} /> Details <ChevronRight size={14} />
                      </button>
                      {project.isParticipating ? (
                        <div style={S.joinedTag}><CheckCircle2 size={15} /> Participating</div>
                      ) : (
                        <button onClick={() => { toggleParticipation(project.id); showToast('Participation requested', 'success'); }}
                          disabled={!canRequest} style={{ ...S.reqBtn, opacity: canRequest ? 1 : 0.45, cursor: canRequest ? 'pointer' : 'not-allowed' }}>
                          {project.status === 'completed' ? 'Completed' : 'Request to Join'}
                        </button>
                      )}
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
  wrap: { maxWidth: '1200px', margin: '0 auto' },

  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  title: { margin: '0 0 0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  sub: { margin: 0, fontSize: '0.875rem', color: '#64748b' },
  statPill: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem',
    borderRadius: '99px', backgroundColor: '#ecfdf5', color: '#059669', fontSize: '0.875rem', fontWeight: 600,
    border: '1px solid #a7f3d0',
  },

  toolbar: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center', justifyContent: 'space-between' },
  chips: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem',
    border: '1.5px solid', borderRadius: '99px', fontSize: '0.8125rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
  },
  chipCount: { padding: '0 6px', borderRadius: '99px', fontSize: '0.6875rem', fontWeight: 700 },

  searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIc: { position: 'absolute', left: '10px', color: '#94a3b8', pointerEvents: 'none' } as React.CSSProperties,
  searchIn: {
    padding: '0.5rem 2rem 0.5rem 2.125rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.8125rem', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a',
  },
  searchX: { position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 } as React.CSSProperties,

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' },

  empty: { ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', gap: '0.75rem', textAlign: 'center' },
  emptyIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#f1f5f9' },
  emptyH: { margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#334155' },
  emptyP: { margin: 0, color: '#64748b', fontSize: '0.875rem' },

  card: { ...base, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImg: { position: 'relative', height: '160px', overflow: 'hidden', backgroundColor: '#f1f5f9' },
  cardImgEl: { width: '100%', height: '100%', objectFit: 'cover' },
  cardImgGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.12))' },
  imgBadge: { position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700 } as React.CSSProperties,
  joinedBadge: {
    position: 'absolute', top: '10px', right: '10px', display: 'flex', alignItems: 'center', gap: '4px',
    padding: '3px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700,
    backgroundColor: '#ecfdf5', color: '#059669',
  } as React.CSSProperties,

  cardBody: { padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  catTag: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' },
  cardTitle: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 },

  farmerRow: { display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
  farmerAv: {
    width: '32px', height: '32px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.875rem', fontWeight: 700, flexShrink: 0,
  },
  farmerN: { margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' },
  farmerR: { margin: 0, fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' },

  desc: { margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties,

  skillRow: { display: 'flex', gap: '0.375rem', flexWrap: 'wrap' },
  skillChip: { padding: '2px 10px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.6875rem', fontWeight: 600, border: '1px solid #e2e8f0' },

  statsRow: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
  stat: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#64748b' },

  actions: { display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' },
  viewBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc',
    color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  reqBtn: {
    flex: 1, padding: '0.5rem 1rem', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
  },
  joinedTag: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', flex: 1, padding: '0.5rem 1rem',
    borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669',
    fontSize: '0.8125rem', fontWeight: 600, justifyContent: 'center', border: '1px solid #a7f3d0',
  },
};
