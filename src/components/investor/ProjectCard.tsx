/**
 * Project Card — displays a single project in the investor feed.
 *
 * README ref: "Unified Content Feed"
 * Each card displays: title, short description, budget (DZD),
 * region, type badge, expert name (if applicable), "View Details" button.
 *
 * README ref: "Project Comparison Feature"
 * Each project card displays a compare toggle icon.
 * The card border highlights in primary color when selected for comparison.
 */

import React from 'react';
import { Project, formatBudget, getProjectStatus } from '@/models/project';
import { TypeBadge } from '@/components/common/TypeBadge';
import { MapPin, DollarSign, GitCompare, ArrowRight, Check, Bookmark, BookmarkCheck } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  isSelectedForCompare: boolean;
  onToggleCompare: (projectId: string) => void;
  compareDisabled: boolean;
  onViewDetails: (projectId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: string) => void;
}

export function ProjectCard({
  project,
  isSelectedForCompare,
  onToggleCompare,
  compareDisabled,
  onViewDetails,
  isBookmarked,
  onToggleBookmark,
}: ProjectCardProps) {
  const hasImage = project.images && project.images.length > 0;
  const status = getProjectStatus(project.createdAt);

  return (
    <div
      onClick={() => onViewDetails(project.id)}
      style={{
        ...styles.card,
        borderColor: isSelectedForCompare ? '#2ECC71' : 'transparent',
        boxShadow: isSelectedForCompare
          ? '0 0 0 2px rgba(46,204,113,0.25), 0 4px 16px rgba(0,0,0,0.1)'
          : '0 2px 12px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
    >
      {/* Hero Image */}
      {hasImage && (
        <div style={styles.imageWrapper}>
          <img
            src={project.images[0]}
            alt={project.title}
            style={styles.image}
            loading="lazy"
            onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Content area */}
      <div style={styles.content}>
        {/* Compare toggle + Type badge */}
        <div style={styles.header}>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCompare(project.id); }}
            disabled={!isSelectedForCompare && compareDisabled}
            style={{
              ...styles.compareBtn,
              backgroundColor: isSelectedForCompare ? '#2ECC71' : '#F8F9FA',
              color: isSelectedForCompare ? '#FFFFFF' : compareDisabled ? '#DEE2E6' : '#6C757D',
              borderColor: isSelectedForCompare ? '#2ECC71' : '#E9ECEF',
            }}
            title={isSelectedForCompare ? 'Remove from comparison' : 'Add to comparison'}
          >
            {isSelectedForCompare ? <Check size={16} /> : <GitCompare size={16} />}
          </button>
          <TypeBadge type={project.type} />
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '99px',
              backgroundColor:
                status === 'new' ? '#E8F8F0' : status === 'hot' ? '#FEF9E7' : '#FDECEA',
              color:
                status === 'new' ? '#27AE60' : status === 'hot' ? '#E67E22' : '#C0392B',
              border: `1px solid ${
                status === 'new' ? '#A9DFBF' : status === 'hot' ? '#FAD7A0' : '#F5B7B1'
              }`,
              fontSize: '0.6875rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'new' ? 'New' : status === 'hot' ? 'Hot 🔥' : 'Closing soon'}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(project.id); }}
            style={{
              ...styles.compareBtn,
              marginLeft: 'auto',
              backgroundColor: isBookmarked ? '#FEF9E7' : '#F8F9FA',
              color: isBookmarked ? '#F39C12' : '#6C757D',
              borderColor: isBookmarked ? '#F39C12' : '#E9ECEF',
            }}
            title={isBookmarked ? 'Remove bookmark' : 'Save project'}
          >
            {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Title */}
        <h3 style={styles.title}>{project.title}</h3>

        {/* Description */}
        <p style={styles.description}>{project.shortDescription}</p>

        {/* Meta: Budget + Region */}
        <div style={styles.metaRow}>
          <span style={styles.budget}>
            <DollarSign size={14} style={{ color: '#2ECC71' }} />
            {formatBudget(project.budget)}
          </span>
          <span style={styles.region}>
            <MapPin size={14} style={{ color: '#6C757D' }} />
            {project.region}
          </span>
        </div>

        {/* View Details link */}
        <div style={styles.viewRow}>
          <button onClick={(e) => { e.stopPropagation(); onViewDetails(project.id); }} style={styles.viewBtn}>
            <ArrowRight size={16} />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '0.75rem',
    border: '2px solid',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  imageWrapper: {
    width: '100%',
    height: '180px',
    overflow: 'hidden',
    backgroundColor: '#E9ECEF',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  content: {
    padding: '1rem 1.25rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    flex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  },
  compareBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    border: '1.5px solid',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.15s',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '1.0625rem',
    fontWeight: 700,
    color: '#212529',
    lineHeight: 1.3,
  },
  description: {
    margin: 0,
    fontSize: '0.8125rem',
    color: '#6C757D',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.25rem',
  },
  budget: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#2ECC71',
  },
  region: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8125rem',
    color: '#6C757D',
  },
  viewRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 'auto',
    paddingTop: '0.5rem',
  },
  viewBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.5rem 0',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#2ECC71',
    fontSize: '0.8125rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'color 0.15s',
  },
};
