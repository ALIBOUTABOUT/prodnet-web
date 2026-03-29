/**
 * Investor Project Detail — aligned with mobile app's `investor_project_detail_screen.dart`
 *
 * README ref: "Investor Features > Project Detail View"
 * Shows complete detail: full description, budget, production estimate,
 * region, category, images, and expert/farmer contact info.
 * Interest expression accessible from this screen (premium required).
 *
 * README ref: "Before Premium (Free tier)"
 * - Express interest ✗ (locked)
 * - Contact details ✗ (locked)
 *
 * README ref: "After Premium (Pro tier)"
 * - Express Interest and contact info features accessible
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/contexts/ProjectContext';
import { useInvestorPayment } from '@/contexts/InvestorPaymentContext';
import { useMessages } from '@/contexts/MessagesContext';
import { useBookmarks } from '@/contexts/BookmarksContext';
import { formatBudget } from '@/models/project';
import { TypeBadge } from '@/components/common/TypeBadge';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  BarChart3,
  User,
  Tag,
  Calendar,
  Lock,
  MessageCircle,
  Heart,
  Crown,
  X,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';

export function InvestorProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getProjectById } = useProjects();
  const { isPremium } = useInvestorPayment();
  const { expressInterest, hasInterest } = useMessages();
  const { isBookmarked: checkBookmark, toggleBookmark, trackView } = useBookmarks();
  const navigate = useNavigate();

  const project = projectId ? getProjectById(projectId) : undefined;
  const alreadyInterested = hasInterest(projectId ?? '');
  const bookmarked = checkBookmark(projectId ?? '');

  const [showModal, setShowModal] = useState(false);
  const [proposedBudget, setProposedBudget] = useState('');
  const [message, setMessage] = useState('');
  const [budgetError, setBudgetError] = useState('');

  useEffect(() => {
    if (projectId) trackView(projectId);
  }, [projectId, trackView]);

  const handleOpenModal = () => {
    setProposedBudget('');
    setMessage('');
    setBudgetError('');
    setShowModal(true);
  };

  const handleSubmitInterest = () => {
    const val = proposedBudget.trim();
    if (!val || isNaN(Number(val)) || Number(val) <= 0) {
      setBudgetError('Please enter a valid budget amount in DZD.');
      return;
    }
    expressInterest({
      projectId: project!.id,
      projectTitle: project!.title,
      projectType: project!.type,
      region: project!.region,
      budget: project!.budget,
      imageUrl: project!.images?.[0],
      proposedBudget: Number(val),
      interestMessage: message.trim() || undefined,
    });
    setShowModal(false);
    navigate(`/investor/messages?project=${project!.id}`);
  };

  if (!project) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} /> Back
          </button>
          <div style={styles.notFound}>
            <h2>Project not found</h2>
            <p>The project you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const hasImage = project.images && project.images.length > 0;

  return (
    <>
      <div style={styles.page}>
      <div style={styles.container}>
        {/* Back Button */}
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Feed
        </button>

        {/* Hero Image */}
        {hasImage && (
          <div style={styles.imageWrapper}>
            <img
              src={project.images[0]}
              alt={project.title}
              style={styles.heroImage}
              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
            />
          </div>
        )}

        {/* Main Content */}
        <div style={styles.content}>
          {/* Left: Project Info */}
          <div style={styles.mainCol}>
            <div style={styles.card}>
              {/* Badge & Title */}
              <div style={styles.titleRow}>
                <TypeBadge type={project.type} />
                <span style={styles.date}>
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
              <h1 style={styles.title}>{project.title}</h1>

              {/* Description */}
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.description}>{project.detailedDescription}</p>
              </div>

              {/* Meta Grid */}
              <div style={styles.metaGrid}>
                <div style={styles.metaCard}>
                  <DollarSign size={20} style={{ color: '#2ECC71' }} />
                  <div>
                    <span style={styles.metaLabel}>Budget</span>
                    <span style={styles.metaValue}>{formatBudget(project.budget)}</span>
                  </div>
                </div>
                <div style={styles.metaCard}>
                  <MapPin size={20} style={{ color: '#3498DB' }} />
                  <div>
                    <span style={styles.metaLabel}>Region</span>
                    <span style={styles.metaValue}>{project.region}</span>
                  </div>
                </div>
                <div style={styles.metaCard}>
                  <Tag size={20} style={{ color: '#9B59B6' }} />
                  <div>
                    <span style={styles.metaLabel}>Category</span>
                    <span style={styles.metaValue}>{project.category}</span>
                  </div>
                </div>
                <div style={styles.metaCard}>
                  <BarChart3 size={20} style={{ color: '#F39C12' }} />
                  <div>
                    <span style={styles.metaLabel}>Production Estimate</span>
                    <span style={styles.metaValue}>{project.productionEstimate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Expert Info */}
              {project.expertName && (
                <div style={styles.expertCard}>
                  <User size={20} style={{ color: '#3498DB' }} />
                  <div>
                    <span style={styles.metaLabel}>Expert</span>
                    <span style={styles.metaValue}>{project.expertName}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions Sidebar */}
          <div style={styles.sideCol}>
            {/* Express Interest — premium gated */}
            <div style={styles.actionCard}>
              <h3 style={styles.actionTitle}>Interested in this project?</h3>
              {isPremium ? (
                <>
                  <button
                    onClick={alreadyInterested
                      ? () => navigate(`/investor/messages?project=${project!.id}`)
                      : handleOpenModal
                    }
                    style={{
                      ...styles.interestBtn,
                      backgroundColor: alreadyInterested ? '#27AE60' : '#2ECC71',
                    }}
                  >
                    <Heart size={18} />
                    {alreadyInterested ? 'View in Messages ✓' : 'Express Interest - إبداء الاهتمام'}
                  </button>
                  <button
                    onClick={() => navigate(`/investor/messages?project=${project!.id}`)}
                    style={styles.messageBtn}
                  >
                    <MessageCircle size={18} />
                    Message Owner
                  </button>
                </>
              ) : (
                <div style={styles.lockedSection}>
                  <Lock size={24} style={{ color: '#F39C12' }} />
                  <p style={styles.lockedText}>Premium required to express interest</p>
                  <button
                    onClick={() => navigate('/investor/premium')}
                    style={styles.upgradeBtn}
                  >
                    <Crown size={16} />
                    Upgrade to Premium – 3,000 DZD/month
                  </button>
                </div>
              )}
            </div>

            {/* Save for Later */}
            <div style={styles.actionCard}>
              <button
                onClick={() => toggleBookmark(project!.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: `1.5px solid ${bookmarked ? '#F39C12' : '#DEE2E6'}`,
                  borderRadius: '0.625rem',
                  backgroundColor: bookmarked ? '#FEF9E7' : 'transparent',
                  color: bookmarked ? '#F39C12' : '#495057',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  justifyContent: 'center',
                }}
              >
                {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {bookmarked ? 'Saved ✓' : 'Save for Later'}
              </button>
            </div>

            {/* Contact Info — premium gated */}
            <div style={styles.actionCard}>
              <h3 style={styles.actionTitle}>Contact Information</h3>
              {isPremium ? (
                <div style={styles.contactInfo}>
                  <p>Contact details will be shown here when connected to the backend.</p>
                </div>
              ) : (
                <div style={styles.lockedSection}>
                  <Lock size={20} style={{ color: '#ADB5BD' }} />
                  <p style={styles.lockedText}>Upgrade to Premium to view contact details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* ── Interest Form Modal ── */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Express Interest</h2>
                <p style={styles.modalSub}>{project?.title}</p>
              </div>
              <button onClick={() => setShowModal(false)} style={styles.modalClose}>
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Proposed Budget */}
              <label style={styles.fieldLabel}>
                Your Proposed Budget (DZD) <span style={{ color: '#E74C3C' }}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <DollarSign size={16} style={{ color: '#ADB5BD', flexShrink: 0 }} />
                <input
                  type="number"
                  min="0"
                  value={proposedBudget}
                  onChange={(e) => { setProposedBudget(e.target.value); setBudgetError(''); }}
                  placeholder={`e.g. ${project?.budget ?? 500000}`}
                  style={{
                    ...styles.fieldInput,
                    borderColor: budgetError ? '#E74C3C' : '#DEE2E6',
                  }}
                />
              </div>
              {budgetError && <p style={styles.fieldError}>{budgetError}</p>}
              <p style={styles.fieldHint}>
                Project asking price: <strong>{formatBudget(project?.budget ?? 0)}</strong>
              </p>

              {/* Message (optional) */}
              <label style={{ ...styles.fieldLabel, marginTop: '1rem' }}>
                Message to project owner <span style={{ color: '#ADB5BD', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Introduce yourself or ask a question…"
                rows={3}
                style={styles.fieldTextarea}
              />
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSubmitInterest} style={styles.submitBtn}>
                <Heart size={16} />
                Submit Interest
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 64px)',
    backgroundColor: '#F8F9FA',
    padding: '1.5rem',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#FFFFFF',
    color: '#495057',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    fontFamily: 'inherit',
  },
  imageWrapper: {
    width: '100%',
    height: '320px',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    backgroundColor: '#E9ECEF',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  notFound: {
    textAlign: 'center',
    padding: '4rem 1rem',
    color: '#6C757D',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: '1fr 340px',
    gap: '1.5rem',
    alignItems: 'start',
  },
  mainCol: {},
  sideCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'sticky',
    top: '80px',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    padding: '2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8125rem',
    color: '#ADB5BD',
  },
  title: {
    margin: '0 0 1.5rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#212529',
    lineHeight: 1.3,
  },
  section: {
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#6C757D',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  description: {
    margin: 0,
    fontSize: '0.9375rem',
    color: '#495057',
    lineHeight: 1.7,
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  metaCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '0.875rem',
    backgroundColor: '#F8F9FA',
    borderRadius: '0.5rem',
  },
  expertCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem',
    backgroundColor: '#EBF5FB',
    borderRadius: '0.5rem',
  },
  metaLabel: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#ADB5BD',
    marginBottom: '0.125rem',
  },
  metaValue: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#212529',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  actionTitle: {
    margin: '0 0 1rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#212529',
  },
  interestBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '0.5rem',
    fontFamily: 'inherit',
  },
  messageBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: '#495057',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  lockedSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '0.75rem',
    padding: '1rem 0',
  },
  lockedText: {
    margin: 0,
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
  upgradeBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.625rem 1.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#F39C12',
    color: '#FFFFFF',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  contactInfo: {
    fontSize: '0.8125rem',
    color: '#6C757D',
  },

  /* ──── Interest Modal ──── */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem 1.5rem 1rem',
    borderBottom: '1px solid #F1F3F5',
  },
  modalTitle: {
    margin: '0 0 0.25rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#212529',
  },
  modalSub: {
    margin: 0,
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#F8F9FA',
    color: '#6C757D',
    cursor: 'pointer',
    flexShrink: 0,
  },
  modalBody: {
    padding: '1.25rem 1.5rem',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#212529',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0 0.875rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    backgroundColor: '#FFFFFF',
  },
  fieldInput: {
    flex: 1,
    padding: '0.75rem 0',
    border: 'none',
    outline: 'none',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    color: '#212529',
    backgroundColor: 'transparent',
  },
  fieldError: {
    margin: '0.375rem 0 0',
    fontSize: '0.8125rem',
    color: '#E74C3C',
  },
  fieldHint: {
    margin: '0.375rem 0 0',
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
  fieldTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    color: '#212529',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid #F1F3F5',
    backgroundColor: '#FAFAFA',
  },
  cancelBtn: {
    padding: '0.625rem 1.25rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: '#495057',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  submitBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.625rem 1.25rem',
    border: 'none',
    borderRadius: '0.5rem',
    backgroundColor: '#2ECC71',
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
