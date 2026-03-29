import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useExpert } from '@/contexts/ExpertContext';
import { getIdeaStatusMeta, getPilotStatusMeta } from '@/models/expertIdea';
import { formatBudget } from '@/models/project';
import {
  Lightbulb,
  Sprout,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  MapPin,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Bell,
  UserCheck,
  Handshake,
  ChevronRight,
  Zap,
} from 'lucide-react';

const ACTIVITIES = [
  { id: 'a1', icon: 'investor', message: 'An investor expressed interest in "Sustainable Greenhouse Farming"', time: '2 hours ago' },
  { id: 'a2', icon: 'pilot',    message: 'New pilot project in Tizi Ouzou matches your expertise', time: '5 hours ago' },
  { id: 'a3', icon: 'collab',   message: 'Your collaboration with Ahmed B. is now active', time: '1 day ago' },
  { id: 'a4', icon: 'idea',     message: '"AI-Powered Soil Analysis" received 2 new views', time: '2 days ago' },
  { id: 'a5', icon: 'investor', message: '3 investors bookmarked your irrigation idea', time: '3 days ago' },
];

const STAT_CONFIG = [
  { key: 'ideas',  label: 'Total Ideas',   icon: Lightbulb,  gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)' },
  { key: 'pub',    label: 'Published',      icon: TrendingUp, gradient: 'linear-gradient(135deg, #10b981, #059669)' },
  { key: 'pilots', label: 'Active Pilots',  icon: Sprout,     gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
  { key: 'collab', label: 'Collaborations', icon: Users,      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
] as const;

export function ExpertDashboardPage() {
  const { user } = useAuth();
  const {
    ideas, pilotProjects, collaborations,
    totalIdeas, publishedIdeas, activePilots, activeCollaborations,
  } = useExpert();
  const navigate = useNavigate();

  const recentIdeas = ideas.slice(0, 3);
  const openPilots = pilotProjects.filter((p) => p.status === 'open').slice(0, 3);
  const statValues = [totalIdeas, publishedIdeas, activePilots, activeCollaborations];

  const onboardingSteps = [
    { label: 'Create your first idea', done: ideas.length > 0, link: '/expert/ideas/new' },
    { label: 'Publish an idea', done: publishedIdeas > 0, link: '/expert/ideas' },
    { label: 'Join a pilot project', done: activePilots > 0, link: '/expert/pilot-projects' },
    { label: 'Start collaborating', done: activeCollaborations > 0, link: '/expert/collaborations' },
  ];
  const onboardingDone = onboardingSteps.filter((s) => s.done).length;
  const allOnboarded = onboardingDone === onboardingSteps.length;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const firstName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Expert';
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={S.page}>
      {/* Hero banner */}
      <div style={S.hero}>
        <div style={S.heroInner}>
          <div>
            <p style={S.greet}>{greet},</p>
            <h1 style={S.heroName}>{firstName}</h1>
            <p style={S.heroSub}>Here's what's happening with your projects today.</p>
          </div>
          <button onClick={() => navigate('/expert/ideas/new')} style={S.heroBtn}>
            <Plus size={18} /> New Idea
          </button>
        </div>
      </div>

      <div style={S.wrap}>
        {/* Stat cards */}
        <div style={S.stats}>
          {STAT_CONFIG.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={c.key} style={S.statCard}>
                <div style={S.statRow}>
                  <div style={{ ...S.statIcon, background: c.gradient }}><Icon size={20} color="#fff" /></div>
                  <span style={S.statNum}>{statValues[i]}</span>
                </div>
                <span style={S.statLbl}>{c.label}</span>
              </div>
            );
          })}
        </div>

        {/* Onboarding */}
        {!allOnboarded && (
          <div style={S.obCard}>
            <div style={S.obHead}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={S.obIconWrap}><Zap size={18} color="#f59e0b" /></div>
                <div>
                  <h2 style={S.obTitle}>Getting Started</h2>
                  <p style={S.obSub}>{onboardingDone} of {onboardingSteps.length} completed</p>
                </div>
              </div>
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: `${(onboardingDone / onboardingSteps.length) * 100}%` }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '4px' }}>
              {onboardingSteps.map((step, i) => (
                <div
                  key={i}
                  onClick={() => !step.done && navigate(step.link)}
                  style={{
                    ...S.obStep,
                    cursor: step.done ? 'default' : 'pointer',
                    opacity: step.done ? 0.5 : 1,
                    backgroundColor: step.done ? 'transparent' : '#f8fafc',
                  }}
                >
                  {step.done
                    ? <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                    : <Circle size={18} style={{ color: '#cbd5e1', flexShrink: 0 }} />}
                  <span style={{
                    textDecoration: step.done ? 'line-through' : 'none',
                    color: step.done ? '#94a3b8' : '#0f172a',
                    fontSize: '0.875rem', fontWeight: 500,
                  }}>{step.label}</span>
                  {!step.done && <ChevronRight size={14} style={{ marginLeft: 'auto', color: '#94a3b8' }} />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two-column body */}
        <div style={S.body}>
          {/* Recent Ideas */}
          <div style={S.section}>
            <div style={S.secHead}>
              <h2 style={S.secTitle}>My Recent Ideas</h2>
              <button onClick={() => navigate('/expert/ideas')} style={S.seeAll}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {recentIdeas.length === 0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}><Lightbulb size={28} color="#94a3b8" /></div>
                <p style={S.emptyTxt}>No ideas yet. Share your expertise!</p>
                <button onClick={() => navigate('/expert/ideas/new')} style={S.emptyBtn}>
                  <Plus size={14} /> Create your first idea
                </button>
              </div>
            ) : (
              <div style={S.cardStack}>
                {recentIdeas.map((idea) => {
                  const meta = getIdeaStatusMeta(idea.status);
                  return (
                    <div key={idea.id} style={S.iCard} onClick={() => navigate('/expert/ideas')}>
                      <div style={S.iTop}>
                        <span style={S.catTag}>{idea.category}</span>
                        <span style={{ ...S.badge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
                      </div>
                      <h3 style={S.iTitle}>{idea.title}</h3>
                      <p style={S.iDesc}>{idea.shortDescription}</p>
                      <div style={S.iMeta}>
                        <span style={S.metaChip}><MapPin size={12} />{idea.targetRegion}</span>
                        <span style={S.metaChip}><Calendar size={12} />{fmtDate(idea.createdAt)}</span>
                        {idea.interestedInvestors > 0 && (
                          <span style={{ ...S.metaChip, color: '#f59e0b' }}>
                            <TrendingUp size={12} />{idea.interestedInvestors} interest{idea.interestedInvestors !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Open Pilots */}
          <div style={S.section}>
            <div style={S.secHead}>
              <h2 style={S.secTitle}>Open Opportunities</h2>
              <button onClick={() => navigate('/expert/pilot-projects')} style={S.seeAll}>
                View all <ArrowRight size={14} />
              </button>
            </div>
            {openPilots.length === 0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}><Sprout size={28} color="#94a3b8" /></div>
                <p style={S.emptyTxt}>No open pilot projects right now.</p>
              </div>
            ) : (
              <div style={S.cardStack}>
                {openPilots.map((pr) => {
                  const meta = getPilotStatusMeta(pr.status);
                  return (
                    <div key={pr.id} style={{ ...S.pCard, cursor: 'pointer' }} onClick={() => navigate(`/expert/project/${pr.id}`)}>
                      {pr.images[0] && (
                        <div style={S.pImgWrap}>
                          <img src={pr.images[0]} alt={pr.title} style={S.pImg}
                            onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }} />
                          <div style={S.pImgGrad} />
                        </div>
                      )}
                      <div style={S.pBody}>
                        <div style={S.iTop}>
                          <span style={S.catTag}>{pr.category}</span>
                          <span style={{ ...S.badge, color: meta.color, backgroundColor: meta.bg }}>{meta.label}</span>
                        </div>
                        <h3 style={S.iTitle}>{pr.title}</h3>
                        <div style={S.iMeta}>
                          <span style={S.metaChip}><MapPin size={12} />{pr.farmerRegion}</span>
                          <span style={S.metaChip}><TrendingUp size={12} />{formatBudget(pr.budget)}</span>
                        </div>
                        {pr.requiredExpertise.length > 0 && (
                          <div style={S.skillRow}>
                            {pr.requiredExpertise.map((e) => (
                              <span key={e} style={S.skillChip}>{e}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{ marginTop: '1.75rem' }}>
          <div style={S.secHead}>
            <h2 style={S.secTitle}><Bell size={17} color="#8b5cf6" /> Recent Activity</h2>
          </div>
          <div style={{ ...S.card, marginTop: '0.75rem', padding: 0, overflow: 'hidden' }}>
            {ACTIVITIES.map((a, idx) => {
              const icon =
                a.icon === 'investor' ? <UserCheck size={15} color="#f59e0b" /> :
                a.icon === 'pilot'    ? <Sprout    size={15} color="#10b981" /> :
                a.icon === 'collab'   ? <Handshake size={15} color="#8b5cf6" /> :
                                        <Lightbulb size={15} color="#3b82f6" />;
              return (
                <div key={a.id} style={{ ...S.actItem, borderBottom: idx < ACTIVITIES.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={S.actIcon}>{icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={S.actMsg}>{a.message}</p>
                    <span style={S.actTime}><Clock size={11} />{a.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
  border: '1px solid #e2e8f0',
};

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: 'calc(100vh - 60px)', backgroundColor: '#f8fafc' },
  hero: { background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', padding: '2.5rem 1.5rem 3.5rem' },
  heroInner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' },
  greet: { margin: 0, fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' },
  heroName: { margin: '0.25rem 0 0.5rem', fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' },
  heroSub: { margin: 0, fontSize: '0.9375rem', color: '#94a3b8', lineHeight: 1.5 },
  heroBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
    border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff', fontSize: '0.9375rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
  },
  wrap: { maxWidth: '1200px', margin: '-2rem auto 0', padding: '0 1.5rem 2.5rem', position: 'relative' },

  /* stats */
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { ...card, padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  statRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  statIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '12px' },
  statNum: { fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' },
  statLbl: { fontSize: '0.8125rem', color: '#64748b', fontWeight: 500 },

  /* onboarding */
  obCard: { ...card, padding: '1.25rem 1.5rem', marginBottom: '1.5rem' },
  obHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' },
  obIconWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fffbeb', flexShrink: 0 },
  obTitle: { margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' },
  obSub: { margin: 0, fontSize: '0.8125rem', color: '#94a3b8' },
  progressTrack: { width: '140px', height: '6px', borderRadius: '99px', backgroundColor: '#f1f5f9', overflow: 'hidden', flexShrink: 0 },
  progressFill: { height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg, #3b82f6, #6366f1)', transition: 'width 0.5s ease' },
  obStep: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', borderRadius: '10px', transition: 'background 0.15s' },

  /* body grid */
  body: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '1.5rem' },
  section: { display: 'flex', flexDirection: 'column', gap: '0.875rem' },
  secHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  secTitle: { display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' },
  seeAll: { display: 'flex', alignItems: 'center', gap: '0.375rem', border: 'none', backgroundColor: 'transparent', color: '#3b82f6', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  cardStack: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },

  /* idea cards */
  iCard: { ...card, padding: '1.125rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', cursor: 'pointer' },
  iTop: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' },
  catTag: { fontSize: '0.6875rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' },
  badge: { padding: '2px 10px', borderRadius: '6px', fontSize: '0.6875rem', fontWeight: 700 },
  iTitle: { margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.35 },
  iDesc: { margin: 0, fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties,
  iMeta: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.125rem' },
  metaChip: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' },

  /* pilot cards */
  pCard: { ...card, overflow: 'hidden' },
  pImgWrap: { height: '120px', overflow: 'hidden', position: 'relative' },
  pImg: { width: '100%', height: '100%', objectFit: 'cover' },
  pImgGrad: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.12))' },
  pBody: { padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  skillRow: { display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' },
  skillChip: { padding: '2px 10px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.6875rem', fontWeight: 600, border: '1px solid #e2e8f0' },

  /* empty state */
  empty: { ...card, padding: '2.5rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.625rem' },
  emptyIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#f1f5f9' },
  emptyTxt: { margin: 0, fontSize: '0.875rem', color: '#64748b' },
  emptyBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1.125rem',
    border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    color: '#fff', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  },

  /* shared card base */
  card: { ...card },

  /* activity */
  actItem: { display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.875rem 1.25rem' },
  actIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#f8fafc', flexShrink: 0, border: '1px solid #f1f5f9' },
  actMsg: { margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 },
  actTime: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' },
};
