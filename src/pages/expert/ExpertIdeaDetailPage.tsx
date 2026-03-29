import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { useToast } from '@/contexts/ToastContext';
import { getIdeaStatusMeta, formatBudgetRange } from '@/models/expertIdea';
import {
  ArrowLeft, Edit3, SendHorizontal, Archive, Trash2,
  MapPin, Calendar, TrendingUp, Users, Lightbulb,
  Mail, MessageCircle, CheckCircle2, Clock, Star,
} from 'lucide-react';

type Tab = 'details' | 'investors' | 'messages';

export function ExpertIdeaDetailPage() {
  const { ideaId } = useParams<{ ideaId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getIdeaById, setIdeaStatus, deleteIdea } = useExpert();
  const [activeTab, setActiveTab] = useState<Tab>('details');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const idea = ideaId ? getIdeaById(ideaId) : undefined;

  if (!idea) {
    return (
      <div style={S.notFound}>
        <div style={S.nfIcon}><Lightbulb size={36} color="#94a3b8" /></div>
        <h2 style={{ margin: '0 0 0.35rem', color: '#334155', fontWeight: 700 }}>Idea Not Found</h2>
        <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.875rem' }}>
          This idea may have been removed or you followed an invalid link.
        </p>
        <button onClick={() => navigate('/expert/ideas')} style={S.gradBtn}>
          <ArrowLeft size={16} /> Back to Ideas
        </button>
      </div>
    );
  }

  const meta = getIdeaStatusMeta(idea.status);
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const handleAdvance = () => {
    const next: Record<string, string | null> = {
      draft: 'published', published: 'readyForPilot',
      readyForPilot: 'pilotActive', pilotActive: 'completed',
      completed: null, archived: null,
    };
    const n = next[idea.status];
    if (n) {
      setIdeaStatus(idea.id, n as any);
      showToast(`Status updated to ${n}`, 'success');
    }
  };

  const handleArchive = () => {
    setIdeaStatus(idea.id, 'archived');
    showToast('Idea archived', 'info');
  };

  const handleDelete = () => {
    deleteIdea(idea.id);
    showToast('Idea deleted', 'info');
    navigate('/expert/ideas');
  };

  const statusIcon: Record<string, React.ReactNode> = {
    new: <Star size={14} color="#3b82f6" />,
    contacted: <Mail size={14} color="#f59e0b" />,
    negotiating: <MessageCircle size={14} color="#8b5cf6" />,
    committed: <CheckCircle2 size={14} color="#10b981" />,
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'details', label: 'Details' },
    { id: 'investors', label: `Investors (${idea.interests.length})` },
    { id: 'messages', label: 'Activity' },
  ];

  return (
    <div style={S.page}>
      {/* Top bar */}
      <div style={S.topBar}>
        <div style={S.topInner}>
          <button onClick={() => navigate('/expert/ideas')} style={S.backBtn}>
            <ArrowLeft size={16} /> Ideas
          </button>
          <div style={S.topActions}>
            <span style={{ ...S.badge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
            <button onClick={() => navigate(`/expert/ideas/new?edit=${idea.id}`)} style={S.topActBtn}><Edit3 size={15} /> Edit</button>
          </div>
        </div>
      </div>

      {/* Hero */}
      {idea.images[0] && (
        <div style={S.hero}>
          <img src={idea.images[0]} alt={idea.title} style={S.heroImg}
            onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = 'none')} />
          <div style={S.heroGrad} />
        </div>
      )}

      <div style={S.body}>
        <div style={S.wrap}>
          {/* Title */}
          <span style={S.catLabel}>{idea.category}</span>
          <h1 style={S.h1}>{idea.title}</h1>
          <p style={S.dateLine}><Calendar size={14} /> Created {fmtDate(idea.createdAt)} &middot; {idea.targetRegion}</p>

          {/* Tabs */}
          <div style={S.tabBar}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                ...S.tab, color: activeTab === t.id ? '#3b82f6' : '#64748b',
                borderBottomColor: activeTab === t.id ? '#3b82f6' : 'transparent',
                fontWeight: activeTab === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div style={S.twoCol}>
              <div style={S.mainCol}>
                <div style={S.section}>
                  <h2 style={S.secTitle}>Problem Statement</h2>
                  <p style={S.secText}>{idea.problemStatement}</p>
                </div>
                <div style={S.section}>
                  <h2 style={S.secTitle}>Proposed Solution</h2>
                  <p style={S.secText}>{idea.proposedSolution}</p>
                </div>
                {idea.detailedDescription && (
                  <div style={S.section}>
                    <h2 style={S.secTitle}>Detailed Description</h2>
                    <p style={S.secText}>{idea.detailedDescription}</p>
                  </div>
                )}
              </div>
              <aside style={S.sidebar}>
                {/* Stats */}
                <div style={S.sideCard}>
                  <h3 style={S.sideH}>Quick Stats</h3>
                  <div style={S.statsGrid}>
                    {[
                      { icon: <Users size={18} />, grad: 'linear-gradient(135deg,#f59e0b,#d97706)', label: 'Interested', val: String(idea.interestedInvestors) },
                      { icon: <TrendingUp size={18} />, grad: 'linear-gradient(135deg,#10b981,#059669)', label: 'Budget', val: idea.budgetMin > 0 || idea.budgetMax > 0 ? formatBudgetRange(idea.budgetMin, idea.budgetMax) : 'N/A' },
                      { icon: <MapPin size={18} />, grad: 'linear-gradient(135deg,#3b82f6,#6366f1)', label: 'Region', val: idea.targetRegion },
                    ].map((s, i) => (
                      <div key={i} style={S.statItem}>
                        <div style={{ ...S.statIc, background: s.grad }}>{React.cloneElement(s.icon, { color: '#fff' })}</div>
                        <div>
                          <p style={S.statLbl}>{s.label}</p>
                          <p style={S.statVal}>{s.val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={S.sideCard}>
                  <h3 style={S.sideH}>Actions</h3>
                  {idea.status !== 'completed' && idea.status !== 'archived' && (
                    <button onClick={handleAdvance} style={S.gradBtn}>
                      <SendHorizontal size={15} />
                      {idea.status === 'draft' ? 'Publish' : idea.status === 'published' ? 'Ready for Pilot' : idea.status === 'readyForPilot' ? 'Start Pilot' : 'Complete'}
                    </button>
                  )}
                  {idea.status !== 'archived' && (
                    <button onClick={handleArchive} style={S.archiveBtn}><Archive size={15} /> Archive</button>
                  )}
                  {confirmDelete ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleDelete} style={S.confirmDelBtn}>Confirm Delete</button>
                      <button onClick={() => setConfirmDelete(false)} style={S.cancelDelBtn}>Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(true)} style={S.deleteBtn}><Trash2 size={15} /> Delete</button>
                  )}
                </div>
              </aside>
            </div>
          )}

          {activeTab === 'investors' && (
            <div style={S.investorList}>
              {idea.interests.length === 0 ? (
                <div style={S.emptyTab}>
                  <Users size={32} color="#94a3b8" />
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>No investors have expressed interest yet.</p>
                </div>
              ) : (
                idea.interests.map((interest) => (
                  <div key={interest.id} style={S.investorCard}>
                    <div style={S.invTop}>
                      <div style={S.invAv}>{interest.investorName.charAt(0)}</div>
                      <div style={{ flex: 1 }}>
                        <p style={S.invName}>{interest.investorName}</p>
                        <p style={S.invEmail}>{interest.investorEmail}</p>
                      </div>
                      <span style={{ ...S.invStatus, color: interest.status === 'committed' ? '#10b981' : interest.status === 'negotiating' ? '#8b5cf6' : interest.status === 'contacted' ? '#f59e0b' : '#3b82f6', backgroundColor: interest.status === 'committed' ? '#ecfdf5' : interest.status === 'negotiating' ? '#f5f3ff' : interest.status === 'contacted' ? '#fffbeb' : '#eff6ff' }}>
                        {statusIcon[interest.status]} {interest.status}
                      </span>
                    </div>
                    <p style={S.invMsg}>"{interest.message}"</p>
                    <p style={S.invDate}><Clock size={12} /> {fmtDate(interest.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div style={S.emptyTab}>
              <MessageCircle size={32} color="#94a3b8" />
              <p style={{ margin: '0 0 0.25rem', color: '#334155', fontWeight: 600 }}>Activity Log</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
                Investor interactions and status changes will appear here.
                Use the Messages page for direct conversations.
              </p>
            </div>
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
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc' },
  notFound: { minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '0.5rem', textAlign: 'center', backgroundColor: '#f8fafc' },
  nfIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '18px', backgroundColor: '#f1f5f9' },

  topBar: { backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem' },
  topInner: { maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  topActions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  topActBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#ffffff',
    color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  badge: { padding: '4px 14px', borderRadius: '6px', fontSize: '0.8125rem', fontWeight: 700 },

  hero: { position: 'relative', height: '260px', overflow: 'hidden', backgroundColor: '#1e293b' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover' },
  heroGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.35))' },

  body: { padding: '1.75rem 1.5rem' },
  wrap: { maxWidth: '1100px', margin: '0 auto' },

  catLabel: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' },
  h1: { margin: '0.25rem 0 0.5rem', fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, letterSpacing: '-0.02em' },
  dateLine: { display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.5rem' },

  tabBar: { display: 'flex', borderBottom: '2px solid #e2e8f0', gap: 0, marginBottom: '1.5rem' },
  tab: {
    padding: '0.625rem 1.25rem', border: 'none', borderBottom: '2px solid transparent',
    marginBottom: '-2px', backgroundColor: 'transparent', fontSize: '0.875rem',
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
  } as React.CSSProperties,

  twoCol: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' },
  mainCol: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  section: { ...card, padding: '1.25rem' },
  secTitle: { margin: '0 0 0.75rem', fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a' },
  secText: { margin: 0, color: '#475569', lineHeight: 1.65, fontSize: '0.9375rem' },

  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1.5rem' },
  sideCard: { ...card, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  sideH: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' },

  statsGrid: { display: 'flex', flexDirection: 'column', gap: '0.625rem' },
  statItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' },
  statIc: { width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statLbl: { margin: 0, fontSize: '0.6875rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' },
  statVal: { margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' },

  gradBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.6875rem', border: 'none', borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#ffffff',
    fontSize: '0.875rem', fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },
  archiveBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.6875rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.875rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
    padding: '0.6875rem', border: '1.5px solid #fecaca', borderRadius: '10px',
    backgroundColor: '#fff1f2', color: '#dc2626', fontSize: '0.875rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  confirmDelBtn: {
    flex: 1, padding: '0.6875rem', border: 'none', borderRadius: '10px',
    backgroundColor: '#dc2626', color: '#ffffff', fontSize: '0.8125rem', fontWeight: 700,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  cancelDelBtn: {
    flex: 1, padding: '0.6875rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    backgroundColor: '#ffffff', color: '#475569', fontSize: '0.8125rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },

  investorList: { display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '760px' },
  investorCard: { ...card, padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  invTop: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  invAv: {
    width: '40px', height: '40px', borderRadius: '12px',
    background: 'linear-gradient(135deg, #1e3a5f, #0f172a)', color: '#ffffff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1rem', fontWeight: 700, flexShrink: 0,
  },
  invName: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a' },
  invEmail: { margin: 0, fontSize: '0.8125rem', color: '#64748b' },
  invStatus: {
    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
    borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'capitalize',
  } as React.CSSProperties,
  invMsg: { margin: 0, fontSize: '0.8125rem', color: '#475569', lineHeight: 1.5, fontStyle: 'italic', padding: '0.625rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '3px solid #e2e8f0' },
  invDate: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8', margin: 0 },

  emptyTab: { ...card, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem' },
};
