/**
 * Investor Dashboard — aligned with mobile app's `investor_dashboard_screen.dart`
 *
 * README ref: "Investor Features > Investor Dashboard"
 * Two tabs:
 *   1. Interested Projects tab: Lists projects the investor expressed interest in
 *   2. Statistics tab: Summary metrics about investor activity
 *
 * README ref: "Premium Simulation Feature > After Premium"
 * Premium Active — All features unlocked (shown in drawer)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvestorPayment } from '@/contexts/InvestorPaymentContext';
import { useProjects } from '@/contexts/ProjectContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { formatBudget } from '@/models/project';
import { TypeBadge } from '@/components/common/TypeBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {
  Heart,
  BarChart3,
  Eye,
  TrendingUp,
  Star,
  BookmarkCheck,
  Trash2,
  MessageCircle,
  Crown,
} from 'lucide-react';

type TabId = 'interests' | 'saved' | 'statistics';

export function InvestorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('interests');
  const [isLoading, setIsLoading] = useState(true);
  const { isPremium } = useInvestorPayment();
  const { getProjectById, loadProjects } = useProjects();
  const { conversations, withdrawInterest } = useMessages();
  const { savedIds, totalSaved, totalViewed, toggleBookmark } = useBookmarks();
  const navigate = useNavigate();

  const stats = {
    totalProjectsViewed: totalViewed,
    interestsExpressed: conversations.length,
    savedProjects: totalSaved,
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await loadProjects();
      setIsLoading(false);
    };
    fetchData();
  }, [loadProjects]);

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'interests', label: 'Interested Projects', icon: <Heart size={18} /> },
    { id: 'saved', label: 'Saved', icon: <BookmarkCheck size={18} /> },
    { id: 'statistics', label: 'Statistics', icon: <BarChart3 size={18} /> },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Track your investment activity and interests</p>
          </div>
          {isPremium && (
            <div style={styles.premiumBadge}>
              <Crown size={16} />
              Premium Active
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                borderBottomColor: activeTab === tab.id ? '#2ECC71' : 'transparent',
                color: activeTab === tab.id ? '#2ECC71' : '#6C757D',
                fontWeight: activeTab === tab.id ? 600 : 400,
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSpinner message="Loading dashboard..." />
        ) : (
          <>
            {/* ═══ Interested Projects Tab ═══ */}
            {activeTab === 'interests' && (
              <div style={styles.interestsList}>
                {conversations.length === 0 ? (
                  <div style={styles.emptyState}>
                    <Heart size={40} style={{ color: '#DEE2E6' }} />
                    <h3>No interests yet</h3>
                    <p>Express interest in projects from the feed to see them here.</p>
                    <button onClick={() => navigate('/investor')} style={styles.browseBtn}>
                      Browse Projects
                    </button>
                  </div>
                ) : (
                  conversations.map((convo) => {
                    const project = getProjectById(convo.projectId);
                    return (
                      <div key={convo.projectId} style={styles.interestCard}>
                        <div style={styles.interestHeader}>
                          <div>
                            {project && <TypeBadge type={project.type} size="sm" />}
                            <h3 style={styles.interestTitle}>{convo.projectTitle}</h3>
                          </div>
                          {convo.unread > 0 && (
                            <span style={styles.unreadBadge}>{convo.unread} new</span>
                          )}
                          <button
                            onClick={() => withdrawInterest(convo.projectId)}
                            style={styles.withdrawBtn}
                            title="Withdraw interest"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div style={styles.interestMeta}>
                          <span>Budget: <strong>{formatBudget(convo.budget)}</strong></span>
                          <span>{new Date(convo.expressedAt).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {project && (
                            <button
                              onClick={() => navigate(`/investor/project/${project.id}`)}
                              style={styles.viewDetailBtn}
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/investor/messages?project=${convo.projectId}`)}
                            style={styles.chatBtn}
                          >
                            <MessageCircle size={14} />
                            Open Chat
                            {convo.unread > 0 && (
                              <span style={styles.chatBadge}>{convo.unread}</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ═══ Saved Tab ═══ */}
            {activeTab === 'saved' && (
              <div style={styles.interestsList}>
                {savedIds.length === 0 ? (
                  <div style={styles.emptyState}>
                    <BookmarkCheck size={40} style={{ color: '#DEE2E6' }} />
                    <h3>No saved projects</h3>
                    <p>Bookmark projects from the feed to save them here.</p>
                    <button onClick={() => navigate('/investor')} style={styles.browseBtn}>
                      Browse Projects
                    </button>
                  </div>
                ) : (
                  savedIds.map((id) => {
                    const project = getProjectById(id);
                    if (!project) return null;
                    return (
                      <div key={id} style={styles.interestCard}>
                        <div style={styles.interestHeader}>
                          <div>
                            <TypeBadge type={project.type} size="sm" />
                            <h3 style={styles.interestTitle}>{project.title}</h3>
                          </div>
                          <button
                            onClick={() => toggleBookmark(id)}
                            style={styles.withdrawBtn}
                            title="Remove bookmark"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div style={styles.interestMeta}>
                          <span>Budget: <strong>{formatBudget(project.budget)}</strong></span>
                          <span>{project.region}</span>
                        </div>
                        <button
                          onClick={() => navigate(`/investor/project/${id}`)}
                          style={styles.viewDetailBtn}
                        >
                          <Eye size={14} />
                          View Details
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ═══ Statistics Tab ═══ */}
            {activeTab === 'statistics' && (
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, backgroundColor: '#EBF5FB' }}>
                    <Eye size={24} style={{ color: '#3498DB' }} />
                  </div>
                  <div style={styles.statValue}>{stats.totalProjectsViewed}</div>
                  <div style={styles.statLabel}>Projects Viewed</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, backgroundColor: '#FDE8E8' }}>
                    <Heart size={24} style={{ color: '#E74C3C' }} />
                  </div>
                  <div style={styles.statValue}>{stats.interestsExpressed}</div>
                  <div style={styles.statLabel}>Interests Expressed</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, backgroundColor: '#FEF9E7' }}>
                    <BookmarkCheck size={24} style={{ color: '#F39C12' }} />
                  </div>
                  <div style={styles.statValue}>{stats.savedProjects}</div>
                  <div style={styles.statLabel}>Saved Projects</div>
                </div>
                <div style={styles.statCard}>
                  <div style={{ ...styles.statIcon, backgroundColor: '#E8F8F0' }}>
                    <TrendingUp size={24} style={{ color: '#2ECC71' }} />
                  </div>
                  <div style={styles.statValue}>
                    {isPremium ? (
                      <span style={{ color: '#2ECC71' }}>Active</span>
                    ) : (
                      <span style={{ color: '#ADB5BD' }}>Free</span>
                    )}
                  </div>
                  <div style={styles.statLabel}>Account Tier</div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#F8F9FA',
    padding: '1.5rem',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.75rem',
    fontWeight: 800,
    color: '#212529',
  },
  subtitle: {
    margin: 0,
    fontSize: '0.9375rem',
    color: '#6C757D',
  },
  premiumBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    backgroundColor: '#FEF9E7',
    color: '#F39C12',
    fontSize: '0.8125rem',
    fontWeight: 600,
    border: '1px solid #FFE082',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '2px solid #DEE2E6',
    marginBottom: '1.5rem',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    backgroundColor: 'transparent',
    fontSize: '0.9375rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  },
  interestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  interestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  interestHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  interestTitle: {
    margin: '0.5rem 0 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#212529',
  },
  unreadBadge: {
    padding: '2px 8px',
    borderRadius: '99px',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.6875rem',
    fontWeight: 700,
  },
  withdrawBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '0.375rem',
    backgroundColor: '#FEF9E7',
    color: '#F39C12',
    cursor: 'pointer',
  },
  interestMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8125rem',
    color: '#6C757D',
    marginBottom: '0.5rem',
  },
  viewDetailBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#F0FAF4',
    color: '#2ECC71',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  chatBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#EBF5FB',
    color: '#3498DB',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  chatBadge: {
    minWidth: '18px',
    height: '18px',
    borderRadius: '99px',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.625rem',
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 4px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '3rem',
    color: '#6C757D',
    gap: '0.5rem',
  },
  browseBtn: {
    marginTop: '0.5rem',
    padding: '0.625rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  statIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    marginBottom: '0.75rem',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#212529',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
};
