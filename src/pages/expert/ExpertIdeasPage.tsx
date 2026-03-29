import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExpert } from '@/contexts/ExpertContext';
import { useToast } from '@/contexts/ToastContext';
import { ExpertIdea, IdeaStatus, getIdeaStatusMeta, formatBudgetRange, EXPERT_CATEGORIES } from '@/models/expertIdea';
import { SkeletonCard } from '@/components/UI/SkeletonCard';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import {
  Plus, Lightbulb, Trash2, Eye, Edit3,
  MapPin, TrendingUp, Calendar, Users,
  ChevronDown, SendHorizontal, Search, X as XIcon,
} from 'lucide-react';

type TabFilter = 'all' | 'published' | 'draft';
const TABS: { id: TabFilter; label: string }[] = [
  { id: 'all', label: 'All Ideas' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
];

export function ExpertIdeasPage() {
  const { ideas, deleteIdea, publishIdea, setIdeaStatus } = useExpert();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const width = useWindowWidth();
  const isMobile = width < 768;

  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = ideas.filter((idea) => {
    const tabMatch =
      activeTab === 'all' ||
      (activeTab === 'published' && (idea.status === 'published' || idea.status === 'readyForPilot' || idea.status === 'pilotActive' || idea.status === 'completed')) ||
      (activeTab === 'draft' && (idea.status === 'draft' || idea.status === 'archived'));
    const catMatch = categoryFilter === 'all' || idea.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = !q || idea.title.toLowerCase().includes(q) || idea.shortDescription.toLowerCase().includes(q) || idea.category.toLowerCase().includes(q);
    return tabMatch && catMatch && searchMatch;
  });

  const handleDelete = useCallback((id: string) => {
    deleteIdea(id);
    setConfirmDeleteId(null);
    showToast('Idea deleted', 'info');
  }, [deleteIdea, showToast]);

  const handleAdvanceStatus = useCallback((idea: ExpertIdea) => {
    const next: Record<IdeaStatus, IdeaStatus | null> = { draft: 'published', published: 'readyForPilot', readyForPilot: 'pilotActive', pilotActive: 'completed', completed: null, archived: null };
    const n = next[idea.status];
    if (n) {
      setIdeaStatus(idea.id, n);
      const labels: Record<IdeaStatus, string> = { published: 'Idea published', readyForPilot: 'Marked as Ready for Pilot', pilotActive: 'Pilot marked active', completed: 'Marked as completed', draft: '', archived: '' };
      showToast(labels[n], 'success');
    }
  }, [setIdeaStatus, showToast]);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.title}>My Ideas</h1>
            <p style={S.sub}>{ideas.length} idea{ideas.length !== 1 ? 's' : ''} total</p>
          </div>
          <button onClick={() => navigate('/expert/ideas/new')} style={S.newBtn}>
            <Plus size={18} /> New Idea
          </button>
        </div>

        {/* Toolbar */}
        <div style={S.toolbar}>
          <div style={S.tabBar}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                ...S.tab,
                color: activeTab === t.id ? '#3b82f6' : '#64748b',
                borderBottomColor: activeTab === t.id ? '#3b82f6' : 'transparent',
                fontWeight: activeTab === t.id ? 700 : 500,
              }}>{t.label}</button>
            ))}
          </div>
          <div style={S.controls}>
            <div style={S.searchBox}>
              <Search size={15} style={S.searchIc} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isMobile ? 'Search...' : 'Search ideas...'} style={S.searchIn} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={S.searchX}><XIcon size={13} /></button>}
            </div>
            {!isMobile && (
              <div style={S.selWrap}>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={S.sel}>
                  <option value="all">All Categories</option>
                  {EXPERT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} style={S.selIc} />
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div style={S.grid}>{[1, 2, 3].map((n) => <SkeletonCard key={n} lines={4} />)}</div>
        ) : filtered.length === 0 ? (
          <div style={S.empty}>
            <div style={S.emptyIcon}><Lightbulb size={36} color="#94a3b8" /></div>
            <h3 style={S.emptyH}>No ideas found</h3>
            <p style={S.emptyP}>
              {activeTab === 'draft' ? 'All your ideas are published.' : 'Share your expertise by creating a new idea.'}
            </p>
            <button onClick={() => navigate('/expert/ideas/new')} style={S.emptyBtn}><Plus size={16} /> Create Idea</button>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered.map((idea) => {
              const meta = getIdeaStatusMeta(idea.status);
              const nextLabel: Record<IdeaStatus, string | null> = { draft: 'Publish', published: 'Ready for Pilot', readyForPilot: 'Pilot Active', pilotActive: 'Complete', completed: null, archived: null };
              const canAdvance = nextLabel[idea.status] !== null;

              return (
                <div key={idea.id} style={S.card}>
                  {idea.images[0] && (
                    <div style={S.cardImg}>
                      <img src={idea.images[0]} alt={idea.title} style={S.cardImgEl}
                        onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
                      <div style={S.cardImgGrad} />
                    </div>
                  )}
                  <div style={S.cardBody}>
                    <div style={S.topRow}>
                      <span style={S.catTag}>{idea.category}</span>
                      <span style={{ ...S.badge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
                      {idea.isOwn && <span style={S.ownBadge}>YOURS</span>}
                    </div>
                    <h3 style={S.cardTitle}>{idea.title}</h3>
                    <p style={S.cardDesc}>{idea.shortDescription}</p>
                    <div style={S.metaRow}>
                      <span style={S.chip}><MapPin size={12} />{idea.targetRegion}</span>
                      <span style={S.chip}><Calendar size={12} />{fmtDate(idea.createdAt)}</span>
                      {idea.interestedInvestors > 0 && <span style={{ ...S.chip, color: '#f59e0b' }}><Users size={12} />{idea.interestedInvestors}</span>}
                      {(idea.budgetMin > 0 || idea.budgetMax > 0) && <span style={{ ...S.chip, color: '#10b981' }}><TrendingUp size={12} />{formatBudgetRange(idea.budgetMin, idea.budgetMax)}</span>}
                    </div>
                    <div style={S.actions}>
                      <button onClick={() => navigate(`/expert/idea/${idea.id}`)} style={S.actBtn} title="View"><Eye size={15} /></button>
                      <button onClick={() => navigate(`/expert/ideas/new?edit=${idea.id}`)} style={S.actBtn} title="Edit"><Edit3 size={15} /></button>
                      {canAdvance && (
                        <button onClick={() => handleAdvanceStatus(idea)} style={S.advBtn} title={nextLabel[idea.status] ?? ''}>
                          <SendHorizontal size={14} />{idea.status === 'draft' ? 'Publish' : 'Advance'}
                        </button>
                      )}
                      {confirmDeleteId === idea.id ? (
                        <>
                          <button onClick={() => handleDelete(idea.id)} style={S.confirmDelBtn}>Confirm</button>
                          <button onClick={() => setConfirmDeleteId(null)} style={S.cancelBtn}>Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(idea.id)} style={S.delBtn} title="Delete"><Trash2 size={15} /></button>
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
  newBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
    border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },

  toolbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  tabBar: { display: 'flex', borderBottom: '2px solid #e2e8f0', gap: 0 },
  tab: {
    padding: '0.625rem 1.25rem', border: 'none', borderBottom: '2px solid transparent',
    marginBottom: '-2px', backgroundColor: 'transparent', fontSize: '0.875rem',
    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'color 0.15s',
  },
  controls: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' },

  searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIc: { position: 'absolute', left: '10px', color: '#94a3b8', pointerEvents: 'none' } as React.CSSProperties,
  searchIn: {
    padding: '0.5rem 2rem 0.5rem 2.125rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.875rem', fontFamily: 'inherit', outline: 'none', backgroundColor: '#f8fafc',
    color: '#0f172a', width: '200px', transition: 'border-color 0.15s',
  },
  searchX: { position: 'absolute', right: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: 0 } as React.CSSProperties,

  selWrap: { position: 'relative' },
  sel: {
    padding: '0.5rem 2rem 0.5rem 0.875rem', border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '0.875rem', fontFamily: 'inherit', backgroundColor: '#f8fafc', color: '#0f172a',
    cursor: 'pointer', outline: 'none', appearance: 'none',
  } as React.CSSProperties,
  selIc: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' } as React.CSSProperties,

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' },

  empty: { ...base, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', gap: '0.75rem', textAlign: 'center' },
  emptyIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#f1f5f9' },
  emptyH: { margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#334155' },
  emptyP: { margin: 0, color: '#64748b', fontSize: '0.875rem' },
  emptyBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.25rem',
    border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },

  card: { ...base, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImg: { height: '150px', overflow: 'hidden', backgroundColor: '#f1f5f9', position: 'relative' },
  cardImgEl: { width: '100%', height: '100%', objectFit: 'cover' },
  cardImgGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.1))' },
  cardBody: { padding: '1.125rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
  topRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  catTag: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' },
  badge: { padding: '2px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700 },
  ownBadge: { padding: '2px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700, backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', marginLeft: 'auto' },
  cardTitle: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 },
  cardDesc: { margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties,
  metaRow: { display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginTop: '0.125rem' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' },

  actions: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' },
  actBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc', color: '#475569', cursor: 'pointer',
  },
  advBtn: {
    display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0 0.875rem', height: '36px',
    border: 'none', borderRadius: '10px', backgroundColor: '#ecfdf5', color: '#059669',
    fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  delBtn: {
    display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0 0.625rem', height: '36px',
    border: '1.5px solid #fecdd3', borderRadius: '10px', backgroundColor: '#fff1f2',
    color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  confirmDelBtn: {
    display: 'flex', alignItems: 'center', padding: '0 0.75rem', height: '36px',
    border: 'none', borderRadius: '10px', backgroundColor: '#ef4444', color: '#fff',
    fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },
  cancelBtn: {
    display: 'flex', alignItems: 'center', padding: '0 0.75rem', height: '36px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc',
    color: '#475569', fontSize: '0.8125rem', cursor: 'pointer', fontFamily: 'inherit',
  },
};
