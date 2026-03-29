/**
 * Comparison Sheet — modal for side-by-side project comparison.
 *
 * README ref: "Project Comparison Feature"
 * - Allows investors to evaluate up to 3 projects side-by-side
 * - Modal bottom sheet (75% of screen height on mobile, centered modal on web)
 * - Row-by-row comparison table
 *
 * Comparison fields:
 *   Project Title, Type (color-coded badge), Budget (lowest highlighted),
 *   Region, Category, Production Estimate, Expert Name
 *
 * UI details:
 *   - "Best" budget (lowest) highlighted with primary-color background
 *   - "Clear Selection" button resets all
 *   - "Done" button closes without clearing
 */

import React from 'react';
import { Project, formatBudget } from '@/models/project';
import { TypeBadge } from '@/components/common/TypeBadge';
import { X, GitCompare, MapPin } from 'lucide-react';

interface ComparisonSheetProps {
  projects: Project[];
  onClose: () => void;
  onClearSelection: () => void;
}

interface ComparisonRow {
  label: string;
  render: (project: Project, isLowestBudget: boolean) => React.ReactNode;
}

export function ComparisonSheet({ projects, onClose, onClearSelection }: ComparisonSheetProps) {
  if (projects.length < 2) return null;

  const lowestBudget = Math.min(...projects.map((p) => p.budget));

  const rows: ComparisonRow[] = [
    {
      label: 'Type',
      render: (p) => <TypeBadge type={p.type} size="sm" />,
    },
    {
      label: 'Budget',
      render: (p, isLowest) => (
        <span
          style={{
            fontWeight: 600,
            color: isLowest ? '#FFFFFF' : '#2ECC71',
            backgroundColor: isLowest ? '#2ECC71' : 'transparent',
            padding: isLowest ? '4px 12px' : '4px 0',
            borderRadius: '6px',
            fontSize: '0.875rem',
          }}
        >
          {formatBudget(p.budget)}
        </span>
      ),
    },
    {
      label: 'Region',
      render: (p) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={14} style={{ color: '#6C757D' }} />
          {p.region}
        </span>
      ),
    },
    {
      label: 'Category',
      render: (p) => <span>{p.category}</span>,
    },
    {
      label: 'Production',
      render: (p) => <span>{p.productionEstimate || 'N/A'}</span>,
    },
    {
      label: 'Expert',
      render: (p) => (
        <span style={{ color: p.expertName ? '#212529' : '#ADB5BD' }}>
          {p.expertName || 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        {/* Drag handle */}
        <div style={styles.handleBar}>
          <div style={styles.handle} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <GitCompare size={22} style={{ color: '#2D6A3F' }} />
            <h2 style={styles.title}>Project Comparison</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Table */}
        <div style={styles.tableWrapper}>
          {/* Project names row */}
          <div style={styles.row}>
            <div style={styles.labelCell}>Project</div>
            {projects.map((p) => (
              <div key={p.id} style={styles.valueCell}>
                <span style={styles.projectName}>{p.title}</span>
              </div>
            ))}
          </div>

          <div style={styles.divider} />

          {/* Data rows */}
          {rows.map((row, i) => (
            <React.Fragment key={row.label}>
              <div style={styles.row}>
                <div style={styles.labelCell}>{row.label}</div>
                {projects.map((p) => (
                  <div key={p.id} style={styles.valueCell}>
                    {row.render(p, p.budget === lowestBudget)}
                  </div>
                ))}
              </div>
              {i < rows.length - 1 && <div style={styles.divider} />}
            </React.Fragment>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button onClick={onClearSelection} style={styles.clearBtn}>
            Clear Selection
          </button>
          <button onClick={onClose} style={styles.doneBtn}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 2000,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1.25rem 1.25rem 0 0',
    width: '100%',
    maxWidth: '640px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
    animation: 'slideUp 0.3s ease-out',
  },
  handleBar: {
    display: 'flex',
    justifyContent: 'center',
    padding: '0.75rem 0 0.25rem',
  },
  handle: {
    width: '40px',
    height: '4px',
    borderRadius: '2px',
    backgroundColor: '#DEE2E6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1.5rem 1rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#212529',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#F8F9FA',
    color: '#6C757D',
    cursor: 'pointer',
  },
  tableWrapper: {
    flex: 1,
    overflow: 'auto',
    padding: '0 1.5rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.875rem 0',
    gap: '0.5rem',
  },
  labelCell: {
    width: '100px',
    minWidth: '100px',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#6C757D',
    flexShrink: 0,
  },
  valueCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: '0.8125rem',
    color: '#212529',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectName: {
    fontWeight: 700,
    color: '#212529',
    fontSize: '0.875rem',
    lineHeight: 1.3,
    textAlign: 'center',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  divider: {
    height: '1px',
    backgroundColor: '#F1F3F5',
  },
  footer: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem 1.5rem 1.5rem',
    borderTop: '1px solid #F1F3F5',
  },
  clearBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    border: '1.5px solid #DEE2E6',
    borderRadius: '0.5rem',
    backgroundColor: '#FFFFFF',
    color: '#2ECC71',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  doneBtn: {
    flex: 1.5,
    padding: '0.75rem',
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
